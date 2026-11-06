# Briefing: skelet nieuwe website Medical Mattress Care

Je bouwt het skelet van de nieuwe website van Medical Mattress Care (MMC) voor Wizarts. Lees deze briefing volledig voor je begint. Alles wat je over de klant moet weten, staat hierin of in de map `bronnen/`.

## 1. Opdracht

- Bouw een werkend skelet: alle pagina's, navigatie, sjablonen en de volledige productdata. De styling volgt de huidige huisstijl (sectie 4), maar het visuele ontwerp wordt later verfijnd. Structuur, inhoud en UX gaan nu voor op visuele afwerking.
- De site is B2B: zorginstellingen moeten snel het juiste product vinden, de specificaties zien en een offerte of staal aanvragen. Er is geen webshop en er zijn geen prijzen.
- Drietalig: Nederlands (hoofdtaal), Frans en Engels. Bouw nu alleen NL uit, maar zet de i18n-structuur klaar zodat FR en EN later enkel vertaalde tekst vragen.

### Technische keuzes

- **Astro** (statisch), zonder zwaar framework. Interactie (filters, mobiel menu, formulier) met kleine stukjes vanilla JS.
- Productdata als **content collections** (JSON of Markdown met frontmatter), één bestand per product. Pagina's worden uit die data gegenereerd. Niets hardcoden in sjablonen.
- i18n-routing: `/` (nl), `/fr/`, `/en/`. Alle interfaceteksten in een woordenboekbestand per taal.
- CSS met custom properties uit sectie 4 (`tokens.css`). Geen Tailwind.
- Formulieren: frontend-only met een duidelijke `TODO` voor de koppeling (later te beslissen).
- Toegankelijk (WCAG AA), responsive vanaf 360 px, snel (geen onnodige libraries), goede SEO-basis (title, meta description, Open Graph, hreflang, sitemap.xml, schema.org `Organization` en `Product`).

### Werkwijze

1. Lees eerst `bronnen/` (zie sectie 2) en deze briefing.
2. Maak een `CLAUDE.md` in de root met de kern van deze briefing (huisstijl, schrijfregels, structuur), zodat je die in latere sessies terugvindt.
3. Stel een korte planning op en bouw dan in deze volgorde: tokens en basislayout, header en footer, productdata, productpagina en categoriepagina, home, overige pagina's.
4. Controleer na elke stap met `npm run build` en bekijk de pagina's in de browser (desktop en mobiel).
5. Alles wat je moet aannemen, markeer je in de code met `<!-- AANNAME: ... -->` en verzamel je in `OPEN-PUNTEN.md`.

## 2. Bronnen in de map `bronnen/`

- `Medical-Mattres-Care.pdf`: de productcatalogus (24 p.), met handgeschreven correcties van de klant. Alle productdata in sectie 6 komt hieruit.
- `MMC_Brandboek.html`: het brandboek van de huidige huisstijl. Volg dit.
- `logo/`: logobestanden in svg (kleur, wit, icoon apart, woordmerk apart).
- `fotos/`: de productfoto's. Koppel ze aan de producten op basis van de bestandsnaam. Ontbreekt een foto, gebruik dan een neutrale placeholder met `AANNAME`.

De huidige website is https://medical-mattress-care.com (WordPress, NL/FR/EN). Haal daar indien nodig extra tekst op, maar de catalogus en deze briefing gaan voor. Veel van die site is verouderd (laatst bijgewerkt in 2020).

## 3. De klant

