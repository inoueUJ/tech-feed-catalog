# tech-feed-catalog MCP server

Exposes the feed catalog to AI agents over MCP (Streamable HTTP), running on Cloudflare Workers.

## Tools

| Tool | What it does |
|---|---|
| `search_feeds` | Filter by category, kind, language, radio-friendliness, and volume. Returns full entries including the measured metadata. |
| `list_categories` | Categories with feed counts. |
| `build_config` | Turn a list of feed URLs into a ready-to-paste notebooklm-radio `feeds:` block. Firehose feeds get `mode: latest`; two entries that publish the same articles (`same_as`) are pointed out in `note`. |

The catalog is baked into the bundle at build time, so requests don't depend on GitHub being up. Redeploy to publish catalog changes.

## Connecting

Claude Code:

```bash
claude mcp add --transport http tech-feed-catalog https://tech-feed-catalog-mcp.yuji-inoue11.workers.dev/mcp
```

Any other MCP client: point it at the same `/mcp` URL using the Streamable HTTP transport. No authentication — the catalog is public, read-only data.

Not speaking MCP? `GET /feeds.json` on the same host returns the whole catalog as JSON, CORS-enabled.

`GET /check?url=<feed url>` fetches one public feed URL once and reports what a subscriber would get: `{ok, status, kind (rss|atom|html), title, entries, has_timestamps, latest, volume (~posts/month), blocked}`. `blocked: true` means the host answered 403/429 or a Cloudflare challenge to an automated client. The config builder uses it for feeds that are not in the catalog. Public http(s) hosts only, 12-second timeout, no credentials, responses cached for five minutes.

## Develop and deploy

```bash
npm install
npm run dev        # local server on :8787 (bundles the data first)
npm run typecheck
npm run deploy     # wrangler deploy
```

`npm run deploy` requires `wrangler login` and copies `../site/feeds.json` into the bundle, so run `python scripts/build.py` in the repo root first if you changed `feeds/*.yaml`.

## Try it without a client

```bash
curl -s https://tech-feed-catalog-mcp.yuji-inoue11.workers.dev/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call",
       "params":{"name":"search_feeds","arguments":{"category":"ai-models","radio_friendly":"high","limit":3}}}'
```
