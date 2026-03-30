#!/usr/bin/env node
// glama-submit — bulk-submit all your MCP repos to glama.ai
// by nichxbt
//
// Usage:
//   GITHUB_TOKEN=ghp_... GITHUB_USERNAME=yourname npx glama-submit
//   GITHUB_TOKEN=ghp_... GITHUB_USERNAME=yourname npx glama-submit --dry-run

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const DRY_RUN = process.argv.includes('--dry-run');
const API = 'https://api.github.com';

if (!GITHUB_TOKEN || !GITHUB_USERNAME) {
  console.error('❌ Required env vars: GITHUB_TOKEN, GITHUB_USERNAME');
  console.error('\nExample:');
  console.error('  GITHUB_TOKEN=ghp_... GITHUB_USERNAME=yourname npx glama-submit');
  process.exit(1);
}

const HEADERS = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
  'User-Agent': 'glama-submit',
};

const GLAMA_JSON =
  JSON.stringify(
    { $schema: 'https://glama.ai/mcp/schemas/server.json', maintainers: [GITHUB_USERNAME] },
    null,
    2
  ) + '\n';

const GLAMA_JSON_B64 = Buffer.from(GLAMA_JSON).toString('base64');

const MCP_KEYWORDS = [
  'mcp',
  'model-context-protocol',
  'modelcontextprotocol',
  'model context protocol',
];

function isMcpRepo(repo) {
  const text = [repo.name, repo.description || '', ...(repo.topics || [])].join(' ').toLowerCase();
  return MCP_KEYWORDS.some((kw) => text.includes(kw));
}

async function gh(path, options = {}) {
  const res = await fetch(`${API}${path}`, { headers: HEADERS, ...options });
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.status === 204 ? null : res.json();
}

async function getAllRepos() {
  const repos = [];
  let page = 1;
  while (true) {
    const batch = await gh(`/users/${GITHUB_USERNAME}/repos?type=owner&per_page=100&page=${page}`);
    if (!batch || batch.length === 0) break;
    repos.push(...batch);
    if (batch.length < 100) break;
    page++;
  }
  return repos;
}

async function submitRepo(repo) {
  const { name, default_branch, archived, private: isPrivate } = repo;

  if (archived) return { status: 'skipped', reason: 'archived' };
  if (isPrivate) return { status: 'skipped', reason: 'private' };

  const existing = await gh(`/repos/${GITHUB_USERNAME}/${name}/contents/glama.json`);

  if (existing) {
    const content = Buffer.from(existing.content, 'base64').toString('utf8');
    if (content.includes(GITHUB_USERNAME)) {
      return { status: 'skipped', reason: 'already has glama.json' };
    }
  }

  if (DRY_RUN) {
    return { status: 'dry-run', reason: existing ? 'would update' : 'would create' };
  }

  await gh(`/repos/${GITHUB_USERNAME}/${name}/contents/glama.json`, {
    method: 'PUT',
    body: JSON.stringify({
      message: 'chore: add glama.json for MCP registry submission',
      content: GLAMA_JSON_B64,
      branch: default_branch,
      ...(existing ? { sha: existing.sha } : {}),
    }),
  });

  return { status: existing ? 'updated' : 'created' };
}

async function main() {
  console.log(`\n  glama-submit\n`);
  console.log(`  Fetching repos for ${GITHUB_USERNAME}...`);
  const allRepos = await getAllRepos();
  console.log(`  ${allRepos.length} total repos found`);

  const mcpRepos = allRepos.filter(isMcpRepo);
  console.log(`  ${mcpRepos.length} MCP repos to process\n`);

  if (DRY_RUN) console.log('  DRY RUN — no changes will be made\n');

  const results = { created: [], updated: [], skipped: [], failed: [] };

  for (let i = 0; i < mcpRepos.length; i++) {
    const repo = mcpRepos[i];
    process.stdout.write(`  [${i + 1}/${mcpRepos.length}] ${repo.name} ... `);
    try {
      const result = await submitRepo(repo);
      const label = result.reason ? `${result.status} (${result.reason})` : result.status;
      process.stdout.write(`${label}\n`);

      if (result.status === 'created' || result.status === 'dry-run') results.created.push(repo.name);
      else if (result.status === 'updated') results.updated.push(repo.name);
      else results.skipped.push(`${repo.name} — ${result.reason}`);

      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      process.stdout.write(`failed — ${err.message}\n`);
      results.failed.push(`${repo.name}: ${err.message}`);
    }
  }

  console.log('\n  ' + '─'.repeat(44));
  console.log('  Summary');
  console.log('  ' + '─'.repeat(44));
  console.log(`  Created:  ${results.created.length}`);
  console.log(`  Updated:  ${results.updated.length}`);
  console.log(`  Skipped:  ${results.skipped.length}`);
  console.log(`  Failed:   ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\n  Failed:');
    results.failed.forEach((r) => console.log(`    • ${r}`));
  }

  if (results.created.length + results.updated.length > 0) {
    console.log('\n  glama.json committed to all MCP repos.');
    console.log('  Repos will appear at https://glama.ai/mcp/servers within ~24h\n');
  }
}

main().catch((err) => {
  console.error('❌ Fatal:', err.message);
  process.exit(1);
});
