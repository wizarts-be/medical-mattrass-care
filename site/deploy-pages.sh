#!/bin/sh
# Bouwt de site met het GitHub Pages-pad en zet het resultaat op de branch gh-pages.
# Gebruik (vanuit de map mmc_v1): sh site/deploy-pages.sh
set -e
REPO=wizarts-be/medical-mattrass-care
NAME=medical-mattrass-care
URL=https://github.com/$REPO.git
CRED='!gh auth git-credential'
TMP=$(mktemp -d)

# 1. Bouwen in een kopie, met het subpad van GitHub Pages
cp -R site "$TMP/site"
(cd "$TMP/site" && BASE_PATH=/$NAME node build.mjs)

# 2. De gh-pages branch ophalen, of een nieuwe beginnen
if git -c credential.helper= -c "credential.helper=$CRED" clone -q --depth 1 --branch gh-pages "$URL" "$TMP/out" 2>/dev/null; then
  :
else
  mkdir "$TMP/out" && (cd "$TMP/out" && git init -q -b gh-pages && git remote add origin "$URL")
fi

# 3. Inhoud vervangen door de nieuwe build
(cd "$TMP/out" && git rm -rq --ignore-unmatch . >/dev/null)
cp -R "$TMP/site/public/." "$TMP/out/"
touch "$TMP/out/.nojekyll"

# 4. Committen en gewoon pushen
cd "$TMP/out"
git add -A
if git diff --cached --quiet; then echo "Geen wijzigingen."; exit 0; fi
git -c user.name="Wizarts" -c user.email="ai@wizarts.be" commit -q -m "Voorbeeld bijwerken"
git -c credential.helper= -c "credential.helper=$CRED" push -q origin gh-pages
echo "Gepubliceerd: https://wizarts-be.github.io/$NAME/"
