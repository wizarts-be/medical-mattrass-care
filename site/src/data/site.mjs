// Bedrijfsgegevens, categorieën en toepassingen. Interfaceteksten staan in ../i18n/nl.mjs.

export const bedrijf = {
  naam: 'Medical Mattress Care BV',
  kort: 'MMC',
  straat: 'Puyveldestraat 8',
  postcode: '9170',
  gemeente: 'Sint-Pauwels',
  land: 'België',
  btw: '0875.860.609',
  telefoon: '0473 59 11 71',
  telefoonHref: '+32473591171',
  // AANNAME: e-mailadres op de site nog te bevestigen (michel@medicalmattresscare.com is ook in gebruik).
  email: 'info@medical-mattress-care.com',
  opgericht: 2005,
  zaakvoerder: 'Michel Marynissen',
  url: 'https://www.medical-mattress-care.com',
  kaart: 'https://www.openstreetmap.org/search?query=Puyveldestraat%208%2C%209170%20Sint-Pauwels',
};

export const categorieen = [
  { slug: 'matrassen', naam: 'Matrassen', kort: 'Visco, koudschuim en drukverdelend, standaard in de MMC 210 PU-hoes.', intro: 'Alle matrassen komen standaard in de MMC 210 PU-hoes. Zit uw matras er niet bij? MMC levert matrassen in opbouw en maat naar uw wens.', beeld: 'mmc-v10.jpg' },
  { slug: 'positionering-visco', naam: 'Positionering visco', lang: 'Positioneringshulpstukken visco', kort: 'Cilinders, wiggen en zitkussens uit gesneden of gegoten viscoschuim.', intro: 'Hulpstukken uit viscoschuim, gesneden uit een blok of in de mal gegoten. Allemaal in de MMC 210 PU-hoes, op maat te maken.', beeld: 'mmc-cg-02.jpg' },
  { slug: 'positionering-polystyreen', naam: 'Positionering bolletjes', lang: 'Positioneringshulpstukken polystyreen', kort: 'Kussens met polystyreenbolletjes die zich naar het lichaam vormen.', intro: 'Brandvertragende polystyreenbolletjes vormen zich naar het lichaamsdeel en geven een volledige, constante ondersteuning. Bij elk kussen is een badstofhoes apart te bestellen.', beeld: 'mmcp-collectie.jpg' },
  { slug: 'zitkussens', naam: 'Zitkussens', lang: 'Positioneringszitkussen', kort: 'Rolstoelkussen uit gegoten visco met abductieheuvel.', intro: 'Een stabiele, rechte zithouding helpt decubitus voorkomen. Ons rolstoelkussen is in de mal gegoten en leidt de druk weg van de zitbeenderen.', beeld: 'mmc-r3dv-07.jpg' },
  { slug: 'bescherming', naam: 'Bescherming', lang: 'Beschermingshulpstukken', kort: 'Valmatras, driehoeken en onrusthekkenbeschermers.', intro: 'Hulpstukken die vallen opvangen en uit bed rollen voorkomen, zonder iemand te veel in zijn beweging te remmen.', beeld: 'mmc-fo-10.jpg' },
  { slug: 'hoofdkussens', naam: 'Hoofdkussens', kort: 'Holle vezel en visco, individueel verpakt.', intro: 'Alle kussens worden individueel verpakt geleverd. Kies holle vezel in een wasbare PU-hoes, of visco in een velours hoes.', beeld: 'mmc-pup-23.jpg' },
  { slug: 'dekbedden', naam: 'Dekbedden', kort: 'Tweekleurige dekbedden en baby dekbedden.', intro: 'Dekbedden die een kamer huiselijk maken en een industriële was doorstaan.', beeld: 'bicolor-navy-grijs.jpg' },
  { slug: 'lakens', naam: 'Lakens en onderleggers', kort: 'Gebreide hoeslakens en wasbare onderleggers.', intro: 'Lakens en onderleggers die het werk op de afdeling lichter maken.', beeld: 'mmc-hoeslaken.jpg' },
  { slug: 'kinderen', naam: 'Kinderen', kort: 'Babywaskussen en kindermatras in de MMC 210 PU-hoes.', intro: 'Voor kinderdagverblijven, kraamafdelingen en pediatrie.', beeld: 'mmc-km14.jpg' },
  { slug: 'hoezen', naam: 'Hoezen', kort: 'De MMC 210 PU-hoes, ook los te bestellen.', intro: 'Hoezen voor matrassen en hulpstukken, ook los te bestellen.', beeld: 'mmc-210-pu-hoes.jpg' },
];

