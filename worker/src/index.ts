/**
 * MCP server exposing the feed catalog to AI agents.
 *
 * Streamable HTTP transport, implemented directly against the JSON-RPC surface —
 * the catalog is a few read-only queries over a static document, so pulling in an
 * agent framework would be more moving parts than the thing itself.
 *
 * The catalog data is baked in at build time (see scripts/bundle_data.mjs), so a
 * request never depends on GitHub being reachable.
 */

import catalog from '../data.json'

interface Feed {
  name: string
  url: string
  type?: string
  prefix?: string
  site: string
  category: string
  kind: string
  language: string
  source_mode?: string
  volume?: string
  radio_friendly?: string
  has_timestamps?: boolean
  latest_post?: string
  status?: string
  status_detail?: string
  last_checked?: string
}

interface Catalog {
  categories: { id: string; label_en: string; label_ja: string }[]
  feeds: Feed[]
}

const DATA = catalog as Catalog
const PROTOCOL_VERSION = '2025-06-18'

const CATEGORY_IDS = DATA.categories.map((c) => c.id)

const TOOLS = [
  {
    name: 'search_feeds',
    description:
      'Search the catalog of developer RSS feeds. Every feed is validated weekly, and carries measured ' +
      'metadata: publishing volume, whether entries are timestamped, and radio_friendly — how well the ' +
      'feed suits a generated audio summary (high = long-form narrative posts, low = one-line changelog ' +
      'entries). Use this to pick feeds for an RSS reader, a digest bot, or a notebooklm-radio config.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Free text matched against the feed name and site URL.' },
        category: { type: 'string', enum: CATEGORY_IDS, description: 'Restrict to one category.' },
        kind: {
          type: 'string',
          enum: ['blog', 'changelog', 'release-notes'],
          description: 'blog = narrative posts, changelog = many short entries, release-notes = versions.',
        },
        language: { type: 'string', enum: ['en', 'ja'] },
        radio_friendly: {
          type: 'string',
          enum: ['high', 'medium', 'low'],
          description: 'Minimum suitability for audio summaries; "high" returns only the best candidates.',
        },
        max_volume_per_month: {
          type: 'number',
          description: 'Drop firehose feeds that publish more than this many posts per month.',
        },
        limit: { type: 'number', description: 'Maximum results (default 20).' },
      },
    },
  },
  {
    name: 'list_categories',
    description: 'List the catalog categories with how many feeds each contains.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'build_config',
    description:
      'Build a ready-to-paste notebooklm-radio config.yaml feeds: block from a list of feed URLs ' +
      '(as returned by search_feeds), assigning each one a notebook topic. Several sitemap-based ' +
      'sources can share one sitemap URL and differ only by prefix; for those, pass "url|prefix".',
    inputSchema: {
      type: 'object',
      required: ['urls'],
      properties: {
        urls: {
          type: 'array',
          items: { type: 'string' },
          description:
            'Feed URLs from search_feeds results. For a sitemap source shared by several entries, ' +
            'pass "<url>|<prefix>" to say which one you mean.',
        },
        topic: {
          type: 'string',
          description: 'Notebook topic for all of them (default: derived from each feed category).',
        },
      },
    },
  },
]

const TOPIC_DEFAULTS: Record<string, string> = {
  'ai-models': 'AI',
  'ai-coding': 'AI',
  infra: 'Infra',
  languages: 'Dev',
  frontend: 'Web',
  security: 'Security',
  companies: 'Eng',
  aggregators: 'News',
}

const RANK: Record<string, number> = { high: 3, medium: 2, low: 1 }

function volumeNumber(volume?: string): number | null {
  if (!volume || volume === 'unknown') return null
  if (volume.startsWith('<1')) return 0.5
  const match = volume.match(/(\d+)/)
  return match ? Number(match[1]) : null
}

