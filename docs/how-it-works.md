# How glama-submit works

## Glama's discovery mechanism

Glama indexes MCP servers by crawling GitHub repositories for a `glama.json` file in the repo root. Once this file is present and contains your GitHub username in the `maintainers` array, Glama:

1. Indexes the repo in its [MCP server directory](https://glama.ai/mcp/servers)
2. Associates the listing with your Glama account
3. Gives you access to usage reports and the ability to edit the listing

There is no manual submission form — the file is the submission.

## What glama-submit does

```
GitHub API → list all repos for user
         → filter by MCP keywords (name / description / topics)
         → for each MCP repo:
              check if glama.json already exists
              if not → PUT /repos/{owner}/{repo}/contents/glama.json
```

All writes use the GitHub Contents API with your PAT. No third-party dependencies.

## Rate limiting

The script waits 400ms between writes to stay within GitHub's secondary rate limit (max ~1 write/second sustained).

## glama.json format

```json
{
  "$schema": "https://glama.ai/mcp/schemas/server.json",
  "maintainers": ["your-github-username"]
}
```

## MCP keyword detection

A repo qualifies as an MCP server if any of the following fields contain an MCP keyword:

| Field | Source |
|---|---|
| Repo name | `repo.name` |
| Description | `repo.description` |
| Topics | `repo.topics[]` |

Keywords: `mcp`, `model-context-protocol`, `modelcontextprotocol`, `model context protocol`

## After submission

Glama typically indexes new repos within 24 hours. Check your listings at [glama.ai/mcp/servers](https://glama.ai/mcp/servers).