- **Medical Mattress Care BV**, Puyveldestraat 8, 9170 Sint-Pauwels (België). Ondernemingsnummer 0875.860.609. Opgericht in 2005 door zaakvoerder Michel Marynissen.
- Telefoon: 0473 59 11 71. E-mail: info@medical-mattress-care.com (voorlopig; michel@medicalmattresscare.com is ook in gebruik, zie open punten).
- **Verhaal:** Michel stelde na jaren in de productie en verkoop van schuim vast dat hygiëne en kwaliteit vaak te wensen overlieten. In samenwerking met onderzoeksinstellingen ontwikkelde hij matrassen en hulpstukken die hygiënisch, drukverlagend en comfortabel zijn, voor de zorg en voor thuis.
- **Doelgroep:** woon- en zorgcentra, ziekenhuizen en andere medische instellingen. Bezoekers zijn aankopers, directie, hoofdverpleging, ergotherapeuten en technische diensten. Particulieren kunnen bestellen, maar krijgen geen aandacht op de site.
- **Concurrenten:** Duvatex, Sampli, Euromousse.
- **Klanten komen vandaag via mond-tot-mondreclame.** De site moet professioneel overtuigen en vindbaar zijn.

### Sterktes (USP's) om in de verf te zetten

- De **MMC 210 PU-hoes**: MRSA-bestendig, wasbaar op 95 °C, steriliseerbaar tot 115 °C, brandnorm CRIB 5, Oeko-Tex standaard 100. Standaard op matrassen en hulpstukken, ook los te bestellen.
- **Maatwerk mogelijk**: matrassen en kussens in opbouw en maat naar wens.
- **Uit stock leverbaar**: bijna alle standaardproducten.
- **Hoge kwaliteit aan een scherpe prijs**, dankzij een lage kostenstructuur.
- **Vlaams bedrijf sinds 2005**, ontwikkeld met onderzoeksinstellingen.
- **ISO 14001**-gecertificeerd productiehuis, eigen groene stroom.
- **Fairsales**-gecertificeerd sinds 2016.
- **CNK-codes** voor de MMC Thuis matras (verkrijgbaar via het apotheekkanaal).

## 4. Huisstijl

Volg `bronnen/MMC_Brandboek.html`. Samengevat:

### Kleuren (tokens)

| Token | Waarde | Gebruik |
|---|---|---|
| `--indigo` | #352C57 | Dragende kleur: header, vlakken, primaire knoppen, icoon |
| `--oranje` | #E68626 | Accent: lijnen, actief menu-item, stickers, details |
| `--ink` | #191919 | Titels |
| `--tekst` | #333333 | Lopende tekst op wit |
| `--tekst-zacht` | #707070 | Bijschriften, footer (niet lichter dan dit) |
| `--surface-grijs` | #F2F2F2 | Alternerende secties, kaarten |
| `--wit` | #FFFFFF | Achtergrond |

- Oranje nooit als tekstkleur op wit en nooit witte tekst op oranje (contrast 2,7:1). Oranje tekst kan wel op indigo.
- Er zijn drie tinten oranje in omloop; gebruik enkel #E68626.

### Typografie

- **Fira Sans** (Google Fonts), gewicht 400 voor titels en tekst. Gebruik 500 enkel waar nodig voor knoppen of labels. Titels zijn niet vet.
- Titels in sentence case, nooit in hoofdletters of title case (bovenschriften/eyebrows met letter-spacing mogen in kapitalen).

### Vormtaal

- Rechte vlakken en balken, rechte hoeken voor blokken, foto's en tabellen (`border-radius: 0`).
- Onder sectietitels een korte oranje lijn.
- Rond is alleen voor stickers (zoals "Maatwerk mogelijk!").
- Productfoto's op lichtgrijs, zakelijk. Het droomachtige key visual (vrouw op een wolk) is de oude campagne: niet gebruiken als hero.

### Logo

- Het logo bestaat uit het matrasicoon en het woordmerk MMC met baseline "Medical Mattress Care BV". Beide delen mogen apart gebruikt worden.
- Op wit: de kleurversie. Op indigo: de witte versie (wit icoon en baseline, oranje MMC).
- Gebruik altijd de svg-bestanden. Nooit natekenen, vervormen of hervormen.

## 5. Schrijfregels

