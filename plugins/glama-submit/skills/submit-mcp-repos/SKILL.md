---
name: submit-mcp-repos
description: Bulk-submit a GitHub user's public MCP server repos to the glama.ai registry by committing a glama.json to each, always previewing with the dry-run first. Use when asked to list many MCP repos on Glama.
---

# glama-submit

`index.js` in `nirholas/automate-glama-submit` (bin `glama-submit`, not published to npm, so run it from a clone) lists a user's repos through the GitHub API, picks the MCP ones, and writes a `glama.json` to each default branch. Requires Node.js 18 or newer. It has no dependencies.

## How it chooses repos

All repos the user owns via `GET /users/<GITHUB_USERNAME>/repos`. A repo counts as MCP when its name, description or topics contain `mcp`, `model-context-protocol`, `modelcontextprotocol` or `model context protocol`. It skips archived and private repos, and repos whose existing `glama.json` already contains the username.

## What it writes

A `glama.json` with `$schema` set to `https://glama.ai/mcp/schemas/server.json` and `maintainers` set to the username, committed with the message `chore: add glama.json for MCP registry submission`. If a `glama.json` exists without the username, the script replaces it. That is a commit to each repo's default branch, so treat it as a write action.

## Environment

- `GITHUB_TOKEN`: a GitHub token with contents write access to the repos. The user exports it in their own shell; never ask for it in chat and never print it.
- `GITHUB_USERNAME`: the account whose repos are scanned.

## Steps

1. Clone and enter the repo:

   ```bash
   git clone https://github.com/nirholas/automate-glama-submit
   cd automate-glama-submit
   ```

2. Preview. This changes nothing and reports `would create` or `would update` per repo:

   ```bash
   GITHUB_USERNAME=<user> node index.js --dry-run
   ```

   (`GITHUB_TOKEN` must already be exported.) `npm run dry-run` is the same.

3. Show the user the list of repos that would change. Only after an explicit yes, run it for real:

   ```bash
   GITHUB_USERNAME=<user> node index.js
   ```

4. Report the summary it prints: counts of created, updated, skipped and failed, and each failure message.

The script waits 400 ms between repos to stay under GitHub rate limits. A failure on one repo does not stop the rest.
