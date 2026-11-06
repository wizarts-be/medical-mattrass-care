# Briefing nieuwe website Medical Mattress Care (v1)

Bijgewerkte briefing voor de nieuwe site in `mmc_v1/`. Ze bundelt de oorspronkelijke briefing (`briefing-origineel.md`, voor de productdata en sitestructuur), de antwoorden van de klant op de vragenlijst (`../info/Vragenlijst Medical Mattress Care (1).docx`) en de ontwerpkeuzes van v1. De oude poging in `mmc_structure/` wordt niet meer gebruikt.

## 1. De klant

- **Medical Mattress Care BV**, Puyveldestraat 8, 9170 Sint-Pauwels. Ondernemingsnummer 0875.860.609. Opgericht in 2005 door zaakvoerder Michel Marynissen.
- Telefoon 0473 59 11 71. E-mail info@medical-mattress-care.com (michel@medicalmattresscare.com is ook in gebruik).
- Michel zag na jaren in de schuimproductie dat hygiëne en kwaliteit in de zorg vaak te wensen overlieten. Met onderzoeksinstellingen ontwikkelde hij hygiënische, drukverlagende matrassen en hulpstukken.
- Doelgroep: woonzorgcentra, ziekenhuizen en andere zorginstellingen (aankoper, directie, hoofdverpleging, ergotherapeut, technische dienst). Concurrenten: Duvatex, Sampli, Euromousse.

## 2. Antwoorden vragenlijst (klant, november 2026)

| Vraag | Antwoord van de klant |
|---|---|
| Waarom kiezen klanten voor MMC? | Alles uit stock leverbaar en snelle service, scherpe prijzen en de hoogste kwaliteit op de markt. |
| Wie bezoekt de site, wat wil die eerst zien? | Al die diensten. Ze zoeken eerst op **product**, dan op **prijs/kwaliteit**, dan op **levertijd**. |
| Belangrijkste actie | **Offerte / prijs vragen.** |
| Producten in de kijker | **V10 matras, PUP 23 hoofdkussen, de dekbedden en de zitkussens** zijn de toppers. Doorstreepte producten uit de catalogus vallen weg. |
| Zoektermen | medische matras, visco matras, incontinentie matras, decubitus matras, drukverdelende matrassen (plus de vier toppers). |
| Gevoel (1 tot 10) | Medisch/klinisch ↔ warm/comfortabel: **9**. Technisch ↔ eenvoudig/toegankelijk: **10**. Gevestigde fabrikant ↔ persoonlijk familiebedrijf: **10**. |
| Referentiesites | Voorkeur **carvico.com** ("omdat we niet zoveel foto's hebben"). Eventueel nothing.eco en instituteofhealth.com (veel foto's). Mogelijk maken ze enkele foto's met AI. |
| Je of u | Niet ingevuld. Voorlopig **u**. |
| Vertrouwen (referenties, cijfers, certificaten) | Niet ingevuld. Geen namen, logo's of cijfers gebruikt. |

**Wat dit betekent voor de site**

- Product eerst: zoeken op naam of bestelcode staat in de navigatiebalk (zoals "Find fabric" bij Carvico), de homepage opent met een concreet product (MMC V10) en de productfinder per zorgvraag.
- Eén hoofdactie: **Offerte aanvragen**, op elke productpagina vooraf ingevuld met de bestelcode. Staal en technische fiche via hetzelfde formulier.
- Levertijd en prijs/kwaliteit als feiten: "Uit stock", "Scherp geprijsd" op de homepage.
- Warm en persoonlijk in plaats van klinisch: ecru papier, een klassieke serif voor titels, Michel bij naam, het telefoonnummer groot.
- Weinig foto's: de site draagt zich met typografie, lijnen en de productfoto's van de klant (zoals Carvico met tekst en materiaal).

## 3. Ontwerprichting (v3)

De eerste hero (volledig scherm, indigo stof, grote Fira Sans-titel) is de basis; die sfeer loopt door de hele site. B2B-overzichtelijk, maar met karakter.

- **Hero:** volledig scherm stofbeeld, "Matrassen voor de zorg", oranje offerteknop, ronde oranje sticker "Maatwerk mogelijk!". Navigatie transparant, wit bij scrollen.
- **Kleurritme:** diep indigo (USP-band onder de hero, hoes-paneel, footer), zacht lavendel (toppers, familiebedrijf), wit (assortiment, productinfo). Panelen met grote afronding lopen bijna tot de rand.
- **Stofbeeld als rode draad:** achter de paginakoppen van alle binnenpagina's en achter de offerteband.
- **Structuur home:** hero, waarom MMC (4 punten), toppers, MMC 210 PU-hoes, volledig assortiment als overzichtelijke lijst, familiebedrijf en certificaten, offerteband.
- **Typografie:** Fira Sans 400/500 (titels groot en strak), Fira Mono voor bestelcodes. Oranje voor de hoofdactie en de sticker.

## 4. Schrijfregels

- Zakelijk, feitelijk, warm. Feiten eerst: maten, samenstelling, densiteit, normen.
- Aanspreekvorm **u** (centraal te wijzigen in `site/src/i18n/nl.mjs` en de teksten in `site/build.mjs`).
- "de matras". "Medical Mattress Care BV". Productnamen "MMC" + naam. Bestelcodes exact zoals in de catalogus.
- Getallen met spatie en eenheid: 200 x 90 x 15 cm, 95 °C, 45 kg/m³.
- Uitroeptekens enkel op stickers. Geen gedachtestreepjes. Knoppen zijn acties.
- Nooit verzonnen cijfers, referenties of klantlogo's.

## 5. Sitestructuur (gebouwd)

- `/` home: hero met de MMC V10-offerte (breedte kiezen, offerte vooraf ingevuld), zorgvraag-index, toppers (PUP 23, Bicolor, R3DV 07, ZP 05), verhaal van Michel, de 210 PU-hoes, wat u mag verwachten, bellen.
- `/producten/` alle producten met zoeken en filter per toepassing.
- `/producten/<categorie>/` tien categorieën en `/producten/<categorie>/<product>/` 33 productpagina's.
- `/mmc-210-pu-hoes/`, `/maatwerk/`, `/hygiene-en-kwaliteit/`, `/over-mmc/`, `/offerte/`, `/contact/`, juridische pagina's, `/fr/` en `/en/` (in voorbereiding), 404.
- `sitemap.xml`, `robots.txt`, 301-redirects van de oude URL's (`_redirects` en `.htaccess`).

Productdata staat in `site/src/data/producten.mjs` (afkomstig uit de catalogus en de oorspronkelijke briefing, sectie 6). Open vragen staan in `OPEN-PUNTEN.md`.
