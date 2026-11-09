# Medical Mattress Care, website v2: "The made bed"

Astro site, static output. Concept: the site is a care bed being made and unmade. The home opens on a 3D mattress (Three.js) in the MMC 210 PU cover. You press into it, it sinks like visco and slowly recovers, and the dent shows as a pressure map. Scrolling unmakes the bed: sheet off, cover up, visco and CMHR apart.

## Folders

- `briefing/`: client info, questionnaire, brand book, catalogue
- `assets/`: logos, original and processed photos
- `PRODUCT.md`: product truth (impeccable)
- `.impeccable/`: direction contract, review captures
- `site/`: the website
  - `src/data/producten.mjs`: all products (one object per product, from v1)
  - `src/data/site.mjs`: company details, categories, cover sheet, old URLs
  - `src/scripts/bed.ts`: the 3D engine (pressure simulation, shaders, scroll unmaking)
  - `src/pages/`: pages; `producten/[categorie]/[slug].astro` generates every product page
  - `src/styles/tokens.css`: colours, type, spacing

## Working

Homebrew Node on this Mac is broken (missing simdjson). Use the nvm Node:

```bash
export PATH=~/.nvm/versions/node/v24.12.0/bin:$PATH
cd site
npm install
npm run dev      # http://localhost:4321
npm run build    # writes dist/
```

## Notes

- 3D: falls back to a fabric photo plus a drawn layer diagram without WebGL2. With "reduced motion" there is no lying-down demo and no scroll unmaking (static diagram instead).
- Forms: `src/pages/offerte.astro`, constant `ENDPOINT`. Empty = the request opens as an email to info@ (works right away). Fill in an endpoint (Formspree, own PHP, CRM) to post directly.
- Redirects from the old WordPress URLs: `public/_redirects` (Netlify/Cloudflare), `public/.htaccess` (Apache), plus Astro redirect pages.
- WordPress: the wp-builder-agent can convert this folder later. Note that the 3D home then needs to come along as a custom block or template script.