- Zakelijk, feitelijk en duidelijk. Feiten eerst: maten, samenstelling, densiteit, normen.
- Aanspreekvorm: **"u"** (kleine letter), tot MMC dat bevestigt. Houd alle aanspreking in teksten centraal en consequent, want ze kan naar "je" veranderen. Zet dit in `OPEN-PUNTEN.md`.
- Getallen met eenheid en spatie: "200 x 90 x 15 cm", "wasbaar op 95 °C", "45 kg/m³".
- Productnamen: "MMC" + naam ("MMC Flex", "MMC Thuis matras"). Bestelcodes exact zoals in de catalogus ("MMC CK 01", "MMCP AK 01A").
- "de matras", niet "het matras". "Medical Mattress Care BV", niet "bvba" en niet "Mattrass".
- Uitroeptekens enkel op stickers ("Maatwerk mogelijk!").
- Geen gedachtestreepjes (em dashes), geen "geen X, wel Y"-constructies, geen komma voor "en", geen opvulling.
- Knoppen zijn acties: "Offerte aanvragen", "Staal aanvragen", "Technische fiche".

## 6. Productdata

Maak voor elk product een databestand met minstens: `code`, `naam`, `categorie`, `toepassingen` (lijst, zie 7), `korteOmschrijving`, `omschrijving`, `specs` (sleutel-waarde), `hoes`, `varianten` (maten of kleuren), `afbeelding`, `maatwerk` (true/false), `status` (`actief`, `te-bevestigen`, `uit-gamma`). Producten met status `uit-gamma` neem je niet op in de site. Producten met `te-bevestigen` komen wel online, met een `AANNAME`-markering.

Afkortingen: CMHR = brandvertragend koudschuim (combustion modified high resilience). Het getal is de densiteit in kg/m³ (CMHR 40 = 40 kg/m³). Visco = traagschuim.

### 6.1 Matrassen

Alle matrassen worden standaard geleverd met de MMC 210 PU-hoes. Maatwerk is mogelijk: "Zit uw matras er niet bij? Geen probleem, MMC levert matrassen in opbouw en maat naar uw wens."

| Code | Afmeting | Samenstelling | Status |
|---|---|---|---|
| MMC V10 A | 200 x 90 x 15 cm | 10 cm CMHR 40 + 5 cm Visco 50 | actief |
| MMC V10 B | 200 x 140 x 15 cm | 10 cm CMHR 40 + 5 cm Visco 50 | actief |
| MMC V10 C | 200 x 160 x 15 cm | 10 cm CMHR 40 + 5 cm Visco 50 | actief |
| MMC V10 D | 200 x 180 x 15 cm | 10 cm CMHR 40 + 5 cm Visco 50 | actief |
| MMC V11 A | 200 x 90 x 15 cm | 10 cm CMHR 50 + 5 cm Visco 65 | uit-gamma |
| MMC V12 A | 200 x 90 x 14 cm | 10 cm CMHR 50 + 4 cm Visco 85 | actief |
| Politiecelmatras | 195 x 90 x 12 cm | 12 cm CMHR 35, dichtgestikt | actief |
| MMC Flex | 200 x 90 x 17 cm | 17 cm CMHR 70 | actief |
| MMC S08 A | 200 x 90 x 15 cm | 15 cm CMHR 35 | actief |
| MMC S09 A | 200 x 90 x 15 cm | 15 cm CMHR 40 | actief |
| MMC S10 A | 200 x 90 x 15 cm | 15 cm CMHR 50 | actief |
| MMC S11 A | 200 x 90 x 15 cm | 15 cm CMHR 65 | actief |

Groepeer V10 A tot D als één product (MMC V10) met vier breedtes.

