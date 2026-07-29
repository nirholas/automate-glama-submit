# glama-submit

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
