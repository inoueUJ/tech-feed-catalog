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
  tags?: string[]
  source_mode?: string
  same_as?: string
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
  tags?: { id: string; group: string; label_en: string; label_ja: string }[]
  feeds: Feed[]
}

const DATA = catalog as Catalog
const PROTOCOL_VERSION = '2025-06-18'

const CATEGORY_IDS = DATA.categories.map((c) => c.id)
const TAG_IDS = (DATA.tags ?? []).map((t) => t.id)

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
        tag: {
          type: 'string',
          enum: TAG_IDS,
          description: 'Restrict to feeds about one technology or topic (e.g. claude, rust, cloudflare). See list_categories for the vocabulary.',
        },
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
    description: 'List the catalog categories with how many feeds each contains, and the tag vocabulary (technology / topic ids usable with search_feeds).',
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

// Aggregators and other firehoses cannot be drained oldest-first at a few items per run.
const isFirehose = (feed: Feed) => feed.category === 'aggregators' || (volumeNumber(feed.volume) ?? 0) > 100

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
    if (args.tag && !(feed.tags ?? []).includes(args.tag as string)) return false
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
    tags: (DATA.tags ?? []).map((tag) => ({
      ...tag,
      feed_count: DATA.feeds.filter((feed) => (feed.tags ?? []).includes(tag.id)).length,
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
  const chosen: Feed[] = []
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
    chosen.push(feed)
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
    if (isFirehose(feed) && feed.type !== 'sitemap') {
      lines.push('    # firehose: take only the newest N per run instead of draining a backlog')
      lines.push('    mode: latest')
    }
  }

  const notes: string[] = []
  for (const feed of chosen) {
    const twin = feed.same_as ? chosen.find((other) => other.url === feed.same_as) : undefined
    if (twin) notes.push(`${feed.name} and ${twin.name} publish the same articles; keep only one of them.`)
  }
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

// ---------------------------------------------------------------------------------------
// GET /check?url=… — fetch one feed URL once and report what a subscriber would get.
// Used by the config builder for feeds that are not in the catalog (Zenn topics, Qiita
// tags, personal blogs). Read-only, no credentials, public http(s) hosts only.
// ---------------------------------------------------------------------------------------
const CHECK_UA = 'tech-feed-catalog/1.0 (+https://github.com/inoueUJ/tech-feed-catalog; feed check)'
const CHECK_MAX_BYTES = 1_000_000
const CHECK_TIMEOUT_MS = 12_000

function publicHttpUrl(raw: string): URL | null {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return null
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
  const host = url.hostname.toLowerCase()
  // No IP literals, no bare names: this is a feed checker, not a proxy into private networks.
  if (!host.includes('.') || /^\d+\.\d+\.\d+\.\d+$/.test(host) || host.includes(':')) return null
  if (host.endsWith('.local') || host.endsWith('.internal') || host.endsWith('.localhost')) return null
  return url
}

interface CheckResult {
  ok: boolean
  status: number
  kind?: 'rss' | 'atom' | 'html' | 'unknown'
  title?: string
  entries?: number
  has_timestamps?: boolean
  latest?: string | null
  volume?: string | null
  blocked?: boolean
  error?: string
}

function decodeEntities(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

async function checkFeed(raw: string): Promise<CheckResult> {
  const url = publicHttpUrl(raw)
  if (!url) return { ok: false, status: 0, error: 'Only public http(s) URLs can be checked.' }

  let response: Response
  try {
    response = await fetch(url.toString(), {
      headers: {
        'User-Agent': CHECK_UA,
        Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.5',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(CHECK_TIMEOUT_MS),
    })
  } catch (error) {
    return { ok: false, status: 0, error: `Fetch failed: ${error instanceof Error ? error.message : String(error)}` }
  }

  const blocked = response.status === 403 || response.status === 429 || response.headers.get('cf-mitigated') === 'challenge'
  if (!response.ok) {
    return { ok: false, status: response.status, blocked, error: blocked ? 'Bot protection' : `HTTP ${response.status}` }
  }

  const text = (await response.text()).slice(0, CHECK_MAX_BYTES)
  const kind: CheckResult['kind'] = /<feed[\s>]/i.test(text)
    ? 'atom'
    : /<rss[\s>]/i.test(text) || /<rdf:RDF[\s>]/i.test(text)
      ? 'rss'
      : /<html[\s>]/i.test(text) || /<!doctype html/i.test(text)
        ? 'html'
        : 'unknown'
  if (kind === 'html') {
    return { ok: false, status: response.status, kind, error: 'This is an HTML page, not a feed. Look for an RSS/Atom link on the page.' }
  }
  if (kind === 'unknown') return { ok: false, status: response.status, kind, error: 'Not recognizable as RSS or Atom.' }

  const chunks = text.split(kind === 'atom' ? /<entry[\s>]/i : /<item[\s>]/i).slice(1)
  const entryDates = chunks.map((chunk) => {
    const match = chunk.match(/<(?:pubDate|published|updated|dc:date)[^>]*>([^<]+)</i)
    const date = match ? new Date(match[1].trim()) : null
    return date && !Number.isNaN(date.getTime()) ? date : null
  })
  const dated = entryDates.filter((d): d is Date => d !== null)
  const head = text.split(kind === 'atom' ? /<entry[\s>]/i : /<item[\s>]/i)[0]
  const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const title = titleMatch ? decodeEntities(titleMatch[1]).slice(0, 80) : ''

  let latest: string | null = null
  let volume: string | null = null
  if (dated.length) {
    const times = dated.map((d) => d.getTime())
    const newest = Math.max(...times)
    const oldest = Math.min(...times)
    latest = new Date(newest).toISOString().slice(0, 10)
    const ninetyDaysAgo = Date.now() - 90 * 86_400_000
    const spanDays = (newest - oldest) / 86_400_000
    if (oldest < ninetyDaysAgo) {
      // The feed reaches back further than 90 days: count what it published in the last 90.
      const recent = times.filter((t) => t >= ninetyDaysAgo).length
      volume = recent === 0 ? '<1' : `~${Math.max(1, Math.round(recent / 3))}`
    } else if (dated.length >= 5 && spanDays >= 3) {
      // A short window (e.g. the newest 20 posts): extrapolate, but only with enough signal.
      const perMonth = Math.round((dated.length / Math.max(1, spanDays)) * 30)
      volume = perMonth < 1 ? '<1' : `~${perMonth}`
    }
  }

  return {
    ok: chunks.length > 0,
    status: response.status,
    kind,
    title,
    entries: chunks.length,
    has_timestamps: chunks.length > 0 && dated.length === chunks.length,
    latest,
    volume,
    blocked: false,
    error: chunks.length ? undefined : 'The feed has no entries.',
  }
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

    if (url.pathname === '/check') {
      if (request.method !== 'GET') return new Response('Use GET.', { status: 405, headers: CORS })
      const target = url.searchParams.get('url') ?? ''
      const result = await checkFeed(target)
      return Response.json(result, {
        status: result.status === 0 && !result.ok ? 400 : 200,
        headers: { ...CORS, 'Cache-Control': 'public, max-age=300' },
      })
    }

    if (url.pathname !== '/mcp') {
      return new Response(
        'tech-feed-catalog MCP server\n\n' +
          'MCP endpoint: POST /mcp (Streamable HTTP)\n' +
          'Raw data:     GET  /feeds.json\n' +
          'Feed check:   GET  /check?url=<feed url>\n' +
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