**MMC Flex** (bestelcode MMC FLEX): de drukverdelende matras. Gemaakt uit hoogwaardig schuimrubber CMHR 70, essentieel voor een extra duurzame matras, uitvoerig getest op een veilige en duurzame werking. Gesneden in een uniek wafelprofiel om het contactoppervlak met het lichaam te optimaliseren. Luchtkanalen gaan ophoping van warmte en vocht tegen. Zones volgens de anatomische verdeling van het lichaam verdelen de druk zo gelijk mogelijk, vooral bij uitstekende lichaamsdelen. Langs 4 zijden omkeerbaar, wat de levensduur verhoogt. Specs: 200 x 90 x 17 cm (andere maten op aanvraag), volledig CMHR 70, vrij van CFK's, geen chloorfluorwaterstoffen, 100% latexvrij, 100% open celstructuur, zeer elastisch en buigzaam, brandvrij CRIB 5.

**MMC Thuis matras**: ca. 22 cm dik, luxe visco matras met volledig afritsbare hoes. Zachte wasbare dubbeldoekhoes met 3D-ventilatiestrook voor optimale verluchting. Antibacterieel (allergiearm), drukverlagend, zeer ademend, voor alle gewichten, opgerold geleverd. Maten en CNK-codes:

| Afmeting | CNK-code |
|---|---|
| 200 x 80 cm | 3083169 |
| 200 x 90 cm | 3058260 |
| 200 x 100 cm | 3083177 |
| 200 x 140 cm | 3083185 |
| 200 x 160 cm | 3083193 |
| 200 x 180 cm | 3083201 |

### 6.2 MMC 210 PU-hoes

Eigen pagina én component dat op elke productpagina met deze hoes terugkomt. Hoezen zijn ook los te bestellen. Polyurethaan op een bi-elastisch weefsel, rits in dezelfde kleur als de hoes.

Eigenschappen: bi-elastisch weefsel, ondoordringbaar voor water en urine, ademend, wasbaar op 95 °C, volledig wasbaar met de ontsmettingsproducten uit de zorgsector, brandnorm CRIB 5, Oeko-Tex standaard 100, geen naden in de ligvlakken, gemakkelijk afritsbaar (L-sluiting), bacterie- en schimmelresistent, steriliseerbaar tot 115 °C, MRSA-bestendig, verborgen ritssluiting.

Technische fiche (toon als tabel):

| Eigenschap | Norm | Waarde |
|---|---|---|
| Stof | | 100% polyester, 100 g/m² |
| Coating | | 100% polyurethaan, 100 g/m² |
| Totaal gewicht | | 200 g/m² (± 10 g/m²) |
| Treksterkte | EN ISO 1421 | ketting > 30 daN/5 cm, inslag > 25 daN/5 cm |
| Rek | EN ISO 1421 | ketting > 110%, inslag > 150% |
| Waterkolom | ISO 1420 | > 200 cm |
| Hydrolyse | Jungle test, 3 weken | geen kwaliteitsverlies |
| Brandwerend | BS 7175, Crib 5 | Centexbel 58974/B |
| Schimmelwerend | ASTM G 21-96 | resistent |
| Antibacterieel | ATCC #6538 (Staphylococcus aureus) | resistent |
| Waterdampdoorlaatbaarheid | ASTM G 96-66 | 600 g/m² per 24 u bij 32 °C |
| Krimp bij wassen op 95 °C | ISO 5077 | max. 5% |
| Bestand tegen ontsmetting | | gedenatureerde alcohol (90% alcohol + 2% ether), Fugaten spray (ethanol 70%), oliën 7 g/l (5 min contact), H.A.C., Reocid, Dettol, Lyorthol, Indur Des, Prespect, Hycolin, Clearsol |

Onderhoudssymbolen: wasbaar op 95 °C, niet bleken, niet strijken, enkel reinigen met producten met klasse A-label, droogkast tot niveau 1.

### 6.3 Positioneringshulpstukken visco

Allemaal met MMC 210 PU-hoes. "Gesneden" = uit een blok gesneden; "gegoten" = in de mal gegoten.

