#!/bin/sh
# Builds the site for the GitHub Pages preview (sub-path, noindex) and publishes it on the gh-pages branch.
# Usage (from the mmc_v2 folder): sh site/deploy-pages.sh
set -e
REPO=wizarts-be/medical-mattrass-care
NAME=medical-mattrass-care
URL=git@github-work:$REPO.git
TMP=$(mktemp -d)

# 1. Build
(cd site && npx astro build)
cp -R site/dist "$TMP/build"

# 2. Prefix every root-relative URL with the Pages sub-path, and keep the preview out of Google
python3 - "$TMP/build" "/$NAME" <<'PY'
import os, re, sys
root, base = sys.argv[1], sys.argv[2]
attr = re.compile(r'''((?:href|src|srcset|poster|action|content|data-[a-z-]+)=["'])/(?!/)''')
css_url = re.compile(r'''url\((["']?)/(?!/)''')
refresh = re.compile(r'(url=)/(?!/)')
js_abs = re.compile(r'''(["'])/_astro/''')
for d, _, files in os.walk(root):
    for f in files:
        p = os.path.join(d, f)
        if f.endswith('.html'):
            s = open(p, encoding='utf-8').read()
            s = attr.sub(lambda m: m.group(1) + base + '/', s)
            s = refresh.sub(lambda m: m.group(1) + base + '/', s)
            s = css_url.sub(lambda m: 'url(' + m.group(1) + base + '/', s)
            if 'name="robots"' not in s:
                s = s.replace('<head>', '<head><meta name="robots" content="noindex">', 1)
            open(p, 'w', encoding='utf-8').write(s)
        elif f.endswith('.css'):
            s = open(p, encoding='utf-8').read()
            open(p, 'w', encoding='utf-8').write(css_url.sub(lambda m: 'url(' + m.group(1) + base + '/', s))
        elif f.endswith('.js'):
            s = open(p, encoding='utf-8').read()
            open(p, 'w', encoding='utf-8').write(js_abs.sub(lambda m: m.group(1) + base + '/_astro/', s))
PY
printf 'User-agent: *\nDisallow: /\n' > "$TMP/build/robots.txt"
touch "$TMP/build/.nojekyll"

# 3. Fetch gh-pages (or start it), replace its contents with the new build
if git clone -q --depth 1 --branch gh-pages "$URL" "$TMP/out" 2>/dev/null; then
  :
else
  mkdir "$TMP/out" && (cd "$TMP/out" && git init -q -b gh-pages && git remote add origin "$URL")
fi
(cd "$TMP/out" && git rm -rq --ignore-unmatch . >/dev/null)
cp -R "$TMP/build/." "$TMP/out/"

# 4. Commit and push (no force)
cd "$TMP/out"
git add -A
if git diff --cached --quiet; then echo "No changes."; exit 0; fi
git -c user.name="Wizarts" -c user.email="ai@wizarts.be" commit -q -m "Update preview (v2)"
git push -q origin gh-pages
echo "Published: https://wizarts-be.github.io/$NAME/"
