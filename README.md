# Medical Mattress Care, website v1

Statische site in HTML, CSS en een beetje JavaScript, gegenereerd uit productdata. Geen dependencies.

## Mappen

- `briefing/` bijgewerkte briefing (`BRIEFING.md`, met de antwoorden uit de vragenlijst), de oorspronkelijke briefing en het oude brandboek.
- `info/` bronnen van de klant: catalogus, vragenlijst, Fairsales-certificaat, EU-conformiteitsverklaring MMC V10.
- `assets/` logo's (svg), originele productfoto's, hernoemde productfoto's, uitsneden en scans uit de catalogus.
- `site/` de website.
  - `src/data/producten.mjs` alle producten (een object per product).
  - `src/data/site.mjs` bedrijfsgegevens, categorieën, toepassingen, hoesfiche, oude URL's.
  - `src/i18n/nl.mjs` interfaceteksten.
  - `build.mjs` de sjablonen; schrijft alle pagina's naar `public/`.
  - `public/` de site zelf (css, js, img, logo, docs blijven staan, de rest wordt bij elke build opnieuw gemaakt).
- `OPEN-PUNTEN.md` vragen aan de klant, foto's en technische to-do's.

## Werken

```bash
cd site
node build.mjs                          # bouwt public/
python3 -m http.server 4321 -d public   # bekijk op http://localhost:4321
```

Een product aanpassen of toevoegen: wijzig `src/data/producten.mjs` en bouw opnieuw. Foto's horen in `public/img/producten/`.

## Ontwerp

Fira Sans (huisstijl), MMC-indigo en oranje als signaal, volle vlakken van rand tot rand, inspiratie Carvico. Tokens in `public/css/tokens.css`, basis in `base.css`, de site in `site.css`. Gecontroleerd met Hallmark (sloplint).

## Voorbeeld online

Elke push naar `main` bouwt de site en zet ze op GitHub Pages: https://wizarts-be.github.io/medical-mattrass-care/ (met `noindex`, niet bedoeld voor Google). Lokaal bouwen met een subpad: `BASE_PATH=/medical-mattrass-care node site/build.mjs`.