| Code | Naam | Omschrijving | Maat | Densiteit |
|---|---|---|---|---|
| MMC CK 01 | MMC cilinder klein | gesneden viscoschuim | 50 x 10 cm | 45 kg/m³ |
| MMC CG 02 | MMC cilinder groot | viscoschuim | 50 x 20 cm | 50 kg/m³ |
| MMC HR 03 | MMC half rond | viscoschuim, vorm in de mal gegoten | 50 x 20 x 10 cm | 45 kg/m³ |
| MMC HP 04 | MMC hielpositionering | gevuld met holle gesiliconiseerde polyestervezel (geen visco), drukverlagend, sluiting met klittenband | | |
| MMC ZP 05 | MMC zitpositionering | zitkussen uit gesneden viscoschuim, anti-sliplaag onderaan, ideaal als relaxzitkussen | 43 x 43 x 7 cm | 50 kg/m³ |
| MMC PK 08 | MMC peluwkussen | gesneden viscoschuim, aflopend van 8 naar 2 cm | 40 x 40 x 8 cm | 45 kg/m³ |

Maatwerk mogelijk.

### 6.4 Beschermingshulpstukken

| Code | Naam | Omschrijving | Maat |
|---|---|---|---|
| MMC OB 09 | MMC onrusthekkenbeschermer | hoes MMC 120 PU: zelfde kwaliteit als 210 PU maar lichter, omdat de hoes minder te lijden heeft | 200 x 70 cm |
| MMC FO 10 | MMC fall out matras | om naast het bed te leggen als iemand uit bed valt; ook bruikbaar bij evacuatie (patiënt wordt op de matras verplaatst). 7 cm CMHR 25 (brandvertragend), 210 PU-hoes, 3 delen | 3 x 60 x 60 cm |
| MMC P3 11 | MMC positioneringsdriehoek | twee driehoeken, CMHR 25, 210 PU-hoes; voorkomt dat mensen uit bed rollen zonder hen te veel te remmen in hun beweging | 20 x 20 x 90 cm |
| MMC SW 12 | MMC side wedges | driehoeken vastgezet met klittenband, banden onder de matras door; los trekken is niet mogelijk als men op bed ligt. CMHR 25, 210 PU-hoes | 20 x 20 x 90 cm |

### 6.5 Positioneringszitkussen

**MMC R3DV 07, rolstoelkussen uit viscoschuim.** Gegoten (gemouleerd) Visco 60: brandvertragend, densiteit 60 kg/m³. Anatomische vorm met ingebouwde abductieheuvel (verhoging) vooraan: helpt rechtop zitten en houdt dijen en knieën uit elkaar. Rasterpatroon verbetert de luchtcirculatie en vermindert schuifkrachten. Gietvorm geeft een driedimensionale vorm; de afgeronde blokjes leiden de druk weg van de drukpunten. Comfortabele, stabiele zitpositie en helpt decubitus te voorkomen. Hoes: MMC 210 PU, antibacterieel, MRSA-bestendig, met watergordijn tegen indringing van water en vocht.

### 6.6 Positioneringshulpstukken polystyreen (bolletjes)

Vulling van brandvertragende polystyreenbolletjes die zich naar het lichaamsdeel vormen: volledige en constante ondersteuning, werkt anti-decubitus. Hoes MMC 210 PU (MRSA-resistent). Bij elk kussen is een badstofhoes apart te bestellen (code eindigt op B).

| Code | Naam | Toepassing | Maat | Badstofhoes |
|---|---|---|---|---|
| MMCP AK 01A | MMC abductie knie (halve boog) | ondersteuning van de knie | 65 x 35 cm | MMCP AK 01B |
| MMCP ABP 02A | MMC arm/been positionering | ondersteuning van arm of been | 39 x 21 cm | MMCP ABP 02B |
| MMCP UK 03A | MMC universeel klein | algemene ondersteuning | 40 x 28,5/25,5 cm | MMCP UK 03B |
| MMCP UG 04A | MMC universeel groot | algemene ondersteuning | 68 x 42/36 cm | MMCP UG 04B |
| MMCP PS 05A | MMC positionering slang | ondersteuning van de benen | 179 x 34 cm | MMCP PS 05B |
| MMCP UP 06A | MMC U-pillow | ondersteuning van nek en schouders | 161 x 80 cm | MMCP UP 06B |
| MMCP CG 07A | MMC cilinder groot | knie of voet bij ruglig | 50 x 20 cm | MMCP CG 07B |

