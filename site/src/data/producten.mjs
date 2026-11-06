// Productdata Medical Mattress Care, uit de catalogus (24 p., met correcties van de klant) en de briefing.
// Eén object per product. Pagina's worden hieruit gegenereerd door build.mjs.
// status: 'actief' | 'te-bevestigen' | 'uit-gamma' (uit-gamma wordt niet gebouwd).
// hoes: '210' (MMC 210 PU-hoes) | '120' (MMC 120 PU) | 'velours' | 'dubbeldoek' | null

const PU210 = '210';

export const producten = [
  // ───────── Matrassen ─────────
  {
    slug: 'mmc-v10', code: 'MMC V10', naam: 'MMC V10', categorie: 'matrassen', status: 'actief', uitgelicht: true,
    toepassingen: ['druk', 'hygiene'],
    kort: 'Visco matras in vier breedtes: 10 cm koudschuim onder 5 cm traagschuim.',
    omschrijving: [
      'De MMC V10 is een van onze toppers. Een kern van 10 cm brandvertragend koudschuim (CMHR 40) draagt een toplaag van 5 cm traagschuim (Visco 50), die zich naar het lichaam vormt en de druk spreidt.',
      'De matras komt standaard in de MMC 210 PU-hoes en is geregistreerd als medisch hulpmiddel klasse I volgens de Europese verordening (EU) 2017/745.',
    ],
    specs: [['Opbouw', '10 cm CMHR 40 + 5 cm Visco 50'], ['Dikte', '15 cm'], ['Hoes', 'MMC 210 PU-hoes'], ['Classificatie', 'Medisch hulpmiddel klasse I (MDR)'], ['Norm', 'EN 12182']],
    varianten: { kolommen: ['Bestelcode', 'Afmeting'], rijen: [['MMC V10 A', '200 x 90 x 15 cm'], ['MMC V10 B', '200 x 140 x 15 cm'], ['MMC V10 C', '200 x 160 x 15 cm'], ['MMC V10 D', '200 x 180 x 15 cm']] },
    hoes: PU210, maatwerk: true,
    foto: 'mmc-v10.jpg', fotoAlt: 'MMC V10 met de MMC 210 PU-hoes half opengeritst, het traagschuim zichtbaar',
    documenten: [{ label: 'EU-conformiteitsverklaring', href: '/docs/mmc-v10-eu-conformiteitsverklaring.pdf' }],
  },
  {
    slug: 'mmc-v12', code: 'MMC V12 A', naam: 'MMC V12', categorie: 'matrassen', status: 'actief',
    toepassingen: ['druk'],
    kort: 'Stevigere visco matras: 10 cm CMHR 50 met 4 cm Visco 85.',
    omschrijving: [
      'De MMC V12 combineert een stevige kern van koudschuim CMHR 50 met 4 cm zeer dicht traagschuim (Visco 85). Een keuze voor wie meer steun en een langere levensduur vraagt.',
    ],
    specs: [['Opbouw', '10 cm CMHR 50 + 4 cm Visco 85'], ['Afmeting', '200 x 90 x 14 cm'], ['Hoes', 'MMC 210 PU-hoes']],
    varianten: null, hoes: PU210, maatwerk: true,
    foto: 'mmc-pu-hoes-rits.jpg', fotoAlt: 'Matras in de MMC 210 PU-hoes met verborgen rits', fotoIsHoes: true,
  },
  {
    slug: 'mmc-flex', code: 'MMC FLEX', naam: 'MMC Flex', categorie: 'matrassen', status: 'actief', uitgelicht: true,
    toepassingen: ['druk'],
    kort: 'Drukverdelende matras in wafelprofiel, volledig uit CMHR 70.',
    omschrijving: [
      'Hoogwaardig schuimrubber CMHR 70, gesneden in een uniek wafelprofiel. Zones volgens de anatomie van het lichaam spreiden de druk, luchtkanalen voeren warmte en vocht af.',
      'Langs vier zijden omkeerbaar, dus een langere levensduur.',
    ],
    specs: [['Afmeting', '200 x 90 x 17 cm, andere maten op aanvraag'], ['Schuim', 'volledig CMHR 70'], ['Celstructuur', '100% open cel, zeer elastisch en buigzaam'], ['Samenstelling', 'vrij van CFK’s en chloorfluorwaterstoffen, 100% latexvrij'], ['Brandveiligheid', 'CRIB 5'], ['Hoes', 'MMC 210 PU-hoes']],
    varianten: null, hoes: PU210, maatwerk: true,
    foto: 'mmc-flex-wafelprofiel.jpg', fotoAlt: 'Twee lagen schuim van de MMC Flex met het wafelprofiel en de luchtkanalen',
  },
  {
    slug: 'mmc-thuis-matras', code: null, naam: 'MMC Thuis matras', categorie: 'matrassen', status: 'actief',
    toepassingen: ['druk', 'slaap'],
    kort: 'Luxe visco matras van ca. 22 cm, met CNK-code via de apotheek.',
    omschrijving: [
      'De MMC Thuis matras brengt het comfort van de zorgmatras naar huis. Een luxe visco matras van ongeveer 22 cm, met een zachte, volledig afritsbare dubbeldoekhoes en een 3D-ventilatiestrook voor optimale verluchting.',
      'De matras wordt opgerold geleverd en is verkrijgbaar via het apotheekkanaal met een eigen CNK-code per maat.',
    ],
    specs: [['Dikte', 'ca. 22 cm'], ['Kern', 'visco (traagschuim)'], ['Hoes', 'wasbare dubbeldoekhoes met 3D-ventilatiestrook, volledig afritsbaar'], ['Eigenschappen', 'antibacterieel en allergiearm, drukverlagend, zeer ademend, voor alle gewichten'], ['Levering', 'opgerold']],
    varianten: { kolommen: ['Afmeting', 'CNK-code'], rijen: [['200 x 80 cm', '3083169'], ['200 x 90 cm', '3058260'], ['200 x 100 cm', '3083177'], ['200 x 140 cm', '3083185'], ['200 x 160 cm', '3083193'], ['200 x 180 cm', '3083201']] },
    hoes: 'dubbeldoek', maatwerk: false,
    foto: 'mmc-thuis-matras.jpg', fotoAlt: 'MMC Thuis matras met gewatteerde dubbeldoekhoes en ventilatiestrook',
  },
  {
    slug: 'mmc-s-reeks', code: 'MMC S08 A tot S11 A', naam: 'MMC S-reeks', categorie: 'matrassen', status: 'actief',
    toepassingen: ['hygiene', 'slaap'],
    kort: 'Koudschuim matras van 15 cm, in vier densiteiten.',
    omschrijving: [
      'De matrassen van de S-reeks bestaan uit één blok brandvertragend koudschuim van 15 cm. U kiest de densiteit naar het gebruik: hoe hoger het getal, hoe steviger en duurzamer het schuim.',
    ],
    specs: [['Afmeting', '200 x 90 x 15 cm'], ['Schuim', 'CMHR, brandvertragend koudschuim'], ['Hoes', 'MMC 210 PU-hoes']],
    varianten: { kolommen: ['Bestelcode', 'Samenstelling'], rijen: [['MMC S08 A', '15 cm CMHR 35'], ['MMC S09 A', '15 cm CMHR 40'], ['MMC S10 A', '15 cm CMHR 50'], ['MMC S11 A', '15 cm CMHR 65']] },
    hoes: PU210, maatwerk: true,
    foto: 'mmc-pu-hoes-flap.jpg', fotoAlt: 'Hoek van een matras in de MMC 210 PU-hoes', fotoIsHoes: true,
  },
  {
    slug: 'politiecelmatras', code: null, naam: 'MMC Politiecelmatras', categorie: 'matrassen', status: 'actief',
    toepassingen: ['hygiene', 'val'],
    kort: 'Dichtgestikte matras van 12 cm CMHR 35, voor cellen en crisisruimtes.',
    omschrijving: [
      'Een robuuste matras van 12 cm brandvertragend koudschuim, volledig dichtgestikt in de hoes. Zonder rits, zodat er niets te openen valt en de matras snel te reinigen is.',
    ],
    specs: [['Afmeting', '195 x 90 x 12 cm'], ['Schuim', '12 cm CMHR 35'], ['Afwerking', 'dichtgestikt']],
    varianten: null, hoes: PU210, maatwerk: true,
    foto: 'mmc-pu-hoes-rits.jpg', fotoAlt: 'Detail van de MMC 210 PU-hoes', fotoIsHoes: true,
    aanname: 'Bestelcode en exacte hoesuitvoering van de politiecelmatras te bevestigen.',
  },

  // ───────── Positioneringshulpstukken visco ─────────
  {
    slug: 'mmc-ck-01', code: 'MMC CK 01', naam: 'MMC cilinder klein', categorie: 'positionering-visco', status: 'actief',
    toepassingen: ['positionering', 'druk'],
    kort: 'Kleine cilinder uit gesneden viscoschuim, 50 x 10 cm.',
    omschrijving: ['Een kleine steunrol uit gesneden viscoschuim, om enkels, knieën of de nek te ondersteunen en drukpunten te ontlasten.'],
    specs: [['Maat', '50 x 10 cm'], ['Schuim', 'gesneden viscoschuim'], ['Densiteit', '45 kg/m³']],
    hoes: PU210, maatwerk: true, foto: 'mmc-ck-01.jpg', fotoAlt: 'MMC cilinder klein in donkere PU-hoes',
  },
  {
    slug: 'mmc-cg-02', code: 'MMC CG 02', naam: 'MMC cilinder groot', categorie: 'positionering-visco', status: 'actief',
    toepassingen: ['positionering', 'druk'],
    kort: 'Grote cilinder uit viscoschuim, 50 x 20 cm.',
    omschrijving: ['Een grote steunrol uit viscoschuim, voor de knieholte of onder de onderbenen bij ruglig.'],
    specs: [['Maat', '50 x 20 cm'], ['Schuim', 'viscoschuim'], ['Densiteit', '50 kg/m³']],
    hoes: PU210, maatwerk: true, foto: 'mmc-cg-02.jpg', fotoAlt: 'MMC cilinder groot in donkere PU-hoes',
  },
  {
    slug: 'mmc-hr-03', code: 'MMC HR 03', naam: 'MMC half rond', categorie: 'positionering-visco', status: 'actief',
    toepassingen: ['positionering', 'druk'],
    kort: 'Halfronde steun uit in de mal gegoten viscoschuim.',
    omschrijving: ['Een halfronde steun met een vlakke onderkant, zodat hij stabiel blijft liggen. Het viscoschuim is in de mal gegoten.'],
    specs: [['Maat', '50 x 20 x 10 cm'], ['Schuim', 'viscoschuim, in de mal gegoten'], ['Densiteit', '45 kg/m³']],
    hoes: PU210, maatwerk: true, foto: 'mmc-hr-03.jpg', fotoAlt: 'MMC half rond in donkere PU-hoes',
  },
  {
    slug: 'mmc-hp-04', code: 'MMC HP 04', naam: 'MMC hielpositionering', categorie: 'positionering-visco', status: 'actief',
    toepassingen: ['druk', 'positionering'],
    kort: 'Hielbeschermer met holle vezel en klittenbandsluiting.',
    omschrijving: ['Houdt de hiel vrij van de matras en verlaagt zo de druk op een van de meest kwetsbare plekken. Gevuld met holle gesiliconiseerde polyestervezel, gesloten met klittenband.'],
    specs: [['Vulling', 'holle gesiliconiseerde polyestervezel'], ['Sluiting', 'klittenband']],
    hoes: PU210, maatwerk: true, foto: 'mmc-hp-04.jpg', fotoAlt: 'MMC hielpositionering, blauw, met klittenband',
  },
  {
    slug: 'mmc-zp-05', code: 'MMC ZP 05', naam: 'MMC zitpositionering', categorie: 'positionering-visco', status: 'actief', uitgelicht: true,
    toepassingen: ['zitten', 'druk'],
    kort: 'Zitkussen uit viscoschuim met anti-sliplaag, 43 x 43 x 7 cm.',
    omschrijving: ['Een zitkussen uit gesneden viscoschuim met een anti-sliplaag aan de onderkant. Ideaal als relaxzitkussen in de zetel of de rolstoel.'],
    specs: [['Maat', '43 x 43 x 7 cm'], ['Schuim', 'gesneden viscoschuim'], ['Densiteit', '50 kg/m³'], ['Onderkant', 'anti-sliplaag']],
    hoes: PU210, maatwerk: true, foto: 'mmc-zp-05.jpg', fotoAlt: 'MMC zitpositionering, vierkant zitkussen in donkere hoes',
  },
  {
    slug: 'mmc-pk-08', code: 'MMC PK 08', naam: 'MMC peluwkussen', categorie: 'positionering-visco', status: 'actief',
    toepassingen: ['positionering', 'slaap'],
    kort: 'Wigvormig kussen, aflopend van 8 naar 2 cm.',
    omschrijving: ['Een wigvormig kussen uit gesneden viscoschuim, aflopend van 8 naar 2 cm. Voor een licht verhoogde lighouding van hoofd of benen.'],
    specs: [['Maat', '40 x 40 x 8 cm'], ['Schuim', 'gesneden viscoschuim'], ['Densiteit', '45 kg/m³']],
    hoes: PU210, maatwerk: true, foto: 'mmc-pk-08.jpg', fotoAlt: 'MMC peluwkussen met de hoes half eraf',
  },

  // ───────── Positioneringszitkussen ─────────
  {
    slug: 'mmc-r3dv-07', code: 'MMC R3DV 07', naam: 'MMC R3DV rolstoelkussen', categorie: 'zitkussens', status: 'actief', uitgelicht: true,
    toepassingen: ['zitten', 'druk'],
    kort: 'Gegoten visco rolstoelkussen met abductieheuvel.',
    omschrijving: [
      'Gegoten Visco 60 met een anatomische vorm en een ingebouwde abductieheuvel vooraan. Die helpt rechtop zitten en houdt dijen en knieën uit elkaar.',
      'Het rasterpatroon verbetert de luchtcirculatie en vermindert schuifkrachten. De afgeronde blokjes leiden de druk weg van de drukpunten, voor een stabiele zithouding die decubitus helpt voorkomen.',
    ],
    specs: [['Schuim', 'gegoten Visco 60, brandvertragend'], ['Densiteit', '60 kg/m³'], ['Vorm', 'anatomisch, met abductieheuvel'], ['Hoes', 'MMC 210 PU met watergordijn']],
    hoes: PU210, maatwerk: false, foto: 'mmc-r3dv-07.jpg', fotoAlt: 'MMC R3DV 07 rolstoelkussen met de hoes deels open',
    extraFotos: [{ src: 'mmc-r3dv-07-schuim.jpg', alt: 'Het gegoten viscoschuim van de MMC R3DV 07 met rasterpatroon' }],
  },

  // ───────── Positioneringshulpstukken polystyreen ─────────
  ...[
    ['mmcp-ak-01a', 'MMCP AK 01A', 'MMCP AK 01B', 'MMC abductie knie', 'Halve boog voor de ondersteuning van de knie.', '65 x 35 cm', 'mmcp-ak-01a.jpg', 'MMC abductie knie, blauwe halve boog'],
    ['mmcp-abp-02a', 'MMCP ABP 02A', 'MMCP ABP 02B', 'MMC arm- en beenpositionering', 'Kussen voor de ondersteuning van arm of been.', '39 x 21 cm', 'mmcp-abp-02a.jpg', 'Blauw positioneringskussen voor arm of been'],
    ['mmcp-uk-03a', 'MMCP UK 03A', 'MMCP UK 03B', 'MMC universeel klein', 'Klein kussen voor algemene ondersteuning.', '40 x 28,5/25,5 cm', 'mmcp-uk-03a.jpg', 'MMC universeel klein, blauw kussen'],
    ['mmcp-ug-04a', 'MMCP UG 04A', 'MMCP UG 04B', 'MMC universeel groot', 'Groot kussen voor algemene ondersteuning.', '68 x 42/36 cm', 'mmcp-ug-04a.jpg', 'MMC universeel groot, blauw kussen'],
    ['mmcp-ps-05a', 'MMCP PS 05A', 'MMCP PS 05B', 'MMC positioneringsslang', 'Lange slang voor de ondersteuning van de benen.', '179 x 34 cm', 'mmcp-ps-05a.jpg', 'MMC positioneringsslang in S-vorm'],
    ['mmcp-up-06a', 'MMCP UP 06A', 'MMCP UP 06B', 'MMC U-pillow', 'U-vormig kussen voor nek en schouders.', '161 x 80 cm', 'mmcp-up-06a.jpg', 'MMC U-pillow, lange blauwe boog'],
    ['mmcp-cg-07a', 'MMCP CG 07A', 'MMCP CG 07B', 'MMC cilinder groot (bolletjes)', 'Cilinder voor knie of voet bij ruglig.', '50 x 20 cm', 'mmcp-cg-07a.jpg', 'Blauwe cilinder gevuld met polystyreenbolletjes'],
  ].map(([slug, code, badstof, naam, kort, maat, foto, alt]) => ({
    slug, code, naam, categorie: 'positionering-polystyreen', status: 'actief',
    toepassingen: slug === 'mmcp-up-06a' ? ['positionering', 'slaap'] : ['positionering', 'druk'],
    kort,
    omschrijving: ['Gevuld met brandvertragende polystyreenbolletjes die zich naar het lichaamsdeel vormen. Zo krijgt het een volledige en constante ondersteuning, met een anti-decubituswerking.'],
    specs: [['Maat', maat], ['Vulling', 'brandvertragende polystyreenbolletjes'], ['Hoes', 'MMC 210 PU, MRSA-resistent']],
    badstof, hoes: PU210, maatwerk: false, foto, fotoAlt: alt,
  })),

  // ───────── Beschermingshulpstukken ─────────
  {
    slug: 'mmc-ob-09', code: 'MMC OB 09', naam: 'MMC onrusthekkenbeschermer', categorie: 'bescherming', status: 'actief',
    toepassingen: ['val'],
    kort: 'Zachte bekleding voor het onrusthek, 200 x 70 cm.',
    omschrijving: ['Bekleedt het onrusthek zodat armen en benen niet tussen de spijlen raken en stoten minder hard aankomen. De hoes in MMC 120 PU heeft dezelfde kwaliteit als de 210 PU, maar is lichter omdat ze minder te lijden heeft.'],
    specs: [['Maat', '200 x 70 cm'], ['Hoes', 'MMC 120 PU']],
    hoes: '120', maatwerk: true, foto: 'mmc-ob-09.jpg', fotoAlt: 'MMC onrusthekkenbeschermer, gele beschermkussens',
  },
  {
    slug: 'mmc-fo-10', code: 'MMC FO 10', naam: 'MMC fall out matras', categorie: 'bescherming', status: 'actief',
    toepassingen: ['val'],
    kort: 'Valmatras in drie delen voor naast het bed.',
    omschrijving: ['Ligt naast het bed en vangt de val op als iemand uit bed valt. Ook bruikbaar bij evacuatie: de persoon wordt op de matras verplaatst.'],
    specs: [['Maat', '3 x 60 x 60 cm'], ['Schuim', '7 cm CMHR 25, brandvertragend'], ['Opbouw', 'drie delen, plooibaar']],
    hoes: PU210, maatwerk: true, foto: 'mmc-fo-10.jpg', fotoAlt: 'MMC fall out matras, blauw, in drie delen met handgrepen',
  },
  {
    slug: 'mmc-p3-11', code: 'MMC P3 11', naam: 'MMC positioneringsdriehoek', categorie: 'bescherming', status: 'actief',
    toepassingen: ['val', 'positionering'],
    kort: 'Twee driehoeken die uit bed rollen voorkomen.',
    omschrijving: ['Twee driehoeken die voorkomen dat iemand uit bed rolt, zonder de bewegingsvrijheid te veel te remmen.'],
    specs: [['Maat', '20 x 20 x 90 cm'], ['Schuim', 'CMHR 25']],
    hoes: PU210, maatwerk: true, foto: 'mmc-p3-11.jpg', fotoAlt: 'MMC positioneringsdriehoek, twee schuimdriehoeken met banden',
  },
  {
    slug: 'mmc-sw-12', code: 'MMC SW 12', naam: 'MMC side wedges', categorie: 'bescherming', status: 'actief',
    toepassingen: ['val', 'positionering'],
    kort: 'Driehoeken met banden onder de matras door.',
    omschrijving: ['Driehoeken vastgezet met klittenband, met banden die onder de matras doorlopen. Wie op bed ligt, kan ze niet lostrekken.'],
    specs: [['Maat', '20 x 20 x 90 cm'], ['Schuim', 'CMHR 25'], ['Bevestiging', 'klittenband, banden onder de matras']],
    hoes: PU210, maatwerk: true, foto: 'mmc-sw-12.jpg', fotoAlt: 'MMC side wedges, blauwe driehoeken op een basis',
  },

  // ───────── Hoofdkussens ─────────
  {
    slug: 'mmc-pup-23', code: 'MMC PUP 23', naam: 'MMC hoofdkussen', categorie: 'hoofdkussens', status: 'actief', uitgelicht: true,
    toepassingen: ['slaap', 'hygiene'],
    kort: 'Hoofdkussen 60 x 60 cm met holle vezel en afneembare PU-hoes.',
    omschrijving: [
      'Een soepel, zijdezacht kussen in MMC 120 PU, afneembaar en apart wasbaar dankzij een binnenhoes. De vulling is gesiliconiseerde polyester holle vezel die zo dicht mogelijk aanleunt bij natuurlijk dons.',
      'Uiterst dunne vezels met flinterdunne kanaaltjes in de kern bootsen het isolerende effect van dons na.',
    ],
    specs: [['Maat', '60 x 60 cm'], ['Gewicht', '700 g'], ['Vulling', 'gesiliconiseerde polyester holle vezel'], ['Hoes', 'MMC 120 PU, afneembaar, met binnenhoes'], ['Verpakking', 'individueel']],
    varianten: { kolommen: ['Bestelcode', 'Uitvoering'], rijen: [['MMC PUP 23', 'afneembare hoes met binnenhoes'], ['MMC PUP 23 SOP', 'volledig dichtgestikt']] },
    hoes: '120', maatwerk: true, foto: 'mmc-pup-23.jpg', fotoAlt: 'MMC PUP 23 hoofdkussen, wit, op donkere achtergrond',
  },
  {
    slug: 'mmc-nsp-17', code: 'MMC NSP 17', naam: 'MMC neck support kussen', categorie: 'hoofdkussens', status: 'actief',
    toepassingen: ['slaap'],
    kort: 'Visco nekkussen dat nek en schouders ontlast.',
    omschrijving: ['Ontworpen met specialisten. Het kussen vormt zich naar nek en hoofd, zodat de spieren van nek en schouders ontlast en ondersteund worden.'],
    specs: [['Kern', 'visco'], ['Hoes', 'velours, behandeld tegen huismijt, hypoallergeen, afneembaar en wasbaar'], ['Verpakking', '5 stuks per doos']],
    hoes: 'velours', maatwerk: false, foto: 'mmc-nsp-17.jpg', fotoAlt: 'MMC neck support kussen in verpakking',
  },
  {
    slug: 'mmc-cp-18', code: 'MMC CP 18', naam: 'MMC classic kussen', categorie: 'hoofdkussens', status: 'actief',
    toepassingen: ['slaap'],
    kort: 'Visco kussen in traditionele vorm, voor elke slaaphouding.',
    omschrijving: ['Een steunkussen in traditionele vorm dat iets zachter aanvoelt. Drukverlagend, comfortverhogend en geschikt voor alle slaaphoudingen.'],
    specs: [['Kern', 'visco'], ['Hoes', 'velours, behandeld tegen huismijt, hypoallergeen, afneembaar en wasbaar'], ['Verpakking', '5 stuks per doos']],
    hoes: 'velours', maatwerk: false, foto: 'mmc-cp-18.jpg', fotoAlt: 'MMC classic kussen in verpakking',
  },
  {
    slug: 'mmc-tvp-24', code: 'MMC TVP 24', naam: 'MMC tv- en reiskussen', categorie: 'hoofdkussens', status: 'actief',
    toepassingen: ['slaap', 'zitten'],
    kort: 'Visco nekkussen voor onderweg of in de zetel.',
    omschrijving: ['Drukverlagende ondersteuning tijdens het reizen of tv-kijken, zodat de nekspieren ontspannen. De hoes heeft een sluiting.'],
    specs: [['Kern', 'visco'], ['Hoes', 'velours met sluiting, afneembaar en wasbaar']],
    hoes: 'velours', maatwerk: false, foto: 'mmc-tvp-24.jpg', fotoAlt: 'MMC tv- en reiskussen, wit U-vormig nekkussen',
    aanname: 'Aantal per doos te bevestigen (de catalogus vermeldt 30, maar die regel is doorstreept).',
  },

  // ───────── Dekbedden ─────────
  {
    slug: 'mmc-bicolor', code: 'MMC DB 2C met flap', naam: 'MMC Bicolor', categorie: 'dekbedden', status: 'actief', uitgelicht: true,
    toepassingen: ['slaap'],
    kort: 'Tweekleurig dekbed met huiselijke warmte, 8 jaar mee.',
    omschrijving: [
      'Huiselijke warmte, langs beide zijden bruikbaar dankzij de twee kleuren. Microfiber, horizontaal gestikt met de vulling.',
      'Soft Neotherm holle vezel die aanleunt bij natuurlijk dons. Gaat 8 jaar mee bij normaal gebruik.',
    ],
    specs: [['Afmeting', '220 x 150 cm'], ['Stof', '100% polyester microfiber, 85 g/m²'], ['Vulling', '300 g/m² soft Neotherm holle vezel'], ['Onderhoud', 'wasbaar op 40 °C, niet bleken, droogkuis (P)'], ['Brandveiligheid', 'EN ISO 12952:2010 (sigarettentest)'], ['Verpakking', 'individueel, 8 stuks per kleur per doos']],
    varianten: { kolommen: ['Kleur', 'Afmeting'], rijen: [['navy blauw / grijs', '220 x 150 cm'], ['kastanjebruin / beige', '220 x 150 cm'], ['bordeaux / grijs', '220 x 150 cm'], ['azur / hemelsblauw', '220 x 150 cm'], ['donkerbruin / beige', '220 x 150 cm']] },
    hoes: null, maatwerk: false, foto: 'bicolor-navy-grijs.jpg', fotoAlt: 'MMC Bicolor dekbed in navy blauw en grijs op een bed',
    kleuren: [
      { naam: 'navy blauw / grijs', foto: 'bicolor-navy-grijs.jpg' },
      { naam: 'kastanjebruin / beige', foto: 'bicolor-kastanje-beige.jpg' },
      { naam: 'bordeaux / grijs', foto: 'bicolor-bordeaux-grijs.jpg' },
      { naam: 'azur / hemelsblauw', foto: 'bicolor-azur-hemelsblauw.jpg' },
      { naam: 'donkerbruin / beige', foto: 'bicolor-donkerbruin-beige.jpg' },
    ],
    aanname: 'Naam van de vijfde kleurcombinatie te bevestigen (op de foto donkerbruin / beige).',
  },
  {
    slug: 'mmc-baby-dekbed', code: null, naam: 'MMC baby dekbed', categorie: 'dekbedden', status: 'actief',
    toepassingen: ['slaap', 'kinderen'],
    kort: 'Baby dekbed 120 x 80 cm in baby rose of baby blue.',
    omschrijving: ['Dezelfde opbouw als de MMC Bicolor, op babymaat. Wasvoorschriften zoals de MMC Bicolor.'],
    specs: [['Afmeting', '120 x 80 cm'], ['Stof', '85 g/m²'], ['Vulling', '150 g/m²'], ['Minimale afname', '200 stuks per kleur']],
    varianten: { kolommen: ['Kleur', 'Afmeting'], rijen: [['baby rose', '120 x 80 cm'], ['baby blue', '120 x 80 cm']] },
    hoes: null, maatwerk: false, foto: null,
  },

  // ───────── Hoes- en onderleglakens ─────────
  {
    slug: 'mmc-hoeslaken', code: 'MMC HOESLAKEN', naam: 'MMC hoeslaken', categorie: 'lakens', status: 'actief',
    toepassingen: ['hygiene', 'druk'],
    kort: 'Gebreid zorghoeslaken, door één persoon op te leggen.',
    omschrijving: [
      'Een gebreid hoeslaken voor de zorg, door één persoon op te leggen en dus minder arbeidsintensief. De rek zit in de lengte van de stof, zodat het laken strak blijft zitten, ook als het bed omhoog staat.',
      'Zonder plooien, dus preventief tegen decubitus. 350 keer wasbaar zonder kwaliteitsverlies, en het hoeft nooit gestreken.',
    ],
    specs: [['Stof', 'gebreid, 100% polyester, 150 g/m², bi-elastisch'], ['Hoeken', 'elastische polyester twill tape'], ['Wasbaar', '350 keer zonder kwaliteitsverlies'], ['Brandveiligheid', 'brandvrij']],
    hoes: null, maatwerk: false, foto: 'mmc-hoeslaken.jpg', fotoAlt: 'MMC hoeslaken strak over een matras gespannen',
  },
  {
    slug: 'mmc-incopad-flap', code: 'MMC Incopad Flap', naam: 'MMC Incopad met flap', categorie: 'lakens', status: 'actief',
    toepassingen: ['hygiene'],
    kort: 'Wasbare onderlegger die tot 3 liter opvangt.',
    omschrijving: ['Een wasbare onderlegger die de persoon droog en comfortabel houdt. Drie lagen: onderaan ondoordringbaar, bovenaan uiterst zacht polyester voor een super droog gevoel. De onderlegger absorbeert pas goed na de eerste wasbeurt.'],
    specs: [['Opbouw', 'drie lagen'], ['Opvangcapaciteit', 'maximaal 3 liter'], ['Bovenlaag', 'zacht polyester']],
    hoes: null, maatwerk: false, foto: null,
  },

  // ───────── Kinderen ─────────
  {
    slug: 'mmc-bwk-13', code: 'MMC BWK 13', naam: 'MMC babywaskussen', categorie: 'kinderen', status: 'actief',
    toepassingen: ['kinderen', 'hygiene'],
    kort: 'Verzorgingskussen in HR 25, met afritsbare PU-hoes.',
    omschrijving: ['Een verzorgingskussen uit HR 25, schuim met een densiteit van 25 kg/m³, brandvertragend. De MMC 210 PU-hoes ritst u eenvoudig af dankzij de L-sluiting, dus gemakkelijk wasbaar.'],
    specs: [['Schuim', 'HR 25, brandvertragend'], ['Hoes', 'MMC 210 PU-hoes met L-sluiting']],
    hoes: PU210, maatwerk: true, foto: 'mmc-bwk-13.jpg', fotoAlt: 'MMC babywaskussen, schuin aflopend kussen in donkere hoes',
  },
  {
    slug: 'mmc-km-14', code: 'MMC KM14', naam: 'MMC kindermatras', categorie: 'kinderen', status: 'actief',
    toepassingen: ['kinderen'],
    kort: 'Kindermatras 120 x 60 x 8 cm in HR 25.',
    omschrijving: ['Een kindermatras uit brandvertragend HR 25, in de MMC 210 PU-hoes met L-sluiting.'],
    specs: [['Afmeting', '120 x 60 x 8 cm'], ['Schuim', 'HR 25, brandvertragend'], ['Hoes', 'MMC 210 PU-hoes met L-sluiting']],
    hoes: PU210, maatwerk: true, foto: 'mmc-km14.jpg', fotoAlt: 'MMC kindermatras in donkere PU-hoes met MMC-logo',
  },

  // ───────── Hoezen ─────────
  {
    slug: 'mmc-210-pu-hoes', code: 'MMC 210 PU', naam: 'MMC 210 PU-hoes', categorie: 'hoezen', status: 'actief', uitgelicht: true,
    eigenPagina: '/mmc-210-pu-hoes/',
    toepassingen: ['hygiene'],
    kort: 'MRSA-bestendig, wasbaar op 95 °C, steriliseerbaar tot 115 °C.',
    omschrijving: ['De hoes die standaard rond onze matrassen en hulpstukken zit, ook los te bestellen.'],
    specs: [], hoes: PU210, maatwerk: true, foto: 'mmc-210-pu-hoes.jpg', fotoAlt: 'Verborgen rits in de MMC 210 PU-hoes',
  },
  {
    slug: 'mmc-at-cover', code: null, naam: 'MMC AT cover', categorie: 'hoezen', status: 'te-bevestigen',
    toepassingen: ['hygiene', 'slaap'],
    kort: 'Anti-transpiratiehoes met open 3D-honingraatstructuur.',
    omschrijving: ['Een volledig open 3D-honingraatstructuur met gelamineerd breiwerk, waar lucht vrij circuleert. Vermindert zweten en is veilig tegen verstikking, voor baby’s en volwassenen.'],
    specs: [['Stof', 'polykatoen met honingraattextuur'], ['Bevestiging', 'elastiek'], ['Onderhoud', 'wasbaar op 40 °C']],
    varianten: { kolommen: ['Afmeting'], rijen: [['200 x 90 cm'], ['200 x 140 cm'], ['200 x 160 cm'], ['200 x 180 cm']] },
    hoes: null, maatwerk: false, foto: null,
    aanname: 'Status van de AT cover te bevestigen (doorstreept op p. 19, niet op p. 20 van de catalogus).',
  },
];
