# tech-feed-catalog

開発者向けの RSS フィードを集めたカタログです。載っているフィードは毎週 CI が実際に取得して、生きているかどうかを確かめています。

[English README](README.en.md)

止まってしまったフィードは、何年もそのまま放置されるのではなく、下の表に印が付きます。各フィードには、実際に購読してみないと分からないこと(月に何本くらい流れてくるか、音声ラジオにしたときに聴けるものになるか、ボット対策で自動取得を弾かれないか)も計測して載せています。

このカタログは [notebooklm-radio](https://github.com/inoueUJ/notebooklm-radio) のために作ったものですが、データは素の YAML と JSON なので、RSS リーダーやダイジェスト bot など他の用途にも使えます。

## 設定ビルダーと導入ガイド

notebooklm-radio の設定ファイルは、このカタログを元にしたビルダーで作れます。

- [設定ビルダー](https://inoueuj.github.io/tech-feed-catalog/)。追っている技術を選んで番組に分け、実行時刻を決めると、`config.yaml` と cron の 2 行がダウンロードできます。カタログにないフィードも、Zenn のトピックや Qiita のタグ、任意の URL をその場で確認して追加できます。設定は URL に入るので、リンクとして共有できます。1 日の音声生成上限に対して番組が多すぎる、流量の多すぎるフィードがある、同じ記事を配信するフィードを 2 つ選んでいる、といった問題は選んだ時点で警告します。
- [導入ガイド](https://inoueuj.github.io/tech-feed-catalog/guide/)(日本語 / English)。ビルダーで設定を作るところから最初の 1 本を聴くまでを、スクリーンショット付きの 10 ステップで説明しています。毎朝の見方と、3.5 週間ごとの認証の更新も載せています。

## データ

- [`feeds/*.yaml`](feeds/) が元データです。
- [`site/feeds.json`](site/feeds.json) は全部を 1 つにまとめた JSON です。CORS を許可しているので、ブラウザから直接読めます。
- [`schema.json`](schema.json) がデータの形式です。
- `GET https://tech-feed-catalog-mcp.yuji-inoue11.workers.dev/check?url=<feed>` に公開フィードの URL を渡すと、一度取得して種類、件数、日付、月あたりの推定本数を返します。ビルダーの「確認」ボタンはこれを使っています。

## 表の列について

たいていのフィード一覧は URL があることしか教えてくれませんが、ここでは購読したらどうなるかが分かるようにしています。

「月あたり」は、直近 90 日から計算した 1 か月あたりの投稿数です。毎日 30 本来るフィードと四半期に 1 本のブログでは扱い方が変わるので載せています。

「ラジオ向き」は、生成した音声ラジオにどのくらい向いているかの目安です。★★★ が長文の読み物、★ が 1 行だけの変更履歴といった具合で、フィードの種類と流量、本文の量から決めています。

「確認日」は、CI がそのフィードから記事を取り出せたことを最後に確かめた日です。💤 は 6 か月以上新着がないもの、🤖 ボット拒否はブラウザでは開けるのに自動クライアントを弾くものです。

¹ が付いているものは、フィード自体は取れるのに記事ページがボット対策の裏にあって、自動取得だとチャレンジページしか返ってきません。フィードに含まれる要約文で購読してください。

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
| [Codex Changelog](https://developers.openai.com/codex/changelog) | 変更履歴 | ~15/month | ★★ | en | [RSS](https://developers.openai.com/codex/changelog/rss.xml) | ✅ 2026-09-27 |
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
| [Sentry](https://blog.sentry.io/) | ブログ | ~6/month | ★★★ | en | [RSS](https://blog.sentry.io/feed.xml) | ✅ 2026-09-27 |
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
| [はてなブックマーク テクノロジー](https://b.hatena.ne.jp/hotentry/it) | ブログ | ~150/month | ★★ | ja | [RSS](https://b.hatena.ne.jp/hotentry/it.rss) | ✅ 2026-09-27 |

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

sitemap 型のソースには、同じ sitemap URL で `prefix` だけが違うものがあります(Anthropic の news と engineering など)。`url` だけをキーにすると重複するので、`url` と `prefix` の組で扱ってください。

MCP クライアントからは `https://tech-feed-catalog-mcp.yuji-inoue11.workers.dev/mcp` でカタログを検索できます。詳しくは [worker/README.md](worker/README.md) を見てください。

## フィードの追加

フィードの追加は PR で受け付けています。該当する `feeds/*.yaml` に `name`、`url`、`site`、`category`、`kind`、`language`、`tags` を書いて PR を出してください。5 行くらいで済みます。CI が URL を実際に取得して、フィードとして読めなければ弾きます。計測の列は CI が埋めるので、手で書く必要はありません。詳しくは [CONTRIBUTING.md](CONTRIBUTING.md) にあります。

更新が完全に止まったフィードを外す PR も歓迎です。

## ライセンス

[MIT](LICENSE) です。カタログのデータは公開されているフィードについての事実なので、好きに使ってください。