### 6.7 Hoofdkussens

Alle kussens worden individueel verpakt geleverd.

**Holle vezel** (maatwerk mogelijk):

- **MMC PUP 23, MMC hoofdkussen (60 x 60 cm)**, 700 g. Soepele, zijdezacht aanvoelende hoes uit MMC 120 PU (polyurethaan op bi-elastisch weefsel), afneembaar en apart wasbaar dankzij een binnenhoes. Vulling: gesiliconiseerde polyester holle vezel die zo dicht mogelijk aanleunt bij natuurlijk dons; uiterst dunne vezels met flinterdunne kanaaltjes in de kern bootsen het isolerende effect van dons na.
- **MMC PUP 23 SOP, MMC hoofdkussen SOP (60 x 60 cm)**, 700 g. Idem PUP 23, maar volledig dichtgestikt.
- MMC PUP 23 Seal: uit-gamma.

**Visco** (zachte hoes van velours, behandeld tegen huismijt, hypoallergeen, afneembaar en wasbaar):

- **MMC NSP 17, MMC neck support kussen.** Ontworpen met specialisten, vormt zich naar nek en hoofd zodat de spieren van nek en schouders ontlast en ondersteund worden. 5 stuks per doos.
- **MMC CP 18, MMC classic kussen.** Traditionele vorm, drukverlagend en comfortverhogend, steunkussen dat iets zachter aanvoelt, geschikt voor alle slaaphoudingen. 5 stuks per doos.
- **MMC TVP 24, MMC tv- en reiskussen.** Drukverlagende ondersteuning tijdens het reizen of tv-kijken, laat de nekspieren ontspannen. Hoes voorzien van sluiting. Aantal per doos: AANNAME, te bevestigen (de catalogus vermeldt 30, maar die regel is doorstreept).

### 6.8 Dekbedden

**MMC Bicolor (bestelcode MMC DB 2C met flap).** Comfort, afwerking en huiselijke warmte, langs beide zijden bruikbaar dankzij de twee kleuren. Stof 100% polyester microfiber, horizontaal gestikt samen met de vulling. Vulling 300 g/m² soft Neotherm holle gesiliconiseerde vezel, die zo dicht mogelijk aanleunt bij natuurlijk dons; blijvend elastisch, soepel, licht en veerkrachtig. Gaat 8 jaar mee bij normaal gebruik.

- Afmeting 220 x 150 cm, stof 85 g/m², vulling 300 g/m²
- Kleuren: navy blauw / grijs, kastanjebruin / beige, bordeaux / grijs, azur / hemelsblauw, en een vijfde combinatie (AANNAME: naam te bevestigen, op de foto donkerbruin / beige)
- Wasbaar op 40 °C, niet bleken, droogkuis (P)
- Brandveilig EN ISO 12952:2010 (sigarettentest)
- Individueel verpakt, 8 stuks per kleur per doos

**MMC baby dekbed.** 120 x 80 cm, stof 85 g/m², vulling 150 g/m², baby rose of baby blue, minimale afname 200 stuks per kleur. Wasvoorschriften als MMC Bicolor.

MMC Bicolor Premium: uit-gamma.

### 6.9 Hoes- en onderleglakens