function searchFeeds(args: Record<string, unknown>) {
  const limit = typeof args.limit === 'number' ? Math.min(args.limit, 100) : 20
  const query = typeof args.query === 'string' ? args.query.toLowerCase() : null

  let results = DATA.feeds.filter((feed) => {
    if (args.category && feed.category !== args.category) return false
    if (args.kind && feed.kind !== args.kind) return false
    if (args.language && feed.language !== args.language) return false
    if (args.radio_friendly) {
      const want = RANK[args.radio_friendly as string] ?? 0
      if ((RANK[feed.radio_friendly ?? ''] ?? 0) < want) return false
    }
    if (typeof args.max_volume_per_month === 'number') {
      const volume = volumeNumber(feed.volume)
      if (volume === null || volume > args.max_volume_per_month) return false
    }
    if (query) {
      const haystack = `${feed.name} ${feed.site} ${feed.category}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })

  // Best audio candidates first; the common ask is "what should I subscribe to".
  results = results.sort((a, b) => (RANK[b.radio_friendly ?? ''] ?? 0) - (RANK[a.radio_friendly ?? ''] ?? 0))

  return {
    total_matched: results.length,
    returned: Math.min(results.length, limit),
    feeds: results.slice(0, limit),
  }
}

function listCategories() {
  return {
    categories: DATA.categories.map((category) => ({
      ...category,
      feed_count: DATA.feeds.filter((feed) => feed.category === category.id).length,
    })),
  }
}

function yamlString(value: string): string {
  return /^[\w .()/-]+$/.test(value) ? value : JSON.stringify(value)
}

/**
 * Resolve one reference to a catalog entry.
 *
 * A bare sitemap URL is not a unique key: two entries can read different prefixes
 * of the same sitemap (Anthropic's /news/ and /engineering/, for instance). Picking
 * the first match would silently drop the other one, so an ambiguous reference is
 * reported rather than guessed.
 */
function resolveFeed(ref: string): { feed?: Feed; candidates?: Feed[] } {
  const [url, prefix] = ref.split('|')
  if (prefix) {
    const exact = DATA.feeds.find((f) => f.url === url && f.prefix === prefix)
    return exact ? { feed: exact } : {}
  }
  const matches = DATA.feeds.filter((f) => f.url === url)
  if (matches.length === 1) return { feed: matches[0] }
  if (matches.length > 1) return { candidates: matches }
  return {}
}

function buildConfig(args: Record<string, unknown>) {
  const refs = Array.isArray(args.urls) ? (args.urls as string[]) : []
  const forcedTopic = typeof args.topic === 'string' ? args.topic : null

  const lines: string[] = ['feeds:']
  const unknown: string[] = []
  const ambiguous: { url: string; candidates: { name: string; ref: string }[] }[] = []
  for (const ref of refs) {
    const { feed, candidates } = resolveFeed(ref)
    if (candidates) {
      ambiguous.push({
        url: ref,
        candidates: candidates.map((c) => ({ name: c.name, ref: `${c.url}|${c.prefix}` })),
      })
      continue
    }
    if (!feed) {
      unknown.push(ref)
      continue
    }
    const topic = forcedTopic ?? TOPIC_DEFAULTS[feed.category] ?? 'AI'
    lines.push(`  - name: ${yamlString(feed.name)}`)
    if (feed.type === 'sitemap') {
      lines.push('    type: sitemap')
      lines.push(`    url: ${feed.url}`)
      lines.push(`    prefix: ${feed.prefix}`)
    } else {
      lines.push(`    url: ${feed.url}`)
    }
    lines.push(`    topic: ${yamlString(topic)}`)
    if (feed.source_mode === 'text') {
      lines.push('    # article pages are bot-protected; submit the feed summary instead')
      lines.push('    source_mode: text')
    }
  }

  const notes: string[] = []
  if (unknown.length) notes.push('Some URLs are not in the catalog and were skipped.')
  if (ambiguous.length) {
    notes.push(
      'Some sitemap URLs are shared by more than one catalog entry. Re-run with the "url|prefix" ' +
        'form shown in ambiguous_urls to choose which one you want.',
    )
  }

  return {
    config_yaml: lines.join('\n'),
    unknown_urls: unknown,
    ambiguous_urls: ambiguous,
    note: notes.length ? notes.join(' ') : undefined,
  }
}

function callTool(name: string, args: Record<string, unknown>) {
  if (name === 'search_feeds') return searchFeeds(args)
  if (name === 'list_categories') return listCategories()
  if (name === 'build_config') return buildConfig(args)
  throw new Error(`Unknown tool: ${name}`)
}

function rpcResult(id: unknown, result: unknown) {
  return { jsonrpc: '2.0', id, result }
}

function rpcError(id: unknown, code: number, message: string) {
  return { jsonrpc: '2.0', id, error: { code, message } }
}

function handleRpc(request: { method: string; id?: unknown; params?: Record<string, unknown> }) {
  const { method, id, params } = request

  if (method === 'initialize') {
    return rpcResult(id, {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: { tools: {} },
      serverInfo: { name: 'tech-feed-catalog', version: '1.0.0' },
      instructions:
        'A catalog of developer RSS feeds, re-validated weekly. Call search_feeds to find sources, ' +
        'then build_config to turn a selection into a notebooklm-radio config block.',
    })
  }
  if (method === 'tools/list') return rpcResult(id, { tools: TOOLS })
  if (method === 'tools/call') {
    const name = params?.name as string
    const args = (params?.arguments as Record<string, unknown>) ?? {}
    try {
      const output = callTool(name, args)
      return rpcResult(id, { content: [{ type: 'text', text: JSON.stringify(output, null, 2) }] })
    } catch (error) {
      return rpcResult(id, {
        content: [{ type: 'text', text: String(error instanceof Error ? error.message : error) }],
        isError: true,
      })
    }
  }
  // Notifications carry no id and expect no reply.
  if (id === undefined) return null
  return rpcError(id, -32601, `Method not found: ${method}`)
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Mcp-Session-Id, MCP-Protocol-Version',
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS })

    // Plain HTTP access to the same data, for anyone not speaking MCP.
    if (url.pathname === '/feeds.json') {
      return Response.json(DATA, { headers: CORS })
    }

    if (url.pathname !== '/mcp') {
      return new Response(
        'tech-feed-catalog MCP server\n\n' +
          'MCP endpoint: POST /mcp (Streamable HTTP)\n' +
          'Raw data:     GET  /feeds.json\n' +
          'Source:       https://github.com/inoueUJ/tech-feed-catalog\n',
        { status: url.pathname === '/' ? 200 : 404, headers: { 'Content-Type': 'text/plain', ...CORS } },
      )
    }

    if (request.method !== 'POST') {
      return new Response('Use POST for the MCP endpoint.', { status: 405, headers: CORS })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return Response.json(rpcError(null, -32700, 'Parse error'), { status: 400, headers: CORS })
    }

    // A client may batch several calls into one array.
    if (Array.isArray(body)) {
      const responses = body.map((item) => handleRpc(item)).filter((r) => r !== null)
      return responses.length
        ? Response.json(responses, { headers: CORS })
        : new Response(null, { status: 202, headers: CORS })
    }

    const response = handleRpc(body as { method: string; id?: unknown })
    return response
      ? Response.json(response, { headers: CORS })
      : new Response(null, { status: 202, headers: CORS })
  },
}
