# tech-feed-catalog MCP サーバー

フィードのカタログを、MCP(Streamable HTTP)で AI エージェントから使えるようにするサーバーです。Cloudflare Workers で動いています。

## ツール

| ツール | できること |
|---|---|
| `search_feeds` | カテゴリ、種類、言語、ラジオ向きかどうか、流量で絞り込みます。測定したメタデータも含めて、エントリを丸ごと返します。 |
| `list_categories` | カテゴリの一覧と、それぞれのフィード数を返します。 |
| `build_config` | フィード URL のリストから、notebooklm-radio の `feeds:` にそのまま貼れるブロックを作ります。流量の多すぎるフィードには `mode: latest` が付き、同じ記事を配信する 2 つのエントリ(`same_as`)を選んでいると `note` で知らせます。 |

カタログはビルド時にバンドルに埋め込むので、リクエストは GitHub が落ちていても影響を受けません。カタログの変更を反映するには再デプロイが必要です。

## 接続

Claude Code の場合:

```bash
claude mcp add --transport http tech-feed-catalog https://tech-feed-catalog-mcp.yuji-inoue11.workers.dev/mcp
```

ほかの MCP クライアントでも、同じ `/mcp` の URL を Streamable HTTP で指定すれば使えます。カタログは公開の読み取り専用データなので、認証はありません。

MCP を使わない場合は、同じホストの `GET /feeds.json` でカタログ全体を JSON で取れます。CORS も許可しています。

`GET /check?url=<フィードの URL>` は、公開フィードの URL を 1 回だけ取得して、購読したら何が届くかを返します: `{ok, status, kind (rss|atom|html), title, entries, has_timestamps, latest, volume (月あたりの推定本数), blocked}`。`blocked: true` は、自動取得のクライアントに対してホストが 403 や 429、Cloudflare のチャレンジを返したという意味です。設定ビルダーは、カタログにないフィードを確認するときにこれを使います。対象は公開の http(s) ホストだけで、タイムアウトは 12 秒、認証情報は送らず、結果は 5 分間キャッシュします。

## 開発とデプロイ

```bash
npm install
npm run dev        # :8787 でローカルサーバーを起動(先にデータをバンドルする)
npm run typecheck
npm run deploy     # wrangler deploy
```

`npm run deploy` には `wrangler login` が必要です。デプロイ時に `../site/feeds.json` をバンドルにコピーするので、`feeds/*.yaml` を変えたときは先にリポジトリのルートで `python scripts/build.py` を実行してください。

## クライアントなしで試す

```bash
curl -s https://tech-feed-catalog-mcp.yuji-inoue11.workers.dev/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call",
       "params":{"name":"search_feeds","arguments":{"category":"ai-models","radio_friendly":"high","limit":3}}}'
```