- **MMC hoeslaken (bestelcode MMC HOESLAKEN).** Gebreid hoeslaken voor de zorg. Door één persoon op te leggen, dus minder arbeidsintensief. De rek zit in de lengte van de stof, zodat het laken strak blijft zitten, ook als het bed omhoog staat: geen plooien, preventief tegen decubitus. 350 keer wasbaar zonder kwaliteitsverlies, hoeft nooit gestreken. Specs: gebreide stof, 100% polyester, 150 g/m², bi-elastisch, hoeken afgewerkt met elastische polyester twill tape voor extra stevigheid, brandvrij.
- **MMC Incopad met flap (bestelcode MMC Incopad Flap).** Wasbare onderlegger die de persoon droog en comfortabel houdt. Drie lagen: onderste laag ondoordringbaar, bovenlaag uiterst zacht polyester voor een super droog gevoel. Opvangcapaciteit maximaal 3 liter. Absorbeert pas goed na de eerste wasbeurt.
- MMC wegwerplaken, MMC Incopad onderlegger (zonder flap), MMC Slide glijlaken: uit-gamma.
- **MMC AT cover, anti-transpiratiehoes**: te-bevestigen (doorstreept op p. 19, niet doorstreept op p. 20). Volledig open 3D-honingraatstructuur met gelamineerd breiwerk waar lucht vrij circuleert; vermindert zweten, veilig tegen verstikking voor baby's en volwassenen. Stof polykatoen met honingraattextuur, elastiek voor bevestiging, wasbaar op 40 °C. Maten 200 x 90, 200 x 140, 200 x 160, 200 x 180 cm.

### 6.10 Kinderen

- **MMC BWK 13, MMC babywaskussen** (verzorgingskussen). HR 25: schuim met densiteit 25 kg/m³, brandvertragend. MMC 210 PU-hoes, eenvoudig af te ritsen dankzij de L-sluiting, dus gemakkelijk wasbaar.
- **MMC KM14, MMC kindermatras.** HR 25, brandvertragend, MMC 210 PU-hoes met L-sluiting. 120 x 60 x 8 cm. Maatwerk mogelijk.

### 6.11 Niet opnemen in het skelet

- Boxsprings: uit-gamma.
- Coronaproducten (mondmaskers, wasbare schorten, capuchons, overmouwen, overalls): te-bevestigen, niet in de navigatie.
- MMC Meubelen (elektrische bedden, nachtkastjes, zetels en stoelen, kleerkasten, tafels): te-bevestigen, niet in de navigatie. Zet in `OPEN-PUNTEN.md`.
- Normocare (normobare kamer): te-bevestigen, niet in de navigatie.

## 7. Sitestructuur

### Toepassingen (voor de productkiezer en filters)

Elk product krijgt een of meer toepassingen. Zo vindt een zorgverlener het product vanuit zijn probleem in plaats van uit de catalogusindeling:

- Drukverlaging en decubituspreventie
- Positionering in bed
- Zitten en rolstoel
- Valpreventie en bescherming
- Hygiëne en incontinentie
- Slaapcomfort (kussens, dekbedden)
- Kinderen en baby's

### Pagina's

- **Home**
  - Hero: kernboodschap (AANNAME: "Hygiënische, drukverlagende matrassen en hulpstukken voor de zorg") met de knoppen "Offerte aanvragen" en "Bekijk producten"
  - Productkiezer per toepassing
  - Uitgelichte producten: MMC Flex, MMC V10, MMC 210 PU-hoes, MMC R3DV 07 (AANNAME)
  - USP-blok (sectie 3)
  - Maatwerk ("Maatwerk mogelijk!")
  - Vertrouwen: ISO 14001, Fairsales, sinds 2005, plaats voor referenties van instellingen (placeholder)
  - Afsluitende CTA
