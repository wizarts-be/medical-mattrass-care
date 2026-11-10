# Open points, MMC v2

## Before go-live

- **Remove the post-it review script** from `site/src/layouts/Base.astro` (the line marked REMOVE BEFORE GO-LIVE). Feedback lands in the Sheet of project `mmc`: https://docs.google.com/spreadsheets/d/1GKzs5_a98w9qyUw9KBVuTOC9lhbyDpFW2LB_rFQdhgg/edit

## To ask the client

1. **Showroom Lokeren** (Scherpeputstraat 16) and **opening hours**: taken from the current site (2020). Still correct?
2. **References and figures**: may we show institutions or numbers? Proof is now certificates only.
3. **Copy claims to confirm**:
   - "Bijna alle standaardproducten liggen klaar, voor een snelle levering."
   - "U krijgt snel antwoord."
   - Custom work in three steps (send sizes → we propose a build + quote → we make and deliver).
4. **MMC V10 widths**: the home says "In vier breedtes, van 90 tot 180 cm" (V10 A to D). OK?
5. **Form destination**: where should quote requests go? Now they open as an email to michel@medicalmattresscare.com.
6. **Status**: MMC AT cover (shown as "Beschikbaarheid op aanvraag"), Bicolor fifth colour name, TVP 24 per box, missing order codes (Thuis matras, police-cell mattress, baby duvet, AT cover).
7. **Legal texts**: privacy, cookies, disclaimer still to be supplied.
8. **FR/EN**: translations (pages `/fr/` and `/en/` now show a holding message).

## Photos

The 3D carries the home; product photos are still 640 px. Biggest gain: new photos of the V10 (zip half open), the PU cover up close, and the products without a photo (baby duvet, Incopad, AT cover now show a "Foto volgt" panel).

## Technical

- Hosting and domain to choose. `site` in `astro.config.mjs` is `https://www.medical-mattress-care.com`.
- Test the 3D on a few real devices (older iPads in care homes).

## Atmosphere images (AI, November 2026)

Three AI atmosphere images are ready in Canva but could not be downloaded at full resolution automatically. Download them (Canva > Download, JPG) and put them in `site/public/img/sfeer/` with these names. They are for atmosphere only, never as product photos:

- `zorgkamer.jpg`: a room in a care home, morning light. https://www.canva.com/M/MAHaahk6GrU
- `naaien.jpg`: a sewing machine on indigo fabric, a craftsperson's hands. https://www.canva.com/M/MAHaarlsuEs
- `schuim.jpg`: macro of open-cell foam. https://www.canva.com/M/MAHaapLo3aM
- (The satin ribbons in the brand colours, https://www.canva.com/M/MAHaanF5WcI, were replaced by our own 3D render.)

## Brand

New palette (November 2026): white #FFFFFF, orange #EF5F18, purple-blue #261A66. Every other colour on the site is a tint or shade of these three (`site/src/styles/tokens.css`). The logo SVGs in `site/public/logo/` have been recoloured; the originals are unchanged in `assets/logo/`.
