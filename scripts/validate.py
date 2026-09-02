"""Fetch every catalogued feed, prove it is alive, and measure it.

Read-only: nothing here writes to a feed's server or to NotebookLM. The measured
fields (volume, avg_summary_chars, has_timestamps) are what make this catalog
different from a hand-written link list — they can only be known by fetching.

Usage:
    python scripts/validate.py                 # validate feeds/*.yaml, update measurements
    python scripts/validate.py --check-only    # exit 1 if anything is broken (CI)
    python scripts/validate.py --probe FILE    # measure a candidate list, print YAML
"""

import argparse
import datetime
import os
import re
import sys
from concurrent.futures import ThreadPoolExecutor
from xml.etree import ElementTree

import feedparser
import httpx
import yaml

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FEEDS_DIR = os.path.join(BASE_DIR, 'feeds')

UTC = datetime.UTC
TIMEOUT = 30.0
USER_AGENT = 'tech-feed-catalog/1.0 (+https://github.com/inoueUJ/tech-feed-catalog)'

# A feed is "stale" once nothing new has appeared for this long. Not an error —
# some projects genuinely publish twice a year — but worth showing in the table.
STALE_DAYS = 180
# Window used to compute the publishing rate shown in the catalog.
VOLUME_WINDOW_DAYS = 90


def fetch(url):
    return httpx.get(url, timeout=TIMEOUT, follow_redirects=True, headers={'User-Agent': USER_AGENT})


def measure_rss(url):
    """Return measurements for an RSS/Atom feed, or {'error': ...}."""
    try:
        response = fetch(url)
    except Exception as e:
        return {'error': f'fetch failed: {type(e).__name__}'}
    if response.status_code >= 400:
        return {'error': f'HTTP {response.status_code}'}

    parsed = feedparser.parse(response.content)
    if not parsed.entries:
        reason = 'no entries'
        if getattr(parsed, 'bozo', False):
            reason += f' (parse error: {type(parsed.bozo_exception).__name__})'
        return {'error': reason}

    dates = []
    summary_lengths = []
    for entry in parsed.entries:
        for attr in ('published_parsed', 'updated_parsed'):
            value = getattr(entry, attr, None)
            if value:
                dates.append(datetime.datetime(*value[:6], tzinfo=UTC))
                break
        contents = getattr(entry, 'content', None)
        raw = (contents[0].get('value') if contents else '') or getattr(entry, 'summary', '') or ''
        summary_lengths.append(len(re.sub(r'<[^>]+>', '', raw).strip()))

    latest = max(dates) if dates else None
    return {
        'entries': len(parsed.entries),
        'has_timestamps': len(dates) == len(parsed.entries),
        'latest': latest,
        'latest_title': getattr(parsed.entries[0], 'title', '')[:80],
        'dates': dates,
        'avg_summary_chars': int(sum(summary_lengths) / len(summary_lengths)) if summary_lengths else 0,
    }


def measure_sitemap(url, prefix):
    """Return measurements for a sitemap-as-feed entry, or {'error': ...}."""
    try:
        response = fetch(url)
    except Exception as e:
        return {'error': f'fetch failed: {type(e).__name__}'}
    if response.status_code >= 400:
        return {'error': f'HTTP {response.status_code}'}

    try:
        root = ElementTree.fromstring(response.content)
    except ElementTree.ParseError as e:
        return {'error': f'parse error: {type(e).__name__}'}

    ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    dates = []
    count = 0
    latest_loc = ''
    for node in root.findall('sm:url', ns):
        loc = (node.findtext('sm:loc', default='', namespaces=ns) or '').strip()
        if not loc.startswith(prefix) or loc.rstrip('/') == prefix.rstrip('/'):
            continue
        count += 1
        lastmod = (node.findtext('sm:lastmod', default='', namespaces=ns) or '').strip()
        if lastmod:
            try:
                parsed_date = datetime.datetime.fromisoformat(lastmod.replace('Z', '+00:00'))
                if parsed_date.tzinfo is None:
                    parsed_date = parsed_date.replace(tzinfo=UTC)
                dates.append(parsed_date)
                if parsed_date == max(dates):
                    latest_loc = loc
            except ValueError:
                pass

    if not count:
        return {'error': f'no URLs under prefix: {prefix}'}

    return {
        'entries': count,
        # A sitemap without <lastmod> still works — newness is decided by URL set
        # membership, not time — so this is information, not a failure.
        'has_timestamps': bool(dates) and len(dates) == count,
        'latest': max(dates) if dates else None,
        'latest_title': latest_loc.rstrip('/').rsplit('/', 1)[-1].replace('-', ' ')[:80],
        'dates': dates,
        'avg_summary_chars': 0,  # sitemaps carry no body; NotebookLM fetches the page
    }


