# tech-feed-catalog

**黙って腐らない、開発者向け RSS フィードの厳選リスト。**

[English README](README.en.md)

ここにあるフィードは毎週 CI が実際に取得します。死んだフィードは 2 年間そ知らぬ顔で並び続ける代わりに、下の表に印が付きます。各エントリには、実際に購読してみないと分からない計測値(月あたりの投稿数、音声ラジオへの向き不向き、ボット対策の有無)も付いています。

**→ [notebooklm-radio の設定を作る](https://inoueuj.github.io/tech-feed-catalog/)** — 追っている技術を押す(カタログに無いものは Zenn のトピック・Qiita のタグ・任意のフィード URL をその場で確認して追加)→ 番組(ノートブック)に分ける → 番組ごとに会話の形式を選ぶ → タイムゾーンと実行時刻を決める → 完成した `config.yaml` と cron の 2 行をダウンロード。設定はページの URL に入るので、リンクとして共有できます。あとで困ること(プランの 1 日の音声生成上限とノートブック数 × 実行回数、消化しきれない流量のフィード、同じ記事を配信する 2 つのフィード、ボット対策のホスト)も先に警告します。

**→ [スクリーンショット付きの導入ガイド](https://inoueuj.github.io/tech-feed-catalog/guide/)**(日本語 / English) — ビルダーから最初の 1 本まで 10 ステップ。毎朝の見方と 3.5 週ごとの更新まで。

機械可読データ: [`feeds/*.yaml`](feeds/) · [`site/feeds.json`](site/feeds.json)(1 つの JSON、CORS 対応) · [`schema.json`](schema.json) · `GET https://tech-feed-catalog-mcp.yuji-inoue11.workers.dev/check?url=<feed>` は任意の公開フィード URL を一度取得して、種類・件数・日付・月あたりの推定量を返します(ビルダーがカタログ外フィードの「確認」に使っています)。

## 列の意味

たいていのフィード一覧は「URL がある」ことしか教えてくれません。ここでは、購読したら何が起きるかが分かります:

- **月あたり** — 直近 90 日で測った、月あたりの投稿数。毎日 30 本のフィードと四半期に 1 本のブログでは扱いが変わります。
- **ラジオ向き** — 生成される音声ラジオにどれだけ向くか(★★★ = 長文の読み物、★ = 1 行の変更履歴)。フィードの種類・流量・本文の量から算出しています。
- **確認日** — CI がフィードから記事を取り出せたことを最後に確認した日。`💤` は 6 か月新着なし、`🤖 ボット拒否` はブラウザでは開けるが自動クライアントを弾くフィードです。
- **¹** — *記事ページ*がボット対策の裏にあり、自動取得は記事の代わりにチャレンジページを受け取ります。フィード自身の要約文で購読してください。

[notebooklm-radio](https://github.com/inoueUJ/notebooklm-radio)(フィードを毎日のポッドキャストにする)のために作りましたが、データは素の YAML/JSON です。リーダー、ダイジェスト bot、ニュースレター、何にでも使ってください。

<!-- BEGIN CATALOG -->

**76 フィード**・8 カテゴリ・73 件が稼働確認済み

### AI モデル・研究 / AI models & research

| フィード | 種類 | 月あたり | ラジオ向き | 言語 | フィード URL | 確認日 |
|---|---|---|---|---|---|---|
| [Anthropic Engineering](https://www.anthropic.com/engineering) | ブログ | <1/month | ★★★ | en | [sitemap](https://www.anthropic.com/sitemap.xml) | ✅ 2026-09-27 |
| [Anthropic News](https://www.anthropic.com/news) | ブログ | ~60/month | ★★ | en | [sitemap](https://www.anthropic.com/sitemap.xml) | ✅ 2026-09-27 |
| [Google AI Blog](https://blog.google/technology/ai/) | ブログ | ~15/month | ★★★ | en | [RSS](https://blog.google/technology/ai/rss/) | ✅ 2026-09-27 |
| [Google DeepMind](https://deepmind.google/discover/blog/) | ブログ | ~9/month | ★★★ | en | [RSS](https://deepmind.google/blog/rss.xml) | ✅ 2026-09-27 |
| [Google Gemini](https://blog.google/products/gemini/) | ブログ | ~15/month | ★★★ | en | [RSS](https://blog.google/products/gemini/rss/) | ✅ 2026-09-27 |
| [Hugging Face](https://huggingface.co/blog) | ブログ | ~20/month | ★★★ | en | [RSS](https://huggingface.co/blog/feed.xml) | ✅ 2026-09-27 |
| [OpenAI News](https://openai.com/news) | ブログ | ~55/month | ★★ | en | [RSS](https://openai.com/news/rss.xml) ¹ | ✅ 2026-09-27 |
| [Simon Willison](https://simonwillison.net/) | ブログ | ~100/month | ★★ | en | [RSS](https://simonwillison.net/atom/everything/) | ✅ 2026-09-27 |

### AI コーディングツール / AI coding tools

| フィード | 種類 | 月あたり | ラジオ向き | 言語 | フィード URL | 確認日 |
|---|---|---|---|---|---|---|
| [Antigravity](https://antigravity.google/blog) | ブログ | unknown | ★★★ | en | [sitemap](https://antigravity.google/sitemap.xml) | ✅ 2026-09-27 |
| [Claude Blog](https://claude.com/blog) | ブログ | ~50/month | ★★ | en | [sitemap](https://claude.com/sitemap.xml) | ✅ 2026-09-27 |
| [Claude Code](https://code.claude.com/docs/en/whats-new) | リリース | ~4/month | ★★ | en | [RSS](https://code.claude.com/docs/en/whats-new/rss.xml) | ✅ 2026-09-27 |
| [Codex Changelog](https://developers.openai.com/codex/changelog) | 変更履歴 | ~10/month | ★ | en | [RSS](https://developers.openai.com/codex/changelog/rss.xml) | ✅ 2026-09-27 |
| [Cursor Changelog](https://cursor.com/changelog) | 変更履歴 | ~5/month | ★★ | en | [RSS](https://cursor.com/changelog/rss.xml) | ✅ 2026-09-27 |
| [GitHub Copilot](https://github.blog/ai-and-ml/github-copilot/) | ブログ | ~10/month | ★★★ | en | [RSS](https://github.blog/ai-and-ml/github-copilot/feed/) | ✅ 2026-09-27 |
| [Zed](https://zed.dev/blog) | ブログ | ~2/month | ★★★ | en | [RSS](https://zed.dev/blog.rss) | ✅ 2026-09-27 |

### クラウド・インフラ / Cloud & infrastructure

| フィード | 種類 | 月あたり | ラジオ向き | 言語 | フィード URL | 確認日 |
|---|---|---|---|---|---|---|
| [AWS Architecture Blog](https://aws.amazon.com/blogs/architecture/) | ブログ | ~15/month | ★★★ | en | [RSS](https://aws.amazon.com/blogs/architecture/feed/) | ✅ 2026-09-27 |
| [AWS News](https://aws.amazon.com/new/) | 変更履歴 | ~190/month | ★ | en | [RSS](https://aws.amazon.com/about-aws/whats-new/recent/feed/) | ✅ 2026-09-27 |
| [Cloudflare Blog](https://blog.cloudflare.com/) | ブログ | ~15/month | ★★★ | en | [RSS](https://blog.cloudflare.com/rss/) | ✅ 2026-09-27 |
| [Cloudflare Changelog](https://developers.cloudflare.com/changelog/) | 変更履歴 | ~95/month | ★ | en | [RSS](https://developers.cloudflare.com/changelog/rss.xml) | ✅ 2026-09-27 |
| [Docker](https://www.docker.com/blog/) | ブログ | ~15/month | ★★★ | en | [RSS](https://www.docker.com/blog/feed/) | 🤖 ボット拒否 |
| [DuckDB](https://duckdb.org/news/) | ブログ | ~8/month | ★★★ | en | [RSS](https://duckdb.org/feed.xml) | ✅ 2026-09-27 |
| [Fly.io](https://fly.io/blog/) | ブログ | <1/month | ★★★ | en | [RSS](https://fly.io/blog/feed.xml) | ✅ 2026-09-27 |
| [GitHub Changelog](https://github.blog/changelog/) | 変更履歴 | ~150/month | ★ | en | [RSS](https://github.blog/changelog/feed/) | ✅ 2026-09-27 |
| [Google Cloud Blog](https://cloud.google.com/blog) | ブログ | ~200/month | ★★★ | en | [RSS](https://cloudblog.withgoogle.com/rss/) | ✅ 2026-09-27 |
| [Grafana](https://grafana.com/blog/) | ブログ | unknown | ★★★ | en | [RSS](https://grafana.com/blog/index.xml) | ✅ 2026-09-27 |
| [HashiCorp](https://www.hashicorp.com/blog) | ブログ | ~9/month | ★★★ | en | [RSS](https://www.hashicorp.com/blog/feed.xml) | ✅ 2026-09-27 |
| [Kubernetes](https://kubernetes.io/blog/) | ブログ | ~10/month | ★★★ | en | [RSS](https://kubernetes.io/feed.xml) | ✅ 2026-09-27 |
| [PlanetScale](https://planetscale.com/blog) | ブログ | ~9/month | ★★★ | en | [RSS](https://planetscale.com/blog/rss.xml) | ✅ 2026-09-27 |
| [Sentry](https://blog.sentry.io/) | ブログ | ~7/month | ★★★ | en | [RSS](https://blog.sentry.io/feed.xml) | ✅ 2026-09-27 |
| [Supabase](https://supabase.com/blog) | ブログ | ~4/month | ★★★ | en | [RSS](https://supabase.com/rss.xml) | ✅ 2026-09-27 |
| [Vercel Blog](https://vercel.com/blog) | ブログ | ~110/month | ★★ | en | [RSS](https://vercel.com/blog/feed) | ✅ 2026-09-27 |
| [Vercel Changelog](https://vercel.com/changelog) | 変更履歴 | ~110/month | ★ | en | [RSS](https://vercel.com/atom) | ✅ 2026-09-27 |

### 言語・ランタイム / Languages & runtimes

| フィード | 種類 | 月あたり | ラジオ向き | 言語 | フィード URL | 確認日 |
|---|---|---|---|---|---|---|
| [Bun](https://bun.sh/blog) | ブログ | ~2/month | ★★★ | en | [RSS](https://bun.sh/rss.xml) | ✅ 2026-09-27 |
| [Deno](https://deno.com/blog) | ブログ | <1/month | ★★★ | en | [RSS](https://deno.com/feed) | ✅ 2026-09-27 |
| [Go Blog](https://go.dev/blog/) | ブログ | ~4/month | ★★★ | en | [RSS](https://go.dev/blog/feed.atom) | ✅ 2026-09-27 |
| [Node.js](https://nodejs.org/en/blog) | リリース | ~7/month | ★★ | en | [RSS](https://nodejs.org/en/feed/blog.xml) | ✅ 2026-09-27 |
| [PHP](https://www.php.net/) | リリース | ~10/month | ★★ | en | [RSS](https://www.php.net/feed.atom) | ✅ 2026-09-27 |
| [Python Insider](https://blog.python.org/) | リリース | ~5/month | ★★ | en | [RSS](https://blog.python.org/feeds/posts/default) | ✅ 2026-09-27 |
| [Ruby](https://www.ruby-lang.org/en/news/) | リリース | ~2/month | ★★★ | en | [RSS](https://www.ruby-lang.org/en/feeds/news.rss) | ✅ 2026-09-27 |
| [Rust Blog](https://blog.rust-lang.org/) | ブログ | ~8/month | ★★★ | en | [RSS](https://blog.rust-lang.org/feed.xml) | ✅ 2026-09-27 |
| [Swift](https://www.swift.org/blog/) | ブログ | ~2/month | ★★★ | en | [RSS](https://www.swift.org/atom.xml) | ✅ 2026-09-27 |
| [TypeScript](https://devblogs.microsoft.com/typescript/) | ブログ | <1/month | ★★★ | en | [RSS](https://devblogs.microsoft.com/typescript/feed/) | ✅ 2026-09-27 |

### フロントエンド / Frontend

| フィード | 種類 | 月あたり | ラジオ向き | 言語 | フィード URL | 確認日 |
|---|---|---|---|---|---|---|
| [Astro](https://astro.build/blog/) | ブログ | ~3/month | ★★★ | en | [RSS](https://astro.build/rss.xml) | ✅ 2026-09-27 |
| [Chrome for Developers](https://developer.chrome.com/blog) | ブログ | <1/month | ★★★ | en | [RSS](https://developer.chrome.com/static/blog/feed.xml) | ✅ 2026-09-27 |
| [Mozilla Hacks](https://hacks.mozilla.org/) | ブログ | <1/month | ★★★ | en | [RSS](https://hacks.mozilla.org/feed/) | ✅ 2026-09-27 |
| [Next.js](https://nextjs.org/blog) | ブログ | ~5/month | ★★★ | en | [RSS](https://nextjs.org/feed.xml) | ✅ 2026-09-27 |
| [React](https://react.dev/blog) | ブログ | ~2/month | ★★★ | en | [RSS](https://react.dev/rss.xml) | ✅ 2026-09-27 |
| [Svelte](https://svelte.dev/blog) | ブログ | ~1/month | ★★★ | en | [RSS](https://svelte.dev/blog/rss.xml) | ✅ 2026-09-27 |
| [Tailwind CSS](https://tailwindcss.com/blog) | ブログ | ~2/month | ★★★ | en | [RSS](https://tailwindcss.com/feeds/feed.xml) | ✅ 2026-09-27 |
| [Vite](https://vite.dev/blog) | ブログ | <1/month | ★★★ | en | [RSS](https://vite.dev/blog.rss) | ✅ 2026-09-27 |
| [Vue.js](https://blog.vuejs.org/) | ブログ | <1/month | ★★★ | en | [RSS](https://blog.vuejs.org/feed.rss) | 💤 no new posts for 756 days |
| [WebKit](https://webkit.org/blog/) | ブログ | ~5/month | ★★★ | en | [RSS](https://webkit.org/feed/) | ✅ 2026-09-27 |

### セキュリティ / Security

| フィード | 種類 | 月あたり | ラジオ向き | 言語 | フィード URL | 確認日 |
|---|---|---|---|---|---|---|
| [Cloudflare Security](https://blog.cloudflare.com/tag/security/) | ブログ | ~3/month | ★★★ | en | [RSS](https://blog.cloudflare.com/tag/security/rss/) | ✅ 2026-09-27 |
| [GitHub Security](https://github.blog/security/) | ブログ | ~3/month | ★★★ | en | [RSS](https://github.blog/security/feed/) | ✅ 2026-09-27 |
| [Google Project Zero](https://googleprojectzero.blogspot.com/) | ブログ | ~3/month | ★★★ | en | [RSS](https://googleprojectzero.blogspot.com/feeds/posts/default) | ✅ 2026-09-27 |
| [Google Security Blog](https://security.googleblog.com/) | ブログ | <1/month | ★★★ | en | [RSS](https://security.googleblog.com/feeds/posts/default) | ✅ 2026-09-27 |
| [Rust Security Advisories](https://rustsec.org/advisories/) | 変更履歴 | ~90/month | ★ | en | [RSS](https://rustsec.org/feed.xml) | ✅ 2026-09-27 |

### 企業テックブログ / Company engineering blogs

| フィード | 種類 | 月あたり | ラジオ向き | 言語 | フィード URL | 確認日 |
|---|---|---|---|---|---|---|
| [Cybozu Engineering](https://blog.cybozu.io/) | ブログ | ~15/month | ★★★ | ja | [RSS](https://blog.cybozu.io/feed) | ✅ 2026-09-27 |
| [DeNA Engineering](https://engineering.dena.com/) | ブログ | ~7/month | ★★★ | ja | [RSS](https://engineering.dena.com/index.xml) | ✅ 2026-09-27 |
| [Discord Engineering](https://discord.com/category/engineering) | ブログ | ~5/month | ★★★ | en | [RSS](https://discord.com/blog/rss.xml) | ✅ 2026-09-27 |
| [Dropbox Tech](https://dropbox.tech/) | ブログ | ~2/month | ★★★ | en | [RSS](https://dropbox.tech/feed) | ✅ 2026-09-27 |
| [Figma Engineering](https://www.figma.com/blog/engineering/) | ブログ | ~10/month | ★★★ | en | [RSS](https://www.figma.com/blog/feed/atom.xml) | ✅ 2026-09-27 |
| [freee Developers Hub](https://developers.freee.co.jp/) | ブログ | ~7/month | ★★★ | ja | [RSS](https://developers.freee.co.jp/feed) | ✅ 2026-09-27 |
| [LINE / LY Engineering](https://techblog.lycorp.co.jp/ja) | ブログ | ~8/month | ★★★ | ja | [RSS](https://techblog.lycorp.co.jp/ja/feed/index.xml) | ✅ 2026-09-27 |
| [Netflix Tech Blog](https://netflixtechblog.com/) | ブログ | ~3/month | ★★★ | en | [RSS](https://netflixtechblog.com/feed) | ✅ 2026-09-27 |
| [Shopify Engineering](https://shopify.engineering/) | ブログ | ~4/month | ★★★ | en | [RSS](https://shopify.engineering/blog.atom) | ✅ 2026-09-27 |
| [Slack Engineering](https://slack.engineering/) | ブログ | <1/month | ★★★ | en | [RSS](https://slack.engineering/feed/) | ✅ 2026-09-27 |
| [SmartHR Tech Blog](https://tech.smarthr.jp/) | ブログ | ~15/month | ★★★ | ja | [RSS](https://tech.smarthr.jp/feed) | ✅ 2026-09-27 |
| [Stripe Engineering](https://stripe.com/blog/engineering) | ブログ | ~4/month | ★★★ | en | [RSS](https://stripe.com/blog/feed.rss) | ✅ 2026-09-27 |
| [ZOZO TECH BLOG](https://techblog.zozo.com/) | ブログ | ~20/month | ★★★ | ja | [RSS](https://techblog.zozo.com/feed) | ✅ 2026-09-27 |
| [クックパッド開発者ブログ](https://techlife.cookpad.com/) | ブログ | ~1/month | ★★★ | ja | [RSS](https://techlife.cookpad.com/feed) | ✅ 2026-09-27 |
| [メルカリ engineering](https://engineering.mercari.com/blog/) | ブログ | ~8/month | ★★★ | ja | [RSS](https://engineering.mercari.com/blog/feed.xml) | 🤖 ボット拒否 |

### アグリゲータ / Aggregators

| フィード | 種類 | 月あたり | ラジオ向き | 言語 | フィード URL | 確認日 |
|---|---|---|---|---|---|---|
| [Hacker News Front Page](https://news.ycombinator.com/) | ブログ | ~600/month | ★★ | en | [RSS](https://hnrss.org/frontpage) | ✅ 2026-09-27 |
| [Publickey](https://www.publickey1.jp/) | ブログ | ~25/month | ★★★ | ja | [RSS](https://www.publickey1.jp/atom.xml) | ✅ 2026-09-27 |
| [Zenn Trending](https://zenn.dev/) | ブログ | ~150/month | ★★ | ja | [RSS](https://zenn.dev/feed) | ✅ 2026-09-27 |
| [はてなブックマーク テクノロジー](https://b.hatena.ne.jp/hotentry/it) | ブログ | ~45/month | ★★ | ja | [RSS](https://b.hatena.ne.jp/hotentry/it.rss) | ✅ 2026-09-27 |

¹ 記事ページがボット対策で自動取得を弾くため、URL ではなくフィードの要約文で購読する。
<!-- END CATALOG -->

## データの使い方

```bash
# 全フィードを 1 つの JSON で
curl -s https://raw.githubusercontent.com/inoueUJ/tech-feed-catalog/main/site/feeds.json

# 聴く価値のある AI フィードの名前と URL
curl -s https://raw.githubusercontent.com/inoueUJ/tech-feed-catalog/main/site/feeds.json \
  | jq -r '.feeds[] | select(.category=="ai-models" and .radio_friendly=="high")
           | "\(.name)\t\(.url)"'
```

sitemap 型のソースは 1 つの sitemap URL を共有し、`prefix` だけが違うことがあります(Anthropic の news と engineering など)。`url` だけでは一意にならないので、`url` + `prefix` で扱ってください。

AI エージェント向け: MCP クライアントを `https://tech-feed-catalog-mcp.yuji-inoue11.workers.dev/mcp` に向けると、カタログを直接検索できます。[worker/README.md](worker/README.md) を参照。

## 貢献

フィードの追加は 5 行のプルリクエストです。詳しくは [CONTRIBUTING.md](CONTRIBUTING.md)。短く言うと、該当する `feeds/*.yaml` に `name`・`url`・`site`・`category`・`kind`・`language`・`tags` を書いて PR を出すだけです。CI が URL を取得して本物のフィードでなければ弾き、計測列は自動で埋まります(手で書かないでください)。

完全に死んだフィードを外す PR も、追加と同じくらい歓迎です。

## ライセンス

[MIT](LICENSE)。カタログのデータは公開フィードについての事実です。好きに使ってください。
