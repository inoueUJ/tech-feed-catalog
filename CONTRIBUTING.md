# コントリビューションガイド

フィードの追加は 5 行ほどの PR で済みます。完全に止まってしまったフィードの削除も同じくらい歓迎します。

## フィードを追加する

`feeds/` の中の該当するファイルに、次の項目だけを書いたエントリを追加してください。

```yaml
- name: Deno
  url: https://deno.com/feed
  site: https://deno.com/blog
  category: languages
  kind: blog
  language: en
  tags: [nodejs, typescript]
```

- **name**: 表や通知に出る名前です。人が読んで分かる短い名前にしてください。「google-ai-blog-rss」ではなく「Google AI Blog」です。
- **url**: フィードそのものの URL です。先にブラウザで開いて、記事の入った XML が返ってくることを確かめてください。
- **site**: 人が読むためのページです。何を購読することになるのかを読者が確認できるようにします。
- **category**: `feeds/` にあるファイル名のどれかです。読者が探しそうな場所に入れてください。
- **kind**: 読み物の記事なら `blog`、短い項目がたくさん並ぶものなら `changelog`、バージョンの告知なら `release-notes` です。ラジオ向きかどうかの推定に使うので、正直に選んでください。変更履歴に `blog` と付けると利用者を誤解させます。
- **language**: `en` か `ja` です。
- **tags**: [`tags.yaml`](tags.yaml) にある ID を 1 つ以上付けます(`claude`、`rust`、`cloudflare`、`japan-tech` など、読者が口にする技術名やトピック)。設定ビルダーの最初のステップはこのタグから作られるので、タグのないフィードはそこに出てきません。`tags.yaml` に新しいタグを足すのは、複数のフィードが共有する場合だけにしてください。

**`volume`、`radio_friendly`、`has_timestamps`、`latest_post`、`status`、`last_checked` は書かないでください。** これらは測定値で、CI が実際にフィードを取得して書き込みます。手で書いた値は、このカタログがなくそうとしている「古くなった情報」そのものです。

### RSS のないサイト

サイトマップを指定して、URL のプレフィックスを選びます。

```yaml
- name: Anthropic News
  type: sitemap
  url: https://www.anthropic.com/sitemap.xml
  prefix: https://www.anthropic.com/news/
  site: https://www.anthropic.com/news
  category: ai-models
  kind: blog
  language: en
  tags: [claude]
```

1 つのサイトマップを、プレフィックスを変えて複数のエントリで共有してもかまいません。そういう使い方を想定しています。

### ボット対策のあるサイト

記事ページがブラウザ以外のクライアントにチャレンジ画面(Cloudflare の「Just a moment…」など)を返す場合は、`source_mode: text` を付けてください。記事ページを取りに行かず、フィード自体の要約文を使うよう利用側に伝えるための指定です。ブラウザの User-Agent を偽装してボット対策を回避するのはやめてください。

## CI がチェックすること

PR ごとに次の 3 つが実行されます。

1. **スキーマのチェック**: 必須項目があるか、category・kind・language の値が正しいか、sitemap のエントリに `prefix` があるか。
2. **生成ファイルのチェック**: `README.md` と `site/feeds.json` がデータと一致しているか。
3. **到達確認**: フィードの URL を実際に取得します。読み取れる記事が返ってこなければ PR は失敗になります。

push する前に、手元で次を実行してください。

```bash
pip install -r requirements.txt
python scripts/validate.py     # フィードを取得して測定値を書き込む
python scripts/build.py        # README.md と site/feeds.json を作り直す
python scripts/contrast_check.py --check   # サイトの配色(ビルダーとガイド)が両テーマで WCAG AA を満たすか確認する
```

`validate.py` と `build.py` で変わったファイルはそのままコミットしてください。`contrast_check.py --check` は確認だけで、ファイルは変更しません。

## 載せるもの

現役の開発者が追いかけたくなりそうなフィードです。公式のプロジェクトブログ、ベンダーの変更履歴、企業のエンジニアリングブログ、少数のアグリゲータなど。個人ブログも、その分野で定評のある情報源なら歓迎します。

向かないもの: 技術的な中身のない宣伝フィード、止まったプロジェクト、認証が必要なフィード、更新が少なすぎて直近 2 年に何もないもの。

## フィードを削除する

エントリを消して、理由を PR の説明に書いてください。「2024 年に更新が止まった」「URL が 3 週間 404 を返している」くらいで十分です。キュレーションには引き算も含まれます。増えるだけのカタログは墓場になります。
