# Contributing

Adding a feed is a five-line pull request. Removing one that has gone permanently dead is just as welcome.

## Adding a feed

Add an entry to the right file in `feeds/` with only these fields:

```yaml
- name: Deno
  url: https://deno.com/feed
  site: https://deno.com/blog
  category: languages
  kind: blog
  language: en
```

- **name** — how it appears in the table and in notifications. Short and human: "Google AI Blog", not "google-ai-blog-rss".
- **url** — the feed itself. Open it in a browser first and confirm it returns XML with entries.
- **site** — the human-facing page, so a reader can see what they'd be subscribing to.
- **category** — one of the files in `feeds/`. Put it where a reader would look for it.
- **kind** — `blog` for narrative posts, `changelog` for many short entries, `release-notes` for version announcements. This feeds the radio-friendliness estimate, so be honest: a changelog labelled `blog` will mislead people.
- **language** — `en` or `ja`.

**Do not fill in `volume`, `radio_friendly`, `has_timestamps`, `latest_post`, `status`, or `last_checked`.** Those are measurements; CI writes them by actually fetching the feed. Hand-written values would be exactly the kind of stale claim this catalog exists to avoid.

### Sites with no RSS feed

Point at the sitemap and pick a URL prefix:

```yaml
- name: Anthropic News
  type: sitemap
  url: https://www.anthropic.com/sitemap.xml
  prefix: https://www.anthropic.com/news/
  site: https://www.anthropic.com/news
  category: ai-models
  kind: blog
  language: en
```

Several entries may share one sitemap with different prefixes — that is supported and correct.

### Sites behind bot protection

If the article pages return a challenge to non-browser clients (Cloudflare's "Just a moment…" and friends), add `source_mode: text`. That tells consumers to use the feed's own summary text instead of fetching the article. Do not work around bot protection by spoofing a browser User-Agent.

## What CI checks

Every pull request runs:

1. **Schema check** — required fields, valid category/kind/language, `prefix` present for sitemap entries.
2. **Generated-files check** — `README.md` and `site/feeds.json` must match the data.
3. **Reachability** — the feed URL is fetched. If it doesn't return parseable entries, the PR fails.

Before pushing, run both locally:

```bash
pip install -r requirements.txt
python scripts/validate.py     # fetches feeds, fills in measurements
python scripts/build.py        # regenerates README.md and site/feeds.json
```

Commit whatever those two commands change.

## What belongs here

Feeds a working developer would plausibly want to follow: official project blogs, vendor changelogs, engineering blogs, and a small number of aggregators. Personal blogs are welcome when they are a recognised source in their area.

Not a good fit: marketing feeds with no technical content, dead projects, feeds that need authentication, and anything that publishes so rarely it has nothing from the last two years.

## Removing a feed

Delete the entry and say why in the PR description. "The site stopped publishing in 2024" or "the URL has 404'd for three weeks" is plenty. Curation includes subtraction — a catalog that only grows becomes a graveyard.
