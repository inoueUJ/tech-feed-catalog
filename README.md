# tech-feed-catalog

**A curated list of developer RSS feeds that can't quietly rot.**

Every feed here is fetched weekly by CI. Dead ones get flagged in the table below instead of sitting there looking fine for two years. Each entry also carries measurements you can only get by actually reading the feed: how often it publishes, whether it timestamps its entries, and how well it works as source material for a generated audio summary.

**→ [Pick feeds visually and copy a ready-made config](https://inoueuj.github.io/tech-feed-catalog/)**

Machine-readable data: [`feeds/*.yaml`](feeds/) · [`site/feeds.json`](site/feeds.json) (single JSON blob, CORS-enabled) · [`schema.json`](schema.json)

## Why the extra columns

Most feed lists tell you a URL exists. This one tells you what happens if you subscribe:

- **Volume** — posts per month, measured over the last 90 days. A firehose and a quarterly blog need very different handling.
- **Radio** — how well the feed suits a generated audio overview (★★★ = long-form narrative posts; ★ = one-line changelog entries). Derived from the feed kind, its volume, and how much body text it actually ships.
- **Checked** — when CI last confirmed the feed responds with parseable entries.
- **¹** — the article pages sit behind bot protection, so automated fetchers get a challenge page instead of the article. Subscribe using the feed's own summary text.

Built for [notebooklm-radio](https://github.com/inoueUJ/notebooklm-radio), which turns feeds into a daily podcast, but the data is plain YAML/JSON — use it for a reader, a digest bot, a newsletter, whatever.

<!-- BEGIN CATALOG -->

**76 feeds** across 8 categories · 74 verified working

### AI models & research / AI モデル・研究

| Feed | Kind | Volume | Radio | Lang | Feed URL | Checked |
|---|---|---|---|---|---|---|
| [Anthropic Engineering](https://www.anthropic.com/engineering) | blog | <1/month | ★★★ | en | [sitemap](https://www.anthropic.com/sitemap.xml) | ✅ 2026-09-02 |
| [Anthropic News](https://www.anthropic.com/news) | blog | ~30/month | ★★★ | en | [sitemap](https://www.anthropic.com/sitemap.xml) | ✅ 2026-09-02 |
| [Google AI Blog](https://blog.google/technology/ai/) | blog | ~10/month | ★★★ | en | [RSS](https://blog.google/technology/ai/rss/) | ✅ 2026-09-02 |
| [Google DeepMind](https://deepmind.google/discover/blog/) | blog | ~10/month | ★★★ | en | [RSS](https://deepmind.google/blog/rss.xml) | ✅ 2026-09-02 |
| [Google Gemini](https://blog.google/products/gemini/) | blog | ~25/month | ★★★ | en | [RSS](https://blog.google/products/gemini/rss/) | ✅ 2026-09-02 |
| [Hugging Face](https://huggingface.co/blog) | blog | ~20/month | ★★★ | en | [RSS](https://huggingface.co/blog/feed.xml) | ✅ 2026-09-02 |
| [OpenAI News](https://openai.com/news) | blog | ~50/month | ★★ | en | [RSS](https://openai.com/news/rss.xml) ¹ | ✅ 2026-09-02 |
| [Simon Willison](https://simonwillison.net/) | blog | ~70/month | ★★★ | en | [RSS](https://simonwillison.net/atom/everything/) | ✅ 2026-09-02 |

### AI coding tools / AI コーディングツール

| Feed | Kind | Volume | Radio | Lang | Feed URL | Checked |
|---|---|---|---|---|---|---|
| [Antigravity](https://antigravity.google/blog) | blog | unknown | ★★★ | en | [sitemap](https://antigravity.google/sitemap.xml) | ✅ 2026-09-02 |
| [Claude Blog](https://claude.com/blog) | blog | ~95/month | ★★ | en | [sitemap](https://claude.com/sitemap.xml) | ✅ 2026-09-02 |
| [Claude Code](https://code.claude.com/docs/en/whats-new) | releases | ~4/month | ★★ | en | [RSS](https://code.claude.com/docs/en/whats-new/rss.xml) | ✅ 2026-09-02 |
| [Codex Changelog](https://developers.openai.com/codex/changelog) | changelog | ~15/month | ★★ | en | [RSS](https://developers.openai.com/codex/changelog/rss.xml) | ✅ 2026-09-02 |
| [Cursor Changelog](https://cursor.com/changelog) | changelog | ~6/month | ★★ | en | [RSS](https://cursor.com/changelog/rss.xml) | ✅ 2026-09-02 |
| [GitHub Copilot](https://github.blog/ai-and-ml/github-copilot/) | blog | ~8/month | ★★★ | en | [RSS](https://github.blog/ai-and-ml/github-copilot/feed/) | ✅ 2026-09-02 |
| [Zed](https://zed.dev/blog) | blog | ~2/month | ★★★ | en | [RSS](https://zed.dev/blog.rss) | ✅ 2026-09-02 |

### Cloud & infrastructure / クラウド・インフラ

| Feed | Kind | Volume | Radio | Lang | Feed URL | Checked |
|---|---|---|---|---|---|---|
| [AWS Architecture Blog](https://aws.amazon.com/blogs/architecture/) | blog | ~15/month | ★★★ | en | [RSS](https://aws.amazon.com/blogs/architecture/feed/) | ✅ 2026-09-02 |
| [AWS News](https://aws.amazon.com/new/) | changelog | ~250/month | ★ | en | [RSS](https://aws.amazon.com/about-aws/whats-new/recent/feed/) | ✅ 2026-09-02 |
| [Cloudflare Blog](https://blog.cloudflare.com/) | blog | ~25/month | ★★★ | en | [RSS](https://blog.cloudflare.com/rss/) | ✅ 2026-09-02 |
| [Cloudflare Changelog](https://developers.cloudflare.com/changelog/) | changelog | ~85/month | ★ | en | [RSS](https://developers.cloudflare.com/changelog/rss.xml) | ✅ 2026-09-02 |
| [Docker](https://www.docker.com/blog/) | blog | ~15/month | ★★★ | en | [RSS](https://www.docker.com/blog/feed/) | ✅ 2026-09-02 |
| [DuckDB](https://duckdb.org/news/) | blog | ~7/month | ★★★ | en | [RSS](https://duckdb.org/feed.xml) | ✅ 2026-09-02 |
| [Fly.io](https://fly.io/blog/) | blog | <1/month | ★★★ | en | [RSS](https://fly.io/blog/feed.xml) | ✅ 2026-09-02 |
| [GitHub Changelog](https://github.blog/changelog/) | changelog | ~75/month | ★ | en | [RSS](https://github.blog/changelog/feed/) | ✅ 2026-09-02 |
| [Google Cloud Blog](https://cloud.google.com/blog) | blog | ~85/month | ★★★ | en | [RSS](https://cloudblog.withgoogle.com/rss/) | ✅ 2026-09-02 |
| [Grafana](https://grafana.com/blog/) | blog | unknown | ★★★ | en | [RSS](https://grafana.com/blog/index.xml) | ✅ 2026-09-02 |
| [HashiCorp](https://www.hashicorp.com/blog) | blog | ~10/month | ★★★ | en | [RSS](https://www.hashicorp.com/blog/feed.xml) | ✅ 2026-09-02 |
| [Kubernetes](https://kubernetes.io/blog/) | blog | ~7/month | ★★★ | en | [RSS](https://kubernetes.io/feed.xml) | ✅ 2026-09-02 |
| [PlanetScale](https://planetscale.com/blog) | blog | ~7/month | ★★★ | en | [RSS](https://planetscale.com/blog/rss.xml) | ✅ 2026-09-02 |
| [Sentry](https://blog.sentry.io/) | blog | ~7/month | ★★★ | en | [RSS](https://blog.sentry.io/feed.xml) | ✅ 2026-09-02 |
| [Supabase](https://supabase.com/blog) | blog | ~5/month | ★★★ | en | [RSS](https://supabase.com/rss.xml) | ✅ 2026-09-02 |
| [Vercel Blog](https://vercel.com/blog) | blog | ~110/month | ★★ | en | [RSS](https://vercel.com/blog/feed) | ✅ 2026-09-02 |
| [Vercel Changelog](https://vercel.com/changelog) | changelog | ~110/month | ★ | en | [RSS](https://vercel.com/atom) | ✅ 2026-09-02 |

### Languages & runtimes / 言語・ランタイム

| Feed | Kind | Volume | Radio | Lang | Feed URL | Checked |
|---|---|---|---|---|---|---|
| [Bun](https://bun.sh/blog) | blog | ~1/month | ★★★ | en | [RSS](https://bun.sh/rss.xml) | ✅ 2026-09-02 |
| [Deno](https://deno.com/blog) | blog | <1/month | ★★★ | en | [RSS](https://deno.com/feed) | ✅ 2026-09-02 |
| [Go Blog](https://go.dev/blog/) | blog | ~4/month | ★★★ | en | [RSS](https://go.dev/blog/feed.atom) | ✅ 2026-09-02 |
| [Node.js](https://nodejs.org/en/blog) | releases | ~8/month | ★★ | en | [RSS](https://nodejs.org/en/feed/blog.xml) | ✅ 2026-09-02 |
| [PHP](https://www.php.net/) | releases | ~7/month | ★★ | en | [RSS](https://www.php.net/feed.atom) | ✅ 2026-09-02 |
| [Python Insider](https://blog.python.org/) | releases | ~5/month | ★★ | en | [RSS](https://blog.python.org/feeds/posts/default) | ✅ 2026-09-02 |
| [Ruby](https://www.ruby-lang.org/en/news/) | releases | ~2/month | ★★★ | en | [RSS](https://www.ruby-lang.org/en/feeds/news.rss) | ✅ 2026-09-02 |
| [Rust Blog](https://blog.rust-lang.org/) | blog | ~5/month | ★★★ | en | [RSS](https://blog.rust-lang.org/feed.xml) | ✅ 2026-09-02 |
| [Swift](https://www.swift.org/blog/) | blog | ~2/month | ★★★ | en | [RSS](https://www.swift.org/atom.xml) | ✅ 2026-09-02 |
| [TypeScript](https://devblogs.microsoft.com/typescript/) | blog | <1/month | ★★★ | en | [RSS](https://devblogs.microsoft.com/typescript/feed/) | ✅ 2026-09-02 |

### Frontend / フロントエンド

| Feed | Kind | Volume | Radio | Lang | Feed URL | Checked |
|---|---|---|---|---|---|---|
| [Astro](https://astro.build/blog/) | blog | ~2/month | ★★★ | en | [RSS](https://astro.build/rss.xml) | ✅ 2026-09-02 |
| [Chrome for Developers](https://developer.chrome.com/blog) | blog | ~1/month | ★★★ | en | [RSS](https://developer.chrome.com/static/blog/feed.xml) | ✅ 2026-09-02 |
| [Mozilla Hacks](https://hacks.mozilla.org/) | blog | <1/month | ★★★ | en | [RSS](https://hacks.mozilla.org/feed/) | ✅ 2026-09-02 |
| [Next.js](https://nextjs.org/blog) | blog | ~5/month | ★★★ | en | [RSS](https://nextjs.org/feed.xml) | ✅ 2026-09-02 |
| [React](https://react.dev/blog) | blog | <1/month | ★★★ | en | [RSS](https://react.dev/rss.xml) | 💤 no new posts for 190 days |
| [Svelte](https://svelte.dev/blog) | blog | ~2/month | ★★★ | en | [RSS](https://svelte.dev/blog/rss.xml) | ✅ 2026-09-02 |
| [Tailwind CSS](https://tailwindcss.com/blog) | blog | <1/month | ★★★ | en | [RSS](https://tailwindcss.com/feeds/feed.xml) | ✅ 2026-09-02 |
| [Vite](https://vite.dev/blog) | blog | <1/month | ★★★ | en | [RSS](https://vite.dev/blog.rss) | ✅ 2026-09-02 |
| [Vue.js](https://blog.vuejs.org/) | blog | <1/month | ★★★ | en | [RSS](https://blog.vuejs.org/feed.rss) | 💤 no new posts for 731 days |
| [WebKit](https://webkit.org/blog/) | blog | ~4/month | ★★★ | en | [RSS](https://webkit.org/feed/) | ✅ 2026-09-02 |

### Security / セキュリティ

| Feed | Kind | Volume | Radio | Lang | Feed URL | Checked |
|---|---|---|---|---|---|---|
| [Cloudflare Security](https://blog.cloudflare.com/tag/security/) | blog | ~2/month | ★★★ | en | [RSS](https://blog.cloudflare.com/tag/security/rss/) | ✅ 2026-09-02 |
| [GitHub Security](https://github.blog/security/) | blog | ~5/month | ★★★ | en | [RSS](https://github.blog/security/feed/) | ✅ 2026-09-02 |
| [Google Project Zero](https://googleprojectzero.blogspot.com/) | blog | <1/month | ★★★ | en | [RSS](https://googleprojectzero.blogspot.com/feeds/posts/default) | ✅ 2026-09-02 |
| [Google Security Blog](https://security.googleblog.com/) | blog | <1/month | ★★★ | en | [RSS](https://security.googleblog.com/feeds/posts/default) | ✅ 2026-09-02 |
| [Rust Security Advisories](https://rustsec.org/advisories/) | changelog | ~300/month | ★ | en | [RSS](https://rustsec.org/feed.xml) | ✅ 2026-09-02 |

### Company engineering blogs / 企業テックブログ

| Feed | Kind | Volume | Radio | Lang | Feed URL | Checked |
|---|---|---|---|---|---|---|
| [Cybozu Engineering](https://blog.cybozu.io/) | blog | ~25/month | ★★★ | ja | [RSS](https://blog.cybozu.io/feed) | ✅ 2026-09-02 |
| [DeNA Engineering](https://engineering.dena.com/) | blog | ~7/month | ★★★ | ja | [RSS](https://engineering.dena.com/index.xml) | ✅ 2026-09-02 |
| [Discord Engineering](https://discord.com/category/engineering) | blog | ~6/month | ★★★ | en | [RSS](https://discord.com/blog/rss.xml) | ✅ 2026-09-02 |
| [Dropbox Tech](https://dropbox.tech/) | blog | ~2/month | ★★★ | en | [RSS](https://dropbox.tech/feed) | ✅ 2026-09-02 |
| [Figma Engineering](https://www.figma.com/blog/engineering/) | blog | ~15/month | ★★★ | en | [RSS](https://www.figma.com/blog/feed/atom.xml) | ✅ 2026-09-02 |
| [freee Developers Hub](https://developers.freee.co.jp/) | blog | ~7/month | ★★★ | ja | [RSS](https://developers.freee.co.jp/feed) | ✅ 2026-09-02 |
| [LINE / LY Engineering](https://techblog.lycorp.co.jp/ja) | blog | ~15/month | ★★★ | ja | [RSS](https://techblog.lycorp.co.jp/ja/feed/index.xml) | ✅ 2026-09-02 |
| [Netflix Tech Blog](https://netflixtechblog.com/) | blog | ~4/month | ★★★ | en | [RSS](https://netflixtechblog.com/feed) | ✅ 2026-09-02 |
| [Shopify Engineering](https://shopify.engineering/) | blog | ~3/month | ★★★ | en | [RSS](https://shopify.engineering/blog.atom) | ✅ 2026-09-02 |
| [Slack Engineering](https://slack.engineering/) | blog | <1/month | ★★★ | en | [RSS](https://slack.engineering/feed/) | ✅ 2026-09-02 |
| [SmartHR Tech Blog](https://tech.smarthr.jp/) | blog | ~20/month | ★★★ | ja | [RSS](https://tech.smarthr.jp/feed) | ✅ 2026-09-02 |
| [Stripe Engineering](https://stripe.com/blog/engineering) | blog | ~3/month | ★★★ | en | [RSS](https://stripe.com/blog/feed.rss) | ✅ 2026-09-02 |
| [ZOZO TECH BLOG](https://techblog.zozo.com/) | blog | ~15/month | ★★★ | ja | [RSS](https://techblog.zozo.com/feed) | ✅ 2026-09-02 |
| [クックパッド開発者ブログ](https://techlife.cookpad.com/) | blog | ~30/month | ★★★ | ja | [RSS](https://techlife.cookpad.com/feed) | ✅ 2026-09-02 |
| [メルカリ engineering](https://engineering.mercari.com/blog/) | blog | ~8/month | ★★★ | ja | [RSS](https://engineering.mercari.com/blog/feed.xml) | ✅ 2026-09-02 |

### Aggregators / アグリゲータ

| Feed | Kind | Volume | Radio | Lang | Feed URL | Checked |
|---|---|---|---|---|---|---|
| [Hacker News Front Page](https://news.ycombinator.com/) | blog | ~600/month | ★★ | en | [RSS](https://hnrss.org/frontpage) | ✅ 2026-09-02 |
| [Publickey](https://www.publickey1.jp/) | blog | ~35/month | ★★★ | ja | [RSS](https://www.publickey1.jp/atom.xml) | ✅ 2026-09-02 |
| [Zenn Trending](https://zenn.dev/) | blog | ~120/month | ★★ | ja | [RSS](https://zenn.dev/feed) | ✅ 2026-09-02 |
| [はてなブックマーク テクノロジー](https://b.hatena.ne.jp/hotentry/it) | blog | ~900/month | ★★ | ja | [RSS](https://b.hatena.ne.jp/hotentry/it.rss) | ✅ 2026-09-02 |

¹ Article pages block automated fetchers — subscribe using the feed summary, not the URL.
<!-- END CATALOG -->

## Using the data

```bash
# every feed, as one JSON document
curl -s https://raw.githubusercontent.com/inoueUJ/tech-feed-catalog/main/site/feeds.json

# just the high-value AI feeds, as URLs
curl -s https://raw.githubusercontent.com/inoueUJ/tech-feed-catalog/main/site/feeds.json \
  | jq -r '.feeds[] | select(.category=="ai-models" and .radio_friendly=="high") | .url'
```

For AI agents: point your MCP client at `https://tech-feed-catalog-mcp.<account>.workers.dev/mcp` to query the catalog directly. See [worker/README.md](worker/README.md).

## Contributing

Adding a feed is a five-line pull request — [CONTRIBUTING.md](CONTRIBUTING.md) has the details. Short version: add your entry to the right `feeds/*.yaml` with `name`, `url`, `site`, `category`, `kind`, `language`, then open the PR. CI fetches the URL and rejects it if it doesn't return a real feed, and the measured columns are filled in automatically — don't write them yourself.

Removing a feed that has gone permanently dead is just as welcome as adding one.

## License

[MIT](LICENSE). The catalog data is facts about public feeds; use it however you like.