def measure(entry):
    if entry.get('type') == 'sitemap':
        return measure_sitemap(entry['url'], entry['prefix'])
    return measure_rss(entry['url'])


def volume_per_month(dates, now):
    """Articles per month over the recent window. Returns None when undecidable."""
    if not dates:
        return None
    cutoff = now - datetime.timedelta(days=VOLUME_WINDOW_DAYS)
    recent = [d for d in dates if d >= cutoff]
    if not recent:
        return 0.0
    # Feeds capped at N entries can be fully inside the window; then the real rate
    # is at least what we counted, computed over the span we can actually see.
    span_days = max((now - min(recent)).days, 1)
    return len(recent) / span_days * 30


def radio_friendliness(entry, result, volume):
    """How well this feed suits a generated audio overview: high | medium | low.

    Derived, not guessed: long-form blog posts make a good conversation; a
    changelog firehose of one-line entries makes a bad one.
    """
    kind = entry.get('kind', 'blog')
    if kind == 'blog':
        base = 3
    elif kind == 'release-notes':
        base = 2
    else:  # changelog
        base = 1

    if volume is not None and volume > 40:
        base -= 1  # a firehose crowds out everything else in a daily notebook
    if result.get('avg_summary_chars', 0) >= 1500:
        base += 1  # ships full articles, not teasers
    return {3: 'high', 2: 'medium'}.get(max(1, min(3, base)), 'low')


def format_volume(volume):
    if volume is None:
        return 'unknown'
    if volume < 1:
        return '<1/month'
    if volume < 10:
        return f'~{volume:.0f}/month'
    return f'~{round(volume / 5) * 5}/month'


def enrich(entry, now):
    """Return (updated_entry, problem_or_None)."""
    result = measure(entry)
    updated = dict(entry)
    updated['last_checked'] = now.date().isoformat()

    if 'error' in result:
        updated['status'] = 'broken'
        updated['status_detail'] = result['error']
        return updated, f"{entry['name']}: {result['error']}"

    volume = volume_per_month(result['dates'], now)
    updated['status'] = 'ok'
    updated.pop('status_detail', None)
    updated['has_timestamps'] = result['has_timestamps']
    updated['volume'] = format_volume(volume)
    updated['radio_friendly'] = radio_friendliness(entry, result, volume)

    latest = result['latest']
    if latest:
        updated['latest_post'] = latest.date().isoformat()
        if (now - latest).days > STALE_DAYS:
            updated['status'] = 'stale'
            updated['status_detail'] = f'no new posts for {(now - latest).days} days'
    return updated, None


def load_catalog():
    """Return {filename: [entries]} for every feeds/*.yaml."""
    catalog = {}
    for filename in sorted(os.listdir(FEEDS_DIR)):
        if not filename.endswith('.yaml'):
            continue
        with open(os.path.join(FEEDS_DIR, filename), encoding='utf-8') as f:
            catalog[filename] = yaml.safe_load(f) or []
    return catalog


def save_file(filename, entries):
    path = os.path.join(FEEDS_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        yaml.safe_dump(entries, f, allow_unicode=True, sort_keys=False, width=100)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check-only', action='store_true', help='exit 1 on broken feeds; write nothing')
    parser.add_argument('--probe', help='measure a candidate YAML file and print the result')
    args = parser.parse_args()

    now = datetime.datetime.now(UTC)

    if args.probe:
        with open(args.probe, encoding='utf-8') as f:
            candidates = yaml.safe_load(f) or []
        with ThreadPoolExecutor(max_workers=12) as pool:
            results = list(pool.map(lambda e: enrich(e, now), candidates))
        good = [entry for entry, problem in results if not problem]
        for _entry, problem in results:
            if problem:
                print(f'DROP {problem}', file=sys.stderr)
        print(yaml.safe_dump(good, allow_unicode=True, sort_keys=False, width=100))
        print(f'\n{len(good)}/{len(candidates)} usable', file=sys.stderr)
        return

    catalog = load_catalog()
    problems = []
    for filename, entries in catalog.items():
        with ThreadPoolExecutor(max_workers=12) as pool:
            results = list(pool.map(lambda e: enrich(e, now), entries))
        updated = [entry for entry, _ in results]
        problems += [p for _, p in results if p]
        if not args.check_only:
            save_file(filename, updated)
        print(f'{filename}: {len(entries)} feeds checked')

    if problems:
        print(f'\n{len(problems)} feed(s) need attention:', file=sys.stderr)
        for problem in problems:
            print(f'  - {problem}', file=sys.stderr)
        if args.check_only:
            sys.exit(1)
    else:
        print('\nAll feeds OK.')


if __name__ == '__main__':
    main()