export const toepassingen = [
  { slug: 'druk', naam: 'Drukverlaging en decubituspreventie', kort: 'Drukverlaging', vraag: 'Iemand ligt of zit lang en loopt risico op doorligwonden.' },
  { slug: 'positionering', naam: 'Positionering in bed', kort: 'Positionering', vraag: 'Een bewoner moet stabiel en ontspannen in bed liggen.' },
  { slug: 'zitten', naam: 'Zitten en rolstoel', kort: 'Zitten', vraag: 'Iemand zit urenlang in een rolstoel of zetel.' },
  { slug: 'val', naam: 'Valpreventie en bescherming', kort: 'Valpreventie', vraag: 'Een bewoner is onrustig of valt uit bed.' },
  { slug: 'hygiene', naam: 'Hygiëne en incontinentie', kort: 'Hygiëne', vraag: 'Alles moet heet wasbaar en goed te ontsmetten zijn.' },
  { slug: 'slaap', naam: 'Slaapcomfort', kort: 'Slaapcomfort', vraag: 'Kussens en dekbedden die thuis aanvoelen.' },
  { slug: 'kinderen', naam: 'Kinderen en baby’s', kort: 'Kinderen', vraag: 'Verzorging en slaap voor de kleinsten.' },
];

export const hoezen = {
  '210': { naam: 'MMC 210 PU-hoes', regel: 'MRSA-bestendig, wasbaar op 95 °C, steriliseerbaar tot 115 °C.' },
  '120': { naam: 'MMC 120 PU-hoes', regel: 'Dezelfde kwaliteit als de 210 PU, lichter uitgevoerd.' },
  velours: { naam: 'Velours hoes', regel: 'Behandeld tegen huismijt, hypoallergeen, afneembaar en wasbaar.' },
  dubbeldoek: { naam: 'Dubbeldoekhoes', regel: 'Zacht, wasbaar en volledig afritsbaar, met 3D-ventilatiestrook.' },
};

// 210 PU-hoes: eigenschappen en technische fiche (catalogus p. 23 en 24)
export const hoesFiche = [
  ['Stof', '', '100% polyester, 100 g/m²'],
  ['Coating', '', '100% polyurethaan, 100 g/m²'],
  ['Totaal gewicht', '', '200 g/m² (± 10 g/m²)'],
  ['Treksterkte', 'EN ISO 1421', 'ketting > 30 daN/5 cm, inslag > 25 daN/5 cm'],
  ['Rek', 'EN ISO 1421', 'ketting > 110%, inslag > 150%'],
  ['Waterkolom', 'ISO 1420', '> 200 cm'],
  ['Hydrolyse', 'Jungle test, 3 weken', 'geen kwaliteitsverlies'],
  ['Brandwerend', 'BS 7175, Crib 5', 'Centexbel 58974/B'],
  ['Schimmelwerend', 'ASTM G 21-96', 'resistent'],
  ['Antibacterieel', 'ATCC #6538 (Staphylococcus aureus)', 'resistent'],
  ['Waterdampdoorlaatbaarheid', 'ASTM G 96-66', '600 g/m² per 24 u bij 32 °C'],
  ['Krimp bij wassen op 95 °C', 'ISO 5077', 'max. 5%'],
];

export const ontsmetting = 'gedenatureerde alcohol (90% alcohol + 2% ether), Fugaten spray (ethanol 70%), oliën 7 g/l (5 min contact), H.A.C., Reocid, Dettol, Lyorthol, Indur Des, Prespect, Hycolin, Clearsol';

export const oudeUrls = {
  '/matrassen-flex/': '/producten/matrassen/mmc-flex/',
  '/matrassen-210pu-hoes/': '/mmc-210-pu-hoes/',
  '/mmc-thuis-matras/': '/producten/matrassen/mmc-thuis-matras/',
  '/hoofdkussens-holle-vezel/': '/producten/hoofdkussens/',
  '/hoofdkussens-visco/': '/producten/hoofdkussens/',
  '/beschermingshulpstukken/': '/producten/bescherming/',
  '/positioneringszitkussen/': '/producten/zitkussens/',
  '/positionering-visco/': '/producten/positionering-visco/',
  '/positioneringshulpstukken-ps/': '/producten/positionering-polystyreen/',
  '/dekbedden/': '/producten/dekbedden/',
  '/mmc-bicolor/': '/producten/dekbedden/mmc-bicolor/',
  '/mmc-baby-dekbed/': '/producten/dekbedden/mmc-baby-dekbed/',
  '/hoes-wegwerplakens/': '/producten/lakens/',
  '/hoes-baby-kinder/': '/producten/kinderen/',
  '/labo-en-certificaten/': '/hygiene-en-kwaliteit/',
  '/contact/': '/contact/',
};
