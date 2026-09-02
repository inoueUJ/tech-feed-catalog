"""Regenerate everything derived from feeds/*.yaml: the README table and site/feeds.json.

The catalog data is the single source of truth. Nothing here reaches the network —
measurements come from scripts/validate.py.

Usage:
    python scripts/build.py              # rewrite README.md and site/feeds.json
    python scripts/build.py --check      # exit 1 if either is out of date (CI)
"""

import argparse
import json
import os
import sys

import yaml
from jsonschema import Draft202012Validator

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FEEDS_DIR = os.path.join(BASE_DIR, 'feeds')
README_PATH = os.path.join(BASE_DIR, 'README.md')
SITE_DATA_PATH = os.path.join(BASE_DIR, 'site', 'feeds.json')
SCHEMA_PATH = os.path.join(BASE_DIR, 'schema.json')

BEGIN = '<!-- BEGIN CATALOG -->'
END = '<!-- END CATALOG -->'

CATEGORY_LABELS = {
    'ai-models': ('AI models & research', 'AI モデル・研究'),
    'ai-coding': ('AI coding tools', 'AI コーディングツール'),
    'infra': ('Cloud & infrastructure', 'クラウド・インフラ'),
    'languages': ('Languages & runtimes', '言語・ランタイム'),
    'frontend': ('Frontend', 'フロントエンド'),
    'security': ('Security', 'セキュリティ'),
    'companies': ('Company engineering blogs', '企業テックブログ'),
    'aggregators': ('Aggregators', 'アグリゲータ'),
}
CATEGORY_ORDER = list(CATEGORY_LABELS)

RADIO_STARS = {'high': '★★★', 'medium': '★★', 'low': '★'}
KIND_LABELS = {'blog': 'blog', 'changelog': 'changelog', 'release-notes': 'releases'}


def load_feeds():
    """Return all entries, validated against schema.json, in catalog order."""
    with open(SCHEMA_PATH, encoding='utf-8') as f:
        validator = Draft202012Validator(json.load(f))

    entries = []
    for category in CATEGORY_ORDER:
        path = os.path.join(FEEDS_DIR, f'{category}.yaml')
        if not os.path.exists(path):
            continue
        with open(path, encoding='utf-8') as f:
            items = yaml.safe_load(f) or []
        errors = sorted(validator.iter_errors(items), key=lambda e: e.path)
        if errors:
            for error in errors:
                location = '/'.join(str(p) for p in error.path)
                print(f'{category}.yaml [{location}]: {error.message}', file=sys.stderr)
            sys.exit(1)
        for item in items:
            if item['category'] != category:
                print(f"{category}.yaml: '{item['name']}' has category '{item['category']}'", file=sys.stderr)
                sys.exit(1)
        entries += items
    return entries


def status_cell(entry):
    status = entry.get('status', 'ok')
    checked = entry.get('last_checked', '?')
    if status == 'ok':
        return f'✅ {checked}'
    if status == 'stale':
        return f'💤 {entry.get("status_detail", "stale")}'
    return f'⚠️ {entry.get("status_detail", "broken")}'


def render_table(entries):
    lines = []
    for category in CATEGORY_ORDER:
        items = [e for e in entries if e['category'] == category]
        if not items:
            continue
        en, ja = CATEGORY_LABELS[category]
        lines.append(f'### {en} / {ja}\n')
        lines.append('| Feed | Kind | Volume | Radio | Lang | Feed URL | Checked |')
        lines.append('|---|---|---|---|---|---|---|')
        for e in items:
            feed_link = f"[{'sitemap' if e.get('type') == 'sitemap' else 'RSS'}]({e['url']})"
            if e.get('source_mode') == 'text':
                feed_link += ' ¹'
            lines.append(
                f"| [{e['name']}]({e['site']}) "
                f"| {KIND_LABELS[e['kind']]} "
                f"| {e.get('volume', '?')} "
                f"| {RADIO_STARS.get(e.get('radio_friendly'), '?')} "
                f"| {e['language']} "
                f"| {feed_link} "
                f"| {status_cell(e)} |"
            )
        lines.append('')
    lines.append('¹ Article pages block automated fetchers — subscribe using the feed summary, not the URL.\n')
    return '\n'.join(lines)


def render_readme(entries):
    with open(README_PATH, encoding='utf-8') as f:
        current = f.read()
    if BEGIN not in current or END not in current:
        print(f'README.md is missing the {BEGIN} / {END} markers', file=sys.stderr)
        sys.exit(1)
    head, rest = current.split(BEGIN, 1)
    _stale, tail = rest.split(END, 1)

    ok = sum(1 for e in entries if e.get('status') == 'ok')
    summary = f'**{len(entries)} feeds** across {len(CATEGORY_ORDER)} categories · {ok} verified working\n\n'
    return f'{head}{BEGIN}\n\n{summary}{render_table(entries)}{END}{tail}'


def render_site_data(entries):
    payload = {
        'categories': [
            {'id': cid, 'label_en': en, 'label_ja': ja}
            for cid, (en, ja) in CATEGORY_LABELS.items()
            if any(e['category'] == cid for e in entries)
        ],
        'feeds': entries,
    }
    return json.dumps(payload, ensure_ascii=False, indent=2) + '\n'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true', help='exit 1 if generated files are out of date')
    args = parser.parse_args()

    entries = load_feeds()
    readme = render_readme(entries)
    site_data = render_site_data(entries)

    if args.check:
        stale = []
        with open(README_PATH, encoding='utf-8') as f:
            if f.read() != readme:
                stale.append('README.md')
        if not os.path.exists(SITE_DATA_PATH):
            stale.append('site/feeds.json')
        else:
            with open(SITE_DATA_PATH, encoding='utf-8') as f:
                if f.read() != site_data:
                    stale.append('site/feeds.json')
        if stale:
            print(f'Out of date: {", ".join(stale)}. Run: python scripts/build.py', file=sys.stderr)
            sys.exit(1)
        print(f'Generated files are up to date ({len(entries)} feeds).')
        return

    with open(README_PATH, 'w', encoding='utf-8') as f:
        f.write(readme)
    os.makedirs(os.path.dirname(SITE_DATA_PATH), exist_ok=True)
    with open(SITE_DATA_PATH, 'w', encoding='utf-8') as f:
        f.write(site_data)
    print(f'Wrote README.md and site/feeds.json ({len(entries)} feeds).')


if __name__ == '__main__':
    main()