- **Producten**: overzicht per categorie, filterbaar op toepassing.
- **Categoriepagina**: matrassen, positioneringshulpstukken visco, positioneringshulpstukken polystyreen, positioneringszitkussen, beschermingshulpstukken, hoofdkussens, dekbedden, lakens en onderleggers, kinderen, hoezen.
- **Productpagina** (sjabloon): foto, naam, bestelcode, korte omschrijving, specificatietabel, varianten (maten of kleuren als tabel), hoesblok (210 PU, met link), badstofhoes-optie waar van toepassing, "Maatwerk mogelijk"-sticker waar van toepassing, CTA's "Offerte aanvragen" en "Staal aanvragen" (product vooraf ingevuld in het formulier), knop "Technische fiche" (placeholder pdf), gerelateerde producten (zelfde toepassing).
- **MMC 210 PU-hoes**: eigen pagina met eigenschappen, technische fiche en onderhoudssymbolen.
- **Maatwerk**: wat kan op maat, hoe vraag je het aan.
- **Hygiëne en kwaliteit**: de hoes, labo en certificaten (ISO 14001, Fairsales, Centexbel), onderhoudstips uit de catalogus (zie 7.1).
- **Over MMC**: verhaal van Michel, sinds 2005, Vlaams, onderzoeksinstellingen, groene stroom.
- **Offerte of staal aanvragen**: formulier met instelling, contactpersoon, functie, e-mail, telefoon, producten (meerdere, met aantal), maatwerk-ja/nee, opmerking, keuze offerte of staal.
- **Contact**: gegevens, kaart (placeholder), formulier.
- **Juridisch**: disclaimer, privacybeleid, cookiebeleid (placeholdertekst).

Header: logo, Producten (mega-menu per categorie en per toepassing), Maatwerk, Hygiëne en kwaliteit, Over MMC, Contact, taalkeuze NL/FR/EN, knop "Offerte aanvragen". Footer: contactgegevens, ondernemingsnummer, productcategorieën, certificaatlogo's, juridische links.

URL's in het Nederlands, kort en leesbaar: `/producten/matrassen/mmc-flex/`. Zet 301-redirects klaar voor de oude URL's (`/matrassen-flex/`, `/matrassen-210pu-hoes/`, `/mmc-thuis-matras/`, `/hoofdkussens-holle-vezel/`, `/hoofdkussens-visco/`, `/beschermingshulpstukken/`, `/positioneringszitkussen/`, `/positionering-visco/`, `/positioneringshulpstukken-ps/`, `/dekbedden/`, `/mmc-bicolor/`, `/mmc-baby-dekbed/`, `/hoes-wegwerplakens/`, `/hoes-baby-kinder/`, `/labo-en-certificaten/`, `/contact/`) in een `redirects`-config.

### 7.1 Onderhoudstips (uit de catalogus, voor "Hygiëne en kwaliteit")

- **Ventileren en verwarmen:** droge lucht betekent minder mijten. Ideaal is 20 °C, met dag- en nachttemperatuur hooguit 2 graden verschil.
- **Wassen:** regelmatig en boven 60 °C om de huisstofmijt te doden. De technische fiche van de 210 PU-hoes vermeldt de geschikte reinigings- en ontsmettingsmiddelen.
- **Schoonmaak:** dagelijks schoonmaken van de kamer beperkt huisstofmijt. Regelmatig vochtig afstoffen, stofzuigen en dweilen. Vermijd vloerkleden en stoffen meubilair.

## 8. Open punten (overnemen in `OPEN-PUNTEN.md`)

- Aanspreekvorm: je of u (voorlopig u).
- Kernboodschap van de homepage en het belangrijkste onderscheid tegenover Duvatex, Sampli en Euromousse.
- Welke producten uitgelicht worden en op welke zoektermen MMC gevonden wil worden.
- Belangrijkste actie: offerte, staal of telefoon.
- Gevoel van de site: klinisch of warm, technisch of toegankelijk.
- Referenties van instellingen (namen en logo's) en indrukwekkende cijfers.
- Status van coronaproducten, MMC Meubelen, Normocare en de AT cover.
- Vijfde kleurcombinatie MMC Bicolor; aantal per doos MMC TVP 24.
- E-mailadres op de site.
- Koppeling van de formulieren.
- Technische fiches als pdf per product.
- Vertalingen FR en EN.
