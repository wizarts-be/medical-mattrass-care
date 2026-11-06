# Open punten Medical Mattress Care v1

## Aan de klant te vragen

1. **Aanspreekvorm** je of u. Nu overal **u**.
2. **E-mailadres** op de site: info@medical-mattress-care.com of michel@medicalmattresscare.com? Nu info@.
3. **Referenties en cijfers**: mogen we namen of logo's van instellingen tonen? Cijfers (aantal instellingen, geleverde matrassen)? Nu niets getoond.
4. **Certificaten actueel?** ISO 14001 (productiehuis), Fairsales (certificaat 2026 staat online als pdf). Logo's van ISO 14001 en Fairsales als bestand aanleveren.
5. **Technische fiches** als pdf per product. Nu enkel de EU-conformiteitsverklaring van de MMC V10. Andere producten: knop "Technische fiche aanvragen" via het formulier.
6. **Status**: MMC AT cover (te bevestigen, staat online met melding "beschikbaarheid op aanvraag"), coronaproducten, MMC Meubelen, Normocare (niet op de site).
7. **MMC Bicolor**: naam van de vijfde kleurcombinatie (nu "donkerbruin / beige").
8. **MMC TVP 24**: aantal per doos.
9. **Bestelcodes ontbreken** voor MMC Thuis matras (enkel CNK-codes), politiecelmatras, MMC baby dekbed en MMC AT cover.
10. **Maatwerkproces**: kloppen de drie stappen op `/maatwerk/` (maten sturen, opbouw en offerte, maken en leveren)?
11. **"Wie belt, krijgt Michel aan de lijn"** (over-mmc): akkoord om dit zo te zeggen?
12. **"Eén vast aanspreekpunt: Michel Marynissen zelf"** (homepage, sectie "Wat u eraan heeft"): klopt dat? Zo niet, wordt het "Een persoonlijk aanspreekpunt".

## Foto's (grootste winst)

De productfoto's zijn 640 px breed. Op een groot scherm worden ze zacht. Vraag de originele bestanden of laat nieuwe foto's maken. Prioriteit:

| Plaats | Nu | Wat er hoort |
|---|---|---|
| Home hero (volledig scherm, 2560 px) | `hero-stof.jpg`, sfeerbeeld van stof uit de eerdere poging (herkomst te bevestigen, mogelijk AI) | eigen beeld: de MMC 210 PU-hoes of een matras van heel dichtbij, in indigolicht |
| Home MMC V10 (half scherm) | `mmc-v10.jpg`, 640 px | MMC V10 met rits half open, hoge resolutie |
| Home hoesband en productpagina's (4:3) | `mmc-210-pu-hoes.jpg`, `mmc-pu-hoes-flap.jpg` | de hoes van dichtbij, rits en hoek, in licht van opzij |
| MMC Flex, MMC Thuis matras, MMC Bicolor | uitgeknipt uit de gescande catalogus | echte productfoto's |
| MMC V12, S-reeks, politiecelmatras | foto van de PU-hoes (met vermelding) | foto van de matras zelf |
| MMC baby dekbed, MMC Incopad, MMC AT cover | geen foto, de naam staat in het vlak | productfoto |
| Over MMC (4:3) | MMC-blok met logo | Michel, of het atelier in Sint-Pauwels |

Elke foto zit in een slot (`data-slot`), dus vervangen is enkel het bestand in `site/public/img/` overschrijven of de bestandsnaam in `producten.mjs` aanpassen.

## Technisch

- **Formulieren** (offerte, staal, fiche) zijn niet gekoppeld. Ze versturen niets en zeggen dat ook. Vul `data-endpoint` in `site/build.mjs` (zoek op `TODO koppeling formulier`) met de gekozen dienst (bv. Formspree, eigen PHP, CRM).
- **Vertalingen** FR en EN: `/fr/` en `/en/` tonen nu een melding. Voeg `src/i18n/fr.mjs` en `en.mjs` toe en vertaal de productdata.
- **Juridische teksten** (disclaimer, privacy, cookies) nog aan te leveren.
- **Kaart** op de contactpagina: nu een link naar OpenStreetMap, geen ingebedde kaart (geen cookies).
- **Domein**: canonical en sitemap gebruiken `https://www.medical-mattress-care.com`. Aanpassen in `src/data/site.mjs` als dat verandert.
- **Doorverwijzingen** van de oude WordPress-URL's staan in `public/_redirects` (Netlify/Cloudflare) en `public/.htaccess` (Apache).
- **WordPress**: als de site in WordPress moet, kan de wp-builder-agent deze map omzetten.
