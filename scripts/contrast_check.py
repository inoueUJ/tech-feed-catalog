"""Check the site's color tokens against WCAG 2.1 AA contrast ratios, in both themes.

Reads the token blocks straight out of site/index.html (and site/guide/index.html
when present), so the check follows the CSS instead of a copy of it.

Usage:
    python scripts/contrast_check.py            # print every pair with its ratio
    python scripts/contrast_check.py --check    # exit 1 if any pair is below its requirement (CI)

Text needs 4.5:1; UI component boundaries (button edges, chips) need 3:1.
A ghost button is allowed to sit on a near-identical page background only because
its border carries the 3:1 boundary — that pair is checked, the fill is not.
"""

import argparse
import os
import re
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = [os.path.join(BASE_DIR, 'site', 'index.html'), os.path.join(BASE_DIR, 'site', 'guide', 'index.html')]

TEXT = 4.5
UI = 3.0

# (label, foreground token or literal, background token or literal, required ratio, themes)
PAIRS = [
    ('body text on page', 'text', 'bg', TEXT, 'both'),
    ('dim text on page', 'text-dim', 'bg', TEXT, 'both'),
    ('dim text on surface', 'text-dim', 'surface', TEXT, 'both'),
    ('faint text on page', 'text-faint', 'bg', TEXT, 'both'),
    ('faint text on surface', 'text-faint', 'surface', TEXT, 'both'),
    ('faint text on surface-2', 'text-faint', 'surface-2', TEXT, 'both'),
    ('accent text on page', 'accent', 'bg', TEXT, 'both'),
    ('accent text on surface', 'accent', 'surface', TEXT, 'both'),
    ('primary button label on accent', 'on-accent', 'accent', TEXT, 'both'),
    ('pressed segment label', 'surface', 'text', TEXT, 'both'),
    ('unpressed segment label', 'text-dim', 'btn-ghost-bg', TEXT, 'both'),
    ('ghost button label', 'text', 'btn-ghost-bg', TEXT, 'both'),
    ('ok text on ok-soft', 'ok', 'ok-soft', TEXT, 'both'),
    ('bad text on bad-soft', 'bad', 'bad-soft', TEXT, 'both'),
    ('warn text on page', 'warn', 'bg', TEXT, 'both'),
    ('warn text on warn-soft', 'warn', 'warn-soft', TEXT, 'both'),
    ('text on accent-soft', 'text', 'accent-soft', TEXT, 'both'),
    ('button border on surface', 'border-strong', 'surface', UI, 'both'),
    ('button border on ghost fill', 'border-strong', 'btn-ghost-bg', UI, 'both'),
    ('button border on surface-2', 'border-strong', 'surface-2', UI, 'both'),
    ('accent border on surface', 'accent', 'surface', UI, 'both'),
]


def luminance(hex_color):
    r, g, b = (int(hex_color[i : i + 2], 16) / 255 for i in (1, 3, 5))

    def channel(c):
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)


def ratio(a, b):
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def tokens(block):
    return dict(re.findall(r'--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})', block))


INTERACTIVE = re.compile(r'\.(btn|btn-sm|chip|tchip|seg|pack|mark)\b')
LITERAL_COLOR = re.compile(r'(?<![-\w])color:\s*#')


def literal_color_rules(html):
    """Rules on buttons/chips that paint their text with a literal color instead of a token.

    A literal color on `.btn` plus a theme-scoped override is how the dark theme ended up with
    near-black labels on ghost buttons (the override's higher specificity beat `.btn.ghost`).
    Tokens make the cascade flat, so the check refuses literals on interactive elements.
    """
    css = html.split('<style>', 1)[1].split('</style>', 1)[0]
    bad = []
    for sel, body in re.findall(r'([^{}]+)\{([^{}]*)\}', css):
        sel = sel.strip()
        if sel.startswith(':root') or sel.startswith('@'):
            continue
        if INTERACTIVE.search(sel) and LITERAL_COLOR.search(body):
            bad.append(sel)
    return bad


def themes(html):
    light = tokens(html.split(':root {', 1)[1].split('}', 1)[0])
    dark = tokens(html.split(':root[data-theme="dark"] {', 1)[1].split('}', 1)[0])
    return {'light': light, 'dark': dark}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()

    failures = 0
    for page in PAGES:
        if not os.path.exists(page):
            continue
        with open(page, encoding='utf-8') as f:
            html = f.read()
        print(f'== {os.path.relpath(page, BASE_DIR)} ==')
        for sel in literal_color_rules(html):
            failures += 1
            print(f'    FAIL literal text color on interactive rule: {sel}')
        for theme, palette in themes(html).items():
            print(f'  [{theme}]')
            for label, fg, bg, required, scope in PAIRS:
                if scope not in ('both', theme):
                    continue
                cf = fg if fg.startswith('#') else palette.get(fg)
                cb = bg if bg.startswith('#') else palette.get(bg)
                if not cf or not cb:
                    print(f'    {label:34} (token missing: {fg} / {bg})')
                    continue
                r = ratio(cf, cb)
                ok = r >= required
                failures += 0 if ok else 1
                print(f'    {"ok " if ok else "FAIL"} {label:34} {cf} on {cb}  {r:4.1f}:1  (needs {required}:1)')
    if args.check and failures:
        print(f'{failures} pair(s) below the required contrast.', file=sys.stderr)
        sys.exit(1)
    print('All contrast pairs pass.' if not failures else f'{failures} pair(s) below the required contrast.')


if __name__ == '__main__':
    main()
