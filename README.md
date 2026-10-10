# glama-submit

<!-- three.ws:badges -->
[![GitHub stars](https://img.shields.io/github/stars/nirholas/automate-glama-submit?style=flat&logo=github)](https://github.com/nirholas/automate-glama-submit/stargazers) [![Last commit](https://img.shields.io/github/last-commit/nirholas/automate-glama-submit?style=flat)](https://github.com/nirholas/automate-glama-submit/commits) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat)](https://github.com/nirholas/automate-glama-submit/pulls) [![AI agent friendly](https://img.shields.io/badge/AI%20agents-AGENTS.md%20%2B%20llms.txt-6d5dfc?style=flat)](https://github.com/nirholas/automate-glama-submit/blob/HEAD/AGENTS.md)
<!-- /three.ws:badges -->


Bulk-submit all your MCP server repos to [glama.ai](https://glama.ai/mcp/servers) in one command.

Glama indexes MCP servers via a `glama.json` file in each repo root. This tool automatically finds every MCP repo in your GitHub account and commits that file to each one.

## How it works

1. Fetches all your public GitHub repos
2. Filters for MCP repos (by name, description, or topic containing `mcp` / `model-context-protocol`)
3. Commits a `glama.json` to each repo's default branch
4. Glama crawls GitHub and your repos appear at [glama.ai/mcp/servers](https://glama.ai/mcp/servers) within ~24h

## Usage

```bash
GITHUB_TOKEN=ghp_... GITHUB_USERNAME=yourname npx glama-submit
```

Dry run (preview only, no changes):

```bash
GITHUB_TOKEN=ghp_... GITHUB_USERNAME=yourname npx glama-submit --dry-run
```

## Requirements

- Node.js >= 18
- A GitHub [Personal Access Token](https://github.com/settings/tokens/new) with `public_repo` scope

## Token setup

1. Go to [github.com/settings/tokens/new](https://github.com/settings/tokens/new)
2. Check **`public_repo`** scope
3. Generate and copy the token

## What gets committed

A `glama.json` is added to each MCP repo root:

```json
{
  "$schema": "https://glama.ai/mcp/schemas/server.json",
  "maintainers": ["your-github-username"]
}
```

Repos that already have a valid `glama.json` are skipped automatically.

## MCP detection

A repo is considered an MCP server if its name, description, or GitHub topics contain any of:

- `mcp`
- `model-context-protocol`
- `modelcontextprotocol`
- `model context protocol`

## Documentation

- [How it works](docs/how-it-works.md) — detailed walkthrough of the submission flow.

## License

All rights reserved. See [LICENSE](LICENSE).

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=nirholas/automate-glama-submit&type=Date)](https://www.star-history.com/#nirholas/automate-glama-submit&Date)

<!-- three.ws:growth -->
## Support the project

If automate-glama-submit saves you time, **[star it on GitHub](https://github.com/nirholas/automate-glama-submit)**. Stars are how other developers and AI agents find the repositories worth trusting, and they cost you one click.

Know someone who would use it? [Post on X](https://twitter.com/intent/tweet?text=automate-glama-submit%3A%20Bulk-submit%20all%20your%20MCP%20server%20repos%20to%20glama.ai%20in%20one%20command&url=https%3A%2F%2Fgithub.com%2Fnirholas%2Fautomate-glama-submit) · [Share on Bluesky](https://bsky.app/intent/compose?text=automate-glama-submit%3A%20Bulk-submit%20all%20your%20MCP%20server%20repos%20to%20glama.ai%20in%20one%20command%20https%3A%2F%2Fgithub.com%2Fnirholas%2Fautomate-glama-submit) · [Share on LinkedIn](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgithub.com%2Fnirholas%2Fautomate-glama-submit) · [Submit to Hacker News](https://news.ycombinator.com/submitlink?u=https%3A%2F%2Fgithub.com%2Fnirholas%2Fautomate-glama-submit&t=automate-glama-submit%3A%20Bulk-submit%20all%20your%20MCP%20server%20repos%20to%20glama.ai%20in%20one%20command) · [Share on Reddit](https://www.reddit.com/submit?url=https%3A%2F%2Fgithub.com%2Fnirholas%2Fautomate-glama-submit&title=automate-glama-submit%3A%20Bulk-submit%20all%20your%20MCP%20server%20repos%20to%20glama.ai%20in%20one%20command)

## Built for AI agents too

Coding agents and LLM tooling can read this repo directly: [AGENTS.md](./AGENTS.md), [llms.txt](./llms.txt), [llms-full.txt](./llms-full.txt). Point an agent at `https://github.com/nirholas/automate-glama-submit` and it has the context it needs.

## More from the same author

- [All repositories by nirholas](https://github.com/nirholas/nirholas#readme): the full catalog, grouped by topic
- [three.ws](https://three.ws): the platform for 3D AI agents with Solana wallets, a skill marketplace and x402 payments
- Questions or ideas: [open an issue](https://github.com/nirholas/automate-glama-submit/issues) or [start a discussion](https://github.com/nirholas/automate-glama-submit/discussions)

## Contributors

[![Contributors](https://contrib.rocks/image?repo=nirholas/automate-glama-submit)](https://github.com/nirholas/automate-glama-submit/graphs/contributors)

<!-- /three.ws:growth -->
