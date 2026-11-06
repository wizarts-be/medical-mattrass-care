// Bouwt de statische site van Medical Mattress Care in ./public.
// Gebruik: node build.mjs   (geen dependencies)
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { producten as alleProducten } from './src/data/producten.mjs';
import { bedrijf, categorieen, toepassingen, hoezen, hoesFiche, ontsmetting, oudeUrls } from './src/data/site.mjs';
import t from './src/i18n/nl.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, 'public');
const KEEP = new Set(['css', 'js', 'img', 'logo', 'docs']);

// ───────── helpers ─────────
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nb = (s = '') => esc(s).replace(/(\d) (cm|kg|g|°C|daN|u|%|liter|stuks|mm)/g, '$1&nbsp;$2').replace(/ x /g, '&nbsp;x&nbsp;');
const producten = alleProducten.filter((p) => p.status !== 'uit-gamma');
const cat = (slug) => categorieen.find((c) => c.slug === slug);
const toep = (slug) => toepassingen.find((x) => x.slug === slug);
const urlVan = (p) => p.eigenPagina || `/producten/${p.categorie}/${p.slug}/`;
const heeftFoto = (p) => p.foto && !p.fotoIsHoes;
const maatVan = (p) => {
  const m = (p.specs.find(([k]) => /^(Afmeting|Maat)$/.test(k)) || [])[1];
  if (m) return m.split(',')[0];
  if (p.varianten) return `${p.varianten.rijen.length} ${p.varianten.kolommen[0] === 'Kleur' ? 'kleuren' : 'uitvoeringen'}`;
  return '';
};
const uitStock = (p) => p.status === 'actief' && p.slug !== 'mmc-baby-dekbed';

function jpegSize(file) {
  try {
    const b = readFileSync(file);
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      i += 2 + len;
    }
  } catch {}
  return { w: 640, h: 427 };
}
function img(src, alt, { high = false, sizes = '(min-width: 60rem) 25vw, 50vw', extra = '' } = {}) {
  const { w, h } = jpegSize(join(OUT, src.replace(/^\//, '')));
  return `<img src="${src}" width="${w}" height="${h}" alt="${esc(alt)}" sizes="${sizes}"${high ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${extra}>`;
}

const ICON = {
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  right: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  package: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  ruler: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
};
const icon = (n, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON[n]}</svg>`;
const more = (href, label) => `<a class="more" href="${href}">${label}${icon('right', 'icon--16')}</a>`;
const media = (p, { sizes, high = false } = {}) => (heeftFoto(p)
  ? img(`/img/producten/${p.foto}`, p.fotoAlt || p.naam, { sizes, high })
  : `<span class="ph" aria-hidden="true"><span class="ph__name">${esc(p.naam)}</span><span class="ph__note">Foto volgt</span></span>`);

// ───────── chrome ─────────
function head({ title, description, path, schema = [], lang = 'nl' }) {
  const full = title.includes('Medical Mattress Care') ? title : `${title} | Medical Mattress Care`;
  const url = bedrijf.url + path;
  const depth = path.split('/').filter((x) => x && !x.includes('.')).length;
  const css = path.endsWith('.html') ? '/css/site.css' : `${'../'.repeat(depth) || './'}css/site.css`;
  const org = { '@context': 'https://schema.org', '@type': 'Organization', name: bedrijf.naam, url: bedrijf.url, logo: bedrijf.url + '/logo/mmc-logo-kleur.svg', foundingDate: String(bedrijf.opgericht), telephone: '+32 473 59 11 71', email: bedrijf.email, vatID: 'BE' + bedrijf.btw, address: { '@type': 'PostalAddress', streetAddress: bedrijf.straat, postalCode: bedrijf.postcode, addressLocality: bedrijf.gemeente, addressCountry: 'BE' } };
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="nl" href="${url}">
<link rel="alternate" hreflang="fr" href="${bedrijf.url}/fr/">
<link rel="alternate" hreflang="en" href="${bedrijf.url}/en/">
<link rel="alternate" hreflang="x-default" href="${url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="nl_BE">
<meta property="og:site_name" content="Medical Mattress Care">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${bedrijf.url}/img/producten/mmc-v10.jpg">
<meta name="theme-color" content="#352C57">
<link rel="icon" href="/logo/mmc-icoon-indigo.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600&family=Fira+Mono:wght@400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${css}">
<script>document.documentElement.classList.add('js');</script>
${[org, ...schema].map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
</head>
<body>
<a class="skip" href="#main">${t.skip}</a>`;
}

function nav(actief = '', over = false) {
  const cur = (k) => (actief === k ? ' aria-current="page"' : '');
  return `
<header class="nav${over ? ' nav--over' : ''}" data-nav>
  <div class="container nav__in">
    <a class="nav__logo" href="/" aria-label="Medical Mattress Care, naar de homepagina"><img class="logo-kleur" src="/logo/mmc-logo-kleur.svg" width="112" height="56" alt=""><img class="logo-wit" src="/logo/mmc-logo-wit.svg" width="112" height="56" alt=""></a>
    <nav class="nav__menu" id="navmenu" aria-label="Hoofdmenu">
      <ul>
        <li class="has-mega"><a href="/producten/"${actief === 'producten' ? ' aria-current="true"' : ''}>${t.producten}</a><button class="nav__more" type="button" aria-expanded="false" aria-controls="mega" data-mega hidden><span class="visually-hidden">${t.productmenu}</span>${icon('chevron', 'icon--16')}</button></li>
        <li><a href="/maatwerk/"${cur('maatwerk')}>${t.maatwerk}</a></li>
        <li><a href="/hygiene-en-kwaliteit/"${cur('hygiene')}>${t.hygiene}</a></li>
        <li><a href="/over-mmc/"${cur('over')}>${t.over}</a></li>
        <li><a href="/contact/"${cur('contact')}>${t.contact}</a></li>
      </ul>
    </nav>
    <div class="nav__end">
      <div class="lang" role="group" aria-label="${t.taal}"><a href="/" aria-current="true" lang="nl">NL</a><a href="/fr/" lang="fr">FR</a><a href="/en/" lang="en">EN</a></div>
      <button class="iconbtn" type="button" aria-expanded="false" aria-controls="zoekpaneel" data-searchtoggle><span class="visually-hidden">${t.zoekLabel}</span>${icon('search', 'icon--20')}</button>
      <a class="btn btn--sm" href="/offerte/">${t.offerte}</a>
      <button class="iconbtn nav__burger" type="button" aria-expanded="false" aria-controls="navmenu" data-burger><span class="visually-hidden">${t.menu}</span>${icon('menu', 'icon--20')}</button>
    </div>
  </div>
  <div class="panel" id="zoekpaneel" hidden>
    <div class="container">
      <form class="search" role="search" action="/producten/" data-search>
        <label class="visually-hidden" for="zoek-nav">${t.zoekLabel}</label>
        <div class="search__field">${icon('search', 'icon--20')}<input id="zoek-nav" name="q" type="search" autocomplete="off" placeholder="Zoek op productnaam of bestelcode" role="combobox" aria-expanded="false" aria-controls="zoek-nav-lijst" aria-autocomplete="list"></div>
        <ul class="search__results" id="zoek-nav-lijst" role="listbox" aria-label="Zoekresultaten" hidden></ul>
      </form>
    </div>
  </div>
  <div class="panel mega" id="mega" hidden>
    <div class="container mega__grid">
      <div><p class="mega__h">${t.perCategorie}</p><ul class="mega__list mega__list--2">${categorieen.map((c) => `<li><a href="/producten/${c.slug}/">${esc(c.naam)}</a></li>`).join('')}</ul></div>
      <div><p class="mega__h">${t.perToepassing}</p><ul class="mega__list">${toepassingen.map((x) => `<li><a href="/producten/?toepassing=${x.slug}">${esc(x.naam)}</a></li>`).join('')}</ul></div>
    </div>
  </div>
</header>`;
}

function cta() {
  return `
  <section class="cta" aria-labelledby="cta-titel">
    <div class="cta__panel">
      <div class="cta__in">
        <div>
          <h2 id="cta-titel">Een offerte voor uw instelling</h2>
          <p>Geef de producten en aantallen door. U krijgt een persoonlijk antwoord van Michel Marynissen.</p>
        </div>
        <div class="cta__actions">
          <a class="btn btn--signal" href="/offerte/">${t.offerte}</a>
          <a class="cta__tel" href="tel:${bedrijf.telefoonHref}">${icon('phone', 'icon--20')}${bedrijf.telefoon}</a>
        </div>
      </div>
    </div>
  </section>`;
}

function footer() {
  return `
<footer class="foot">
  <div class="container">
    <div class="foot__grid">
      <div class="foot__brand">
        <a href="/" class="foot__logo" aria-label="Medical Mattress Care, naar de homepagina"><img src="/logo/mmc-logo-wit.svg" width="150" height="75" alt="" loading="lazy"></a>
        <address>${bedrijf.naam}<br>${esc(bedrijf.straat)}<br>${bedrijf.postcode} ${esc(bedrijf.gemeente)}</address>
        <p><a href="tel:${bedrijf.telefoonHref}">${bedrijf.telefoon}</a><br><a href="mailto:${bedrijf.email}">${bedrijf.email}</a></p>
      </div>
      <div class="foot__wide"><h2>Producten</h2><ul class="foot__cols">${categorieen.map((c) => `<li><a href="/producten/${c.slug}/">${esc(c.naam)}</a></li>`).join('')}</ul></div>
      <div><h2>MMC</h2><ul><li><a href="/mmc-210-pu-hoes/">MMC 210 PU-hoes</a></li><li><a href="/maatwerk/">${t.maatwerk}</a></li><li><a href="/hygiene-en-kwaliteit/">${t.hygiene}</a></li><li><a href="/over-mmc/">${t.over}</a></li><li><a href="/contact/">${t.contact}</a></li></ul></div>
    </div>
    <div class="foot__legal">
      <p>Ondernemingsnummer ${bedrijf.btw}. ISO 14001-gecertificeerd productiehuis, Fairsales sinds 2016.</p>
      <ul><li><a href="/disclaimer/">Disclaimer</a></li><li><a href="/privacybeleid/">Privacybeleid</a></li><li><a href="/cookiebeleid/">Cookiebeleid</a></li></ul>
    </div>
  </div>
</footer>
<script src="/js/zoekindex.js" defer></script>
<script src="/js/site.js" defer></script>
</body>
</html>`;
}

const crumbs = (items) => `<nav class="crumbs" aria-label="Kruimelpad"><ol>${items.map(([href, label], i) => `<li>${i === items.length - 1 ? `<span aria-current="page">${esc(label)}</span>` : `<a href="${href}">${esc(label)}</a>`}</li>`).join('')}</ol></nav>`;
const pagehead = (items, title, lead, extra = '') => `<section class="pagehead"><div class="container">${crumbs(items)}<h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}${extra}</div></section>`;

function card(p, { sizes = '(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw' } = {}) {
  return `<li class="pcard" data-toep="${p.toepassingen.join(' ')}" data-zoek="${esc((p.naam + ' ' + (p.code || '') + ' ' + p.kort).toLowerCase())}">
  <a class="pcard__link" href="${urlVan(p)}">
    <span class="pcard__media">${media(p, { sizes })}</span>
    <span class="pcard__body"><span class="pcard__name">${esc(p.naam)}</span><span class="pcard__meta">${p.code ? `<span class="code">${esc(p.code)}</span>` : ''}${maatVan(p) ? `<span>${nb(maatVan(p))}</span>` : ''}</span></span>
  </a>
</li>`;
}
const grid = (ps, cls = '') => `<ul class="pgrid ${cls}">${ps.map((p) => card(p)).join('')}</ul>`;

function page(path, html) {
  const dir = join(OUT, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  gebouwd.push(path);
}
const gebouwd = [];

// ───────── clean ─────────
for (const f of readdirSync(OUT)) if (!KEEP.has(f)) rmSync(join(OUT, f), { recursive: true, force: true });

// ───────── home ─────────
{
  const toppers = ['mmc-v10', 'mmc-pup-23', 'mmc-bicolor', 'mmc-r3dv-07'].map((sl) => producten.find((p) => p.slug === sl));
  const html = `${head({ title: 'Medical Mattress Care | Zorgmatrassen en hulpstukken uit stock', description: 'Hygiënische, drukverlagende matrassen, kussens en hoezen voor woonzorgcentra en ziekenhuizen. Vlaams familiebedrijf sinds 2005, uit stock geleverd.', path: '/' })}
${nav('', true)}
<main id="main">
  <section class="poster" aria-labelledby="hero-titel" data-hero>
    <div class="poster__img">${img('/img/beeld/hero-stof.jpg', '', { high: true, sizes: '100vw', extra: ' srcset="/img/beeld/hero-stof-1280.jpg 1280w, /img/beeld/hero-stof.jpg 2560w"' })}</div>
    <div class="poster__scrim" aria-hidden="true"></div>
    <div class="container poster__in">
      <h1 id="hero-titel">Matrassen voor de zorg</h1>
      <div class="poster__foot">
        <p class="poster__lead">Hygiënisch, drukverlagend en uit stock geleverd. Sinds 2005 uit Sint-Pauwels.</p>
        <div class="actions"><a class="btn btn--signal" href="/offerte/">${t.offerte}</a><a class="btn btn--glass" href="/producten/">Bekijk producten</a></div>
      </div>
      <span class="seal" aria-hidden="true">Maatwerk mogelijk!</span>
    </div>
  </section>

  <section class="usp" aria-labelledby="why-titel">
    <div class="container">
      <h2 id="why-titel" class="visually-hidden">Waarom zorginstellingen voor MMC kiezen</h2>
      <ul class="usp__list">
        <li>${icon('package')}<h3>Uit stock leverbaar</h3><p>Bijna alle standaardproducten liggen klaar in Sint-Pauwels.</p></li>
        <li>${icon('ruler')}<h3>Maatwerk mogelijk</h3><p>Matrassen en kussens in opbouw en maat naar uw wens.</p></li>
        <li>${icon('shield')}<h3>Hygiënisch tot in de hoes</h3><p>De MMC 210 PU-hoes is wasbaar op 95&nbsp;°C en MRSA-bestendig.</p></li>
        <li>${icon('pin')}<h3>Persoonlijk en Vlaams</h3><p>Een familiebedrijf sinds 2005, met een scherpe prijs.</p></li>
      </ul>
    </div>
  </section>

  <section class="section section--tint" aria-labelledby="top-titel">
    <div class="container">
      <div class="shead"><div><h2 id="top-titel">Onze toppers</h2><p class="lead">De producten die zorginstellingen het vaakst bij ons bestellen.</p></div>${more('/producten/', 'Alle producten')}</div>
      ${grid(toppers, 'pgrid--lift')}
    </div>
  </section>

  <section class="spot" aria-labelledby="hoes-titel">
    <div class="spot__panel">
      <div class="spot__body">
        <p class="spot__fig" aria-hidden="true">95&nbsp;°C</p>
        <h2 id="hoes-titel">De MMC 210 PU-hoes, standaard op elke matras</h2>
        <p class="lead">Polyurethaan op een bi-elastisch weefsel. Ook los te bestellen voor uw bestaande matrassen.</p>
        <ul class="ticks ticks--light"><li>Steriliseerbaar tot 115&nbsp;°C</li><li>MRSA-bestendig</li><li>Brandnorm CRIB&nbsp;5</li><li>Oeko-Tex standaard 100</li></ul>
        <a class="btn btn--glass" href="/mmc-210-pu-hoes/">Technische fiche</a>
      </div>
      <div class="spot__media">${img('/img/producten/mmc-210-pu-hoes.jpg', 'De verborgen rits van de MMC 210 PU-hoes', { sizes: '(min-width: 64rem) 50vw, 100vw' })}</div>
    </div>
  </section>

  <section class="section" aria-labelledby="ass-titel">
    <div class="container">
      <div class="shead"><div><h2 id="ass-titel">Het volledige assortiment</h2><p class="lead">Tien productgroepen, van matras tot hoeslaken.</p></div>${more('/producten/', 'Zoeken in alle producten')}</div>
      <ul class="catlist">
        ${categorieen.map((c) => { const n = producten.filter((p) => p.categorie === c.slug).length; return `<li><a href="/producten/${c.slug}/"><span class="catlist__img">${img('/img/producten/' + c.beeld, '', { sizes: '72px' })}</span><span class="catlist__name">${esc(c.naam)}</span><span class="catlist__n">${n}</span>${icon('right', 'icon--16')}</a></li>`; }).join('\n        ')}
      </ul>
    </div>
  </section>

  <section class="section section--tint" aria-labelledby="over-titel">
    <div class="container about">
      <div>
        <h2 id="over-titel">Een familiebedrijf uit Sint-Pauwels</h2>
        <p class="lead">Michel Marynissen richtte MMC op in 2005, na jaren in de schuimproductie. Samen met onderzoeksinstellingen ontwikkelt hij matrassen die hygiënisch zijn en goed liggen.</p>
        ${more('/over-mmc/', 'Over MMC')}
      </div>
      <ul class="certs">
        <li><h3>ISO 14001</h3><p>Gecertificeerd productiehuis.</p></li>
        <li><h3>Fairsales</h3><p>Gecertificeerd sinds 2016.</p></li>
        <li><h3>Medisch hulpmiddel klasse I</h3><p>MMC V10, volgens (EU) 2017/745.</p></li>
      </ul>
    </div>
  </section>
  ${cta()}
</main>
${footer()}`;
  page('', html);
}

// ───────── producten overzicht ─────────
{
  const html = `${head({ title: 'Producten', description: 'Alle zorgmatrassen, positioneringshulpstukken, kussens, dekbedden en hoezen van Medical Mattress Care, te filteren op toepassing.', path: '/producten/' })}
${nav('producten')}
<main id="main">
  ${pagehead([['/', t.home], ['/producten/', t.producten]], 'Producten', 'Zoek op naam of bestelcode, of filter op toepassing.')}
  <div class="container catalog" data-finder>
    <aside class="filters" aria-label="Filters">
      <form class="finder" action="/producten/" role="search">
        <label class="filters__h" for="zoek-lijst">Zoeken</label>
        <div class="search__field search__field--sm">${icon('search', 'icon--20')}<input id="zoek-lijst" name="q" type="search" autocomplete="off" placeholder="Naam of bestelcode"></div>
        <fieldset class="radios"><legend class="filters__h">Toepassing</legend>
          <label><input type="radio" name="toepassing" value="" checked><span>Alle producten</span></label>
          ${toepassingen.map((x) => `<label><input type="radio" name="toepassing" value="${x.slug}"><span>${esc(x.naam)}</span></label>`).join('')}
        </fieldset>
        <p class="finder__status" aria-live="polite" data-finder-status></p>
      </form>
    </aside>
    <div class="catalog__list">
      ${categorieen.map((c) => { const ps = producten.filter((p) => p.categorie === c.slug); return `<section class="group" data-group aria-labelledby="g-${c.slug}"><div class="group__head"><h2 id="g-${c.slug}">${esc(c.naam)}</h2>${more(`/producten/${c.slug}/`, 'Bekijk categorie')}</div>${grid(ps, 'pgrid--3')}</section>`; }).join('\n      ')}
      <div class="empty" data-finder-empty hidden><h2>Geen product gevonden</h2><p>Probeer een andere zoekterm, of vraag ons naar maatwerk.</p>${more('/maatwerk/', 'Maatwerk')}</div>
    </div>
  </div>
  ${cta()}
</main>
${footer()}`;
  page('producten', html);
}

// ───────── categorieën ─────────
for (const c of categorieen) {
  const ps = producten.filter((p) => p.categorie === c.slug);
  const mw = ps.some((p) => p.maatwerk);
  const html = `${head({ title: c.lang || c.naam, description: `${c.lang || c.naam} van Medical Mattress Care. ${c.kort}`, path: `/producten/${c.slug}/` })}
${nav('producten')}
<main id="main">
  ${pagehead([['/', t.home], ['/producten/', t.producten], [`/producten/${c.slug}/`, c.naam]], esc(c.lang || c.naam), nb(c.intro))}
  <section class="section section--top0" aria-label="Producten in ${esc(c.naam)}">
    <div class="container">
      <p class="count">${ps.length} ${ps.length === 1 ? 'product' : 'producten'}</p>
      ${grid(ps)}
      ${mw ? `<div class="note-card note-card--dark"><div><h2>Andere maat of opbouw nodig?</h2><p>MMC maakt deze producten ook op maat.</p></div>${more('/maatwerk/', 'Over maatwerk')}</div>` : ''}
    </div>
  </section>
  ${cta()}
</main>
${footer()}`;
  page(`producten/${c.slug}`, html);
}

// ───────── productpagina's ─────────
for (const p of producten.filter((x) => !x.eigenPagina)) {
  const c = cat(p.categorie);
  const verwant = producten.filter((x) => x.slug !== p.slug && x.toepassingen.some((s) => p.toepassingen.includes(s)))
    .sort((a, b) => (b.categorie === p.categorie) - (a.categorie === p.categorie)).slice(0, 4);
  const h = p.hoes ? hoezen[p.hoes] : null;
  const fotos = p.kleuren ? p.kleuren.map((k) => ({ src: k.foto, alt: `MMC Bicolor in ${k.naam}`, label: k.naam })) : heeftFoto(p) ? [{ src: p.foto, alt: p.fotoAlt }, ...(p.extraFotos || [])] : [];
  const codeParam = encodeURIComponent(p.code || p.naam);
  const schema = { '@context': 'https://schema.org', '@type': 'Product', name: p.naam, sku: p.code || undefined, description: p.kort, category: c.lang || c.naam, brand: { '@type': 'Brand', name: 'MMC' }, manufacturer: { '@type': 'Organization', name: bedrijf.naam }, image: p.foto ? bedrijf.url + '/img/producten/' + p.foto : undefined };
  const specs = p.specs.length || p.badstof ? `<dl class="specs">${p.specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${nb(v)}</dd></div>`).join('')}${p.badstof ? `<div><dt>Badstofhoes</dt><dd>Apart te bestellen, <span class="code">${esc(p.badstof)}</span></dd></div>` : ''}</dl>` : '';
  const varianten = p.varianten ? `<div class="variants"><p class="variants__h">${p.varianten.kolommen[0] === 'Kleur' ? 'Kleuren' : 'Uitvoeringen'}</p><table class="vtable"><thead><tr>${p.varianten.kolommen.map((k) => `<th scope="col">${esc(k)}</th>`).join('')}</tr></thead><tbody>${p.varianten.rijen.map((r) => `<tr>${r.map((v, i) => `<td${/MMC|\d{7}/.test(v) && i === 0 || /^\d{7}$/.test(v) ? ' class="code"' : ''}>${nb(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : '';
  const html = `${head({ title: `${p.naam}${p.code ? ' (' + p.code + ')' : ''}`, description: `${p.naam}: ${p.kort} ${p.hoes === '210' ? 'Standaard in de MMC 210 PU-hoes.' : ''}`.trim(), path: urlVan(p), schema: [JSON.parse(JSON.stringify(schema))] })}
${nav('producten')}
<main id="main">
  ${p.aanname ? `<!-- AANNAME: ${esc(p.aanname)} -->` : ''}
  <section class="product">
    <div class="container">
      ${crumbs([['/', t.home], ['/producten/', t.producten], [`/producten/${c.slug}/`, c.naam], [urlVan(p), p.naam]])}
      <div class="product__grid">
        <div class="gallery" data-gallery>
          <div class="gallery__main">${fotos.length ? img('/img/producten/' + fotos[0].src, fotos[0].alt, { high: true, sizes: '(min-width: 64rem) 55vw, 100vw' }) : media(p)}</div>
          ${fotos.length > 1 ? `<ul class="gallery__thumbs" aria-label="${p.kleuren ? 'Kleuren' : 'Foto’s'}">${fotos.map((f, i) => `<li><button type="button" aria-pressed="${i === 0}" aria-label="${esc(f.label || f.alt)}" data-src="/img/producten/${f.src}" data-alt="${esc(f.alt)}"><img src="/img/producten/${f.src}" alt="" width="88" height="66" loading="lazy"></button></li>`).join('')}</ul>` : ''}
        </div>
        <div class="buy">
          <h1>${esc(p.naam)}</h1>
          <p class="lead">${nb(p.kort)}</p>
          <div class="actions">
            <a class="btn" href="/offerte/?product=${codeParam}">${t.offerte}</a>
            <a class="btn btn--ghost" href="/offerte/?product=${codeParam}&amp;type=staal">${t.staal}</a>
          </div>
          <ul class="badges">${p.code ? `<li class="badge">${t.bestelcode}&nbsp;<span class="code">${esc(p.code)}</span></li>` : ''}${uitStock(p) ? `<li class="badge badge--ok">${icon('check', 'icon--16')}Uit stock leverbaar</li>` : `<li class="badge">Beschikbaarheid op aanvraag</li>`}${p.maatwerk ? `<li class="badge">Maatwerk mogelijk</li>` : ''}</ul>
          ${varianten}
          <ul class="doclinks">${(p.documenten || []).map((d) => `<li><a href="${d.href}">${icon('file', 'icon--16')}${esc(d.label)} (pdf)</a></li>`).join('')}<li><a href="/offerte/?product=${codeParam}&amp;type=fiche">${icon('file', 'icon--16')}${t.fiche}</a></li></ul>
          ${h ? `<p class="buy__hoes">${p.hoes === '210' ? `Geleverd in de <a href="/mmc-210-pu-hoes/">MMC 210 PU-hoes</a>.` : `${esc(h.naam)}.`} ${nb(h.regel)}</p>` : ''}
        </div>
      </div>
    </div>
  </section>

  <section class="section section--tint" aria-labelledby="info-titel">
    <div class="container info">
      <h2 id="info-titel">Productinformatie</h2>
      <div><div class="prose">${p.omschrijving.map((x) => `<p>${nb(x)}</p>`).join('')}${p.fotoIsHoes ? '<p class="muted">Een productfoto volgt.</p>' : ''}</div>
      <ul class="tags">${p.toepassingen.map((s) => `<li><a href="/producten/?toepassing=${s}">${esc(toep(s).naam)}</a></li>`).join('')}</ul></div>
    </div>
  </section>
  ${specs ? `<section class="section" aria-labelledby="spec-titel">
    <div class="container info"><h2 id="spec-titel">Specificaties</h2>${specs}</div>
  </section>` : ''}

  ${verwant.length ? `<section class="section section--dark" aria-labelledby="verwant">
    <div class="container"><div class="shead"><div><h2 id="verwant">Gerelateerde producten</h2></div>${more(`/producten/${c.slug}/`, `Alle ${c.naam.toLowerCase()}`)}</div>${grid(verwant)}</div>
  </section>` : ''}
  ${cta()}
</main>
${footer()}`;
  page(urlVan(p).replace(/^\/|\/$/g, ''), html);
}

// ───────── MMC 210 PU-hoes ─────────
{
  const p = producten.find((x) => x.slug === 'mmc-210-pu-hoes');
  const eig = ['Bi-elastisch weefsel', 'Ondoordringbaar voor water en urine', 'Ademend', 'Wasbaar op 95 °C', 'Steriliseerbaar tot 115 °C', 'MRSA-bestendig', 'Bacterie- en schimmelresistent', 'Brandnorm CRIB 5', 'Oeko-Tex standaard 100', 'Geen naden in de ligvlakken', 'Verborgen rits met L-sluiting', 'Rits in de kleur van de hoes'];
  const html = `${head({ title: 'MMC 210 PU-hoes: MRSA-bestendig en wasbaar op 95 °C', description: 'De MMC 210 PU-hoes is MRSA-bestendig, wasbaar op 95 °C, steriliseerbaar tot 115 °C en voldoet aan brandnorm CRIB 5. Standaard op MMC-matrassen, ook los te bestellen.', path: '/mmc-210-pu-hoes/', schema: [{ '@context': 'https://schema.org', '@type': 'Product', name: 'MMC 210 PU-hoes', sku: 'MMC 210 PU', description: p.kort, brand: { '@type': 'Brand', name: 'MMC' } }] })}
${nav('hygiene')}
<main id="main">
  <section class="product">
    <div class="container">
      ${crumbs([['/', t.home], ['/producten/hoezen/', 'Hoezen'], ['/mmc-210-pu-hoes/', 'MMC 210 PU-hoes']])}
      <div class="product__grid">
        <div class="gallery"><div class="gallery__main">${img('/img/producten/mmc-210-pu-hoes.jpg', p.fotoAlt, { high: true, sizes: '(min-width: 64rem) 55vw, 100vw' })}</div></div>
        <div class="buy">
          <h1>MMC 210 PU-hoes</h1>
          <p class="lead">Polyurethaan op een bi-elastisch weefsel. Standaard op onze matrassen, ook los te bestellen.</p>
          <div class="actions"><a class="btn" href="/offerte/?product=MMC%20210%20PU">Hoezen aanvragen</a><a class="btn btn--ghost" href="#fiche">Technische fiche</a></div>
          <ul class="badges"><li class="badge">${t.bestelcode}&nbsp;<span class="code">MMC 210 PU</span></li><li class="badge badge--ok">${icon('check', 'icon--16')}Uit stock leverbaar</li></ul>
          <ul class="ticks">${eig.map((e) => `<li>${nb(e)}</li>`).join('')}</ul>
        </div>
      </div>
    </div>
  </section>
  <section class="section section--tint" id="fiche" aria-labelledby="fiche-t">
    <div class="container">
      <div class="shead"><div><h2 id="fiche-t">Technische fiche</h2><p class="lead">Getest volgens Europese en internationale normen.</p></div></div>
      <div class="table-wrap"><table class="dtable"><thead><tr><th scope="col">Eigenschap</th><th scope="col">Norm</th><th scope="col">Waarde</th></tr></thead><tbody>${hoesFiche.map(([a, b, c]) => `<tr><td>${esc(a)}</td><td class="muted">${esc(b) || '&nbsp;'}</td><td>${nb(c)}</td></tr>`).join('')}</tbody></table></div>
    </div>
  </section>
  <section class="section section--dark" id="onderhoud" aria-labelledby="onderhoud-t">
    <div class="container info">
      <div><h2 id="onderhoud-t">Onderhoud</h2><p class="lead">Bestand tegen de gangbare ontsmettingsmiddelen uit de zorg.</p><p class="muted small">${esc(ontsmetting)}.</p></div>
      <ul class="care"><li><b>95&nbsp;°C</b><span>wasbaar</span></li><li><b>Niet bleken</b><span>geen chloor</span></li><li><b>Niet strijken</b><span>de coating smelt</span></li><li><b>Klasse A</b><span>reinigen met producten met klasse A-label</span></li><li><b>Droogkast</b><span>tot niveau 1</span></li></ul>
    </div>
  </section>
  ${cta()}
</main>
${footer()}`;
  page('mmc-210-pu-hoes', html);
}

// ───────── maatwerk ─────────
{
  const mw = producten.filter((p) => p.maatwerk && heeftFoto(p)).slice(0, 4);
  const html = `${head({ title: 'Maatwerk: matrassen en kussens op maat', description: 'Medical Mattress Care maakt zorgmatrassen, kussens en positioneringshulpstukken in opbouw en maat naar uw wens.', path: '/maatwerk/' })}
${nav('maatwerk')}
<main id="main">
  ${pagehead([['/', t.home], ['/maatwerk/', t.maatwerk]], 'Maatwerk', 'Zit uw matras er niet bij? MMC levert matrassen en kussens in opbouw en maat naar uw wens.', `<div class="actions"><a class="btn" href="/offerte/?maatwerk=ja">Maatwerk aanvragen</a></div>`)}
  <section class="section section--top0">
    <div class="container">
      <div class="feature">
        <div class="feature__media">${img('/img/producten/mmc-flex-wafelprofiel.jpg', 'Schuim van de MMC Flex in wafelprofiel', { sizes: '(min-width: 64rem) 50vw, 100vw' })}</div>
        <div class="feature__body">
          <h2>Wat kan op maat</h2>
          <dl class="specs specs--wide">
            <div><dt>Matrassen</dt><dd>Lengte, breedte en dikte, en de opbouw: koudschuim, traagschuim en densiteit.</dd></div>
            <div><dt>Hulpstukken</dt><dd>Cilinders, wiggen en zitkussens in de maat van uw bed of rolstoel.</dd></div>
            <div><dt>Hoofdkussens</dt><dd>De MMC PUP 23 in een andere maat of vulling.</dd></div>
            <div><dt>Hoezen</dt><dd>De MMC 210 PU-hoes op maat van uw bestaande matrassen.</dd></div>
          </dl>
        </div>
      </div>
    </div>
  </section>
  <section class="section section--dark" aria-labelledby="hoe">
    <!-- AANNAME: verloop van een maatwerkaanvraag te bevestigen door MMC. -->
    <div class="container">
      <div class="shead"><div><h2 id="hoe">Zo werkt het</h2></div></div>
      <ol class="steps">
        <li><h3>U stuurt de maten</h3><p>Samen met het gebruik: wie ligt erop, hoe lang, op welk bed.</p></li>
        <li><h3>Wij stellen een opbouw voor</h3><p>Met een offerte en op vraag een staal.</p></li>
        <li><h3>Wij maken en leveren</h3><p>Rechtstreeks vanuit Sint-Pauwels.</p></li>
      </ol>
    </div>
  </section>
  <section class="section section--tint" aria-labelledby="mw-p">
    <div class="container"><div class="shead"><div><h2 id="mw-p">Ook op maat verkrijgbaar</h2></div></div>${grid(mw)}</div>
  </section>
  ${cta()}
</main>
${footer()}`;
  page('maatwerk', html);
}

// ───────── hygiëne en kwaliteit ─────────
{
  const html = `${head({ title: 'Hygiëne en kwaliteit: labo en certificaten', description: 'MRSA-bestendige hoezen, ISO 14001-productiehuis, Fairsales-certificaat en onderhoudstips voor een hygiënische kamer.', path: '/hygiene-en-kwaliteit/' })}
${nav('hygiene')}
<main id="main">
  ${pagehead([['/', t.home], ['/hygiene-en-kwaliteit/', t.hygiene]], 'Hygiëne en kwaliteit', 'Wat we testen, wie het controleert en hoe u een kamer gezond houdt.')}
  <section class="section section--top0">
    <div class="container">
      <div class="feature">
        <div class="feature__media">${img('/img/producten/mmc-pu-hoes-rits.jpg', 'Rits van de MMC 210 PU-hoes', { sizes: '(min-width: 64rem) 50vw, 100vw' })}</div>
        <div class="feature__body"><h2>Het begint bij de hoes</h2><p class="lead">Elke matras en elk hulpstuk zit standaard in de MMC 210 PU-hoes: MRSA-bestendig, wasbaar op 95&nbsp;°C en steriliseerbaar tot 115&nbsp;°C.</p>${more('/mmc-210-pu-hoes/', 'Technische fiche bekijken')}</div>
      </div>
    </div>
  </section>
  <section class="section section--tint" aria-labelledby="cert">
    <div class="container">
      <div class="shead"><div><h2 id="cert">Labo en certificaten</h2></div></div>
      <ul class="certs certs--4">
        <li><h3>ISO 14001</h3><p>Onze producten komen uit een ISO 14001-gecertificeerd productiehuis op eigen groene stroom.</p></li>
        <li><h3>Fairsales</h3><p>Eerlijke handel en een dubbele klachtengarantie, sinds 2016.</p>${more('/docs/fairsales-certificaat-2026.pdf', 'Certificaat (pdf)')}</li>
        <li><h3>Centexbel</h3><p>Brandwerendheid van de hoes getest volgens BS 7175, Crib 5, rapport 58974/B.</p></li>
        <li><h3>Medisch hulpmiddel</h3><p>De MMC V10 is klasse I volgens de verordening (EU) 2017/745.</p>${more('/docs/mmc-v10-eu-conformiteitsverklaring.pdf', 'Verklaring (pdf)')}</li>
      </ul>
    </div>
  </section>
  <section class="section section--dark" aria-labelledby="tips">
    <div class="container">
      <div class="shead"><div><h2 id="tips">Een gezonde kamer</h2><p class="lead">Drie gewoontes tegen huisstofmijt.</p></div></div>
      <ol class="steps">
        <li><h3>Ventileren</h3><p>Droge lucht betekent minder mijten. Ideaal is 20&nbsp;°C, met hooguit 2 graden verschil tussen dag en nacht.</p></li>
        <li><h3>Wassen</h3><p>Regelmatig en boven 60&nbsp;°C, om de huisstofmijt te doden.</p></li>
        <li><h3>Schoonmaken</h3><p>Dagelijks vochtig afstoffen, stofzuigen en dweilen. Vermijd vloerkleden en stoffen meubilair.</p></li>
      </ol>
    </div>
  </section>
  ${cta()}
</main>
${footer()}`;
  page('hygiene-en-kwaliteit', html);
}

// ───────── over MMC ─────────
{
  const html = `${head({ title: 'Over MMC: Vlaams familiebedrijf sinds 2005', description: 'Medical Mattress Care werd in 2005 opgericht door Michel Marynissen in Sint-Pauwels. Hygiënische, drukverlagende matrassen, ontwikkeld met onderzoeksinstellingen.', path: '/over-mmc/' })}
${nav('over')}
<main id="main">
  ${pagehead([['/', t.home], ['/over-mmc/', t.over]], 'Over MMC', 'Een Vlaams familiebedrijf dat sinds 2005 matrassen maakt voor de zorg en voor thuis.')}
  <section class="section section--top0">
    <div class="container">
      <div class="feature">
        <div class="feature__media">${img('/img/beeld/mmc-blok.jpg', 'Een blok schuim in de MMC-hoes met het MMC-logo', { sizes: '(min-width: 64rem) 50vw, 100vw' })}</div>
        <div class="feature__body prose">
          <h2>Het verhaal van Michel</h2>
          <p>Na jaren in de schuimproductie zag Michel Marynissen dat hygiëne in de zorg beter kon. In 2005 richtte hij Medical Mattress Care op.</p>
          <p>Vandaag levert MMC aan woonzorgcentra en ziekenhuizen. Bijna alles uit stock, aan een scherpe prijs.</p>
        </div>
      </div>
    </div>
  </section>
  <section class="section section--dark" aria-labelledby="feiten">
    <div class="container">
      <div class="shead"><div><h2 id="feiten">MMC in het kort</h2></div></div>
      <dl class="facts">
        <div><dt>Opgericht</dt><dd>2005, door Michel Marynissen</dd></div>
        <div><dt>Vestiging</dt><dd>Puyveldestraat 8, Sint-Pauwels</dd></div>
        <div><dt>Productie</dt><dd>ISO 14001-gecertificeerd, eigen groene stroom</dd></div>
        <div><dt>Fairsales</dt><dd>Gecertificeerd sinds 2016</dd></div>
      </dl>
    </div>
  </section>
  ${cta()}
</main>
${footer()}`;
  page('over-mmc', html);
}

// ───────── offerte ─────────
{
  const opties = producten.map((p) => `<option value="${esc(p.code || p.naam)}">${esc(p.naam)}</option>`).join('') + producten.flatMap((p) => (p.varianten && /MMC/.test(p.varianten.rijen[0][0]) ? p.varianten.rijen.map((r) => `<option value="${esc(r[0])}">${esc(p.naam)}, ${nb(r[1])}</option>`) : [])).join('');
  const html = `${head({ title: 'Offerte of staal aanvragen', description: 'Vraag een offerte, een staal of een technische fiche aan bij Medical Mattress Care. Vermeld de producten en aantallen, wij antwoorden persoonlijk.', path: '/offerte/' })}
${nav()}
<main id="main">
  ${pagehead([['/', t.home], ['/offerte/', t.offerte]], 'Offerte of staal aanvragen', 'Vermeld de producten en aantallen. U krijgt een persoonlijk antwoord.')}
  <section class="section section--top0">
    <div class="container formgrid">
      <!-- TODO koppeling formulier: endpoint nog te kiezen (bv. Formspree, eigen PHP of het CRM). Vul data-endpoint in. -->
      <form class="form card-box" data-endpoint="" data-form novalidate>
        <fieldset class="seg"><legend>Wat wilt u ontvangen?</legend>
          <input type="radio" name="type" id="ty-offerte" value="offerte" checked><label for="ty-offerte">Offerte</label>
          <input type="radio" name="type" id="ty-staal" value="staal"><label for="ty-staal">Staal</label>
          <input type="radio" name="type" id="ty-fiche" value="fiche"><label for="ty-fiche">Technische fiche</label>
        </fieldset>
        <div class="fieldset"><p class="flabel" id="lines-label">Producten en aantallen</p>
          <datalist id="productcodes">${opties}</datalist>
          <div class="lines" data-lines aria-labelledby="lines-label">
            <div class="line" data-line><label class="visually-hidden" for="prod-1">Product of bestelcode</label><input class="input" id="prod-1" name="product[]" list="productcodes" placeholder="Product of bestelcode" autocomplete="off"><label class="visually-hidden" for="aantal-1">Aantal</label><input class="input" id="aantal-1" name="aantal[]" type="number" inputmode="numeric" min="1" value="1"><button class="line__remove" type="button" data-remove disabled><span class="visually-hidden">Regel verwijderen</span>${icon('x', 'icon--16')}</button></div>
          </div>
          <button class="addline" type="button" data-add>${icon('plus', 'icon--16')}Product toevoegen</button>
        </div>
        <fieldset class="seg"><legend>Maatwerk nodig?</legend>
          <input type="radio" name="maatwerk" id="mw-nee" value="nee" checked><label for="mw-nee">Nee</label>
          <input type="radio" name="maatwerk" id="mw-ja" value="ja"><label for="mw-ja">Ja</label>
        </fieldset>
        <div class="form__row">
          <div class="field"><label for="f-inst">Instelling</label><input id="f-inst" name="instelling" autocomplete="organization" required><p class="field__help" id="h-inst"></p></div>
          <div class="field"><label for="f-naam">Contactpersoon</label><input id="f-naam" name="naam" autocomplete="name" required><p class="field__help" id="h-naam"></p></div>
        </div>
        <div class="form__row">
          <div class="field"><label for="f-functie">Functie <span class="opt">(optioneel)</span></label><input id="f-functie" name="functie" autocomplete="organization-title" placeholder="Bijvoorbeeld aankoper"><p class="field__help"></p></div>
          <div class="field"><label for="f-tel">Telefoon <span class="opt">(optioneel)</span></label><input id="f-tel" name="telefoon" type="tel" autocomplete="tel" inputmode="tel"><p class="field__help"></p></div>
        </div>
        <div class="field"><label for="f-mail">E-mail</label><input id="f-mail" name="email" type="email" autocomplete="email" required><p class="field__help" id="h-mail"></p></div>
        <div class="field"><label for="f-opm">Opmerking <span class="opt">(optioneel)</span></label><textarea id="f-opm" name="opmerking" placeholder="Maten, gewenste leverdatum, afdeling"></textarea></div>
        <div><button class="btn" type="submit">Aanvraag versturen</button><p class="form__status" role="status" data-status></p></div>
      </form>
      <aside class="aside card-box card-box--dark" aria-label="Rechtstreeks contact">
        <h2>Liever rechtstreeks?</h2>
        <ul class="contactlist"><li>${icon('phone', 'icon--20')}<a href="tel:${bedrijf.telefoonHref}">${bedrijf.telefoon}</a></li><li>${icon('mail', 'icon--20')}<a href="mailto:${bedrijf.email}">${bedrijf.email}</a></li><li>${icon('pin', 'icon--20')}<span>${esc(bedrijf.straat)}<br>${bedrijf.postcode} ${esc(bedrijf.gemeente)}</span></li></ul>
      </aside>
    </div>
  </section>
</main>
${footer()}`;
  page('offerte', html);
}

// ───────── contact ─────────
{
  const html = `${head({ title: 'Contact', description: 'Medical Mattress Care BV, Puyveldestraat 8, 9170 Sint-Pauwels. Telefoon 0473 59 11 71.', path: '/contact/' })}
${nav('contact')}
<main id="main">
  ${pagehead([['/', t.home], ['/contact/', t.contact]], 'Contact', 'Bel, mail of kom langs in Sint-Pauwels.')}
  <section class="section section--top0">
    <div class="container contactgrid">
      <div class="card-box"><h2>Telefoon</h2><p><a class="big" href="tel:${bedrijf.telefoonHref}">${bedrijf.telefoon}</a></p></div>
      <div class="card-box"><h2>E-mail</h2><p><a class="big big--sm" href="mailto:${bedrijf.email}">${bedrijf.email}</a></p></div>
      <div class="card-box"><h2>Adres</h2><p>${esc(bedrijf.straat)}<br>${bedrijf.postcode} ${esc(bedrijf.gemeente)}, ${bedrijf.land}</p>${more(bedrijf.kaart, 'Bekijk op de kaart')}</div>
    </div>
    <div class="container"><dl class="facts facts--plain"><div><dt>Bedrijf</dt><dd>${bedrijf.naam}</dd></div><div><dt>Zaakvoerder</dt><dd>${bedrijf.zaakvoerder}</dd></div><div><dt>Ondernemingsnummer</dt><dd class="code">${bedrijf.btw}</dd></div></dl></div>
  </section>
  ${cta()}
</main>
${footer()}`;
  page('contact', html);
}

// ───────── juridisch ─────────
for (const [slug, titel] of [['disclaimer', 'Disclaimer'], ['privacybeleid', 'Privacybeleid'], ['cookiebeleid', 'Cookiebeleid']]) {
  page(slug, `${head({ title: titel, description: `${titel} van Medical Mattress Care BV.`, path: `/${slug}/` })}
${nav()}
<main id="main">
  <!-- AANNAME: juridische tekst nog aan te leveren. -->
  ${pagehead([['/', t.home], [`/${slug}/`, titel]], titel, `Deze tekst wordt nog aangevuld. Vragen? Mail naar <a href="mailto:${bedrijf.email}">${bedrijf.email}</a>.`)}
  <section class="section section--top0"><div class="container prose"><p>${bedrijf.naam}, ${esc(bedrijf.straat)}, ${bedrijf.postcode} ${esc(bedrijf.gemeente)}. Ondernemingsnummer ${bedrijf.btw}.</p></div></section>
</main>
${footer()}`);
}

// ───────── FR / EN (in voorbereiding) ─────────
for (const [lang, titel, tekst, terug] of [['fr', 'Version française bientôt disponible', 'Notre site en français est en préparation. Appelez-nous ou écrivez-nous en attendant.', 'Version néerlandaise'], ['en', 'English version coming soon', 'Our English site is in preparation. In the meantime, call or email us.', 'Dutch version']]) {
  page(lang, `${head({ title: titel, description: tekst, path: `/${lang}/`, lang })}
${nav()}
<main id="main">${pagehead([['/', 'Home'], [`/${lang}/`, lang.toUpperCase()]], titel, `${tekst}<br><a href="tel:${bedrijf.telefoonHref}">+32 473 59 11 71</a>, <a href="mailto:${bedrijf.email}">${bedrijf.email}</a>`, `<div class="actions">${more('/', terug)}</div>`)}</main>
${footer()}`);
}

// ───────── 404 ─────────
writeFileSync(join(OUT, '404.html'), `${head({ title: 'Pagina niet gevonden', description: 'Deze pagina bestaat niet (meer).', path: '/404.html' })}
${nav()}
<main id="main">${pagehead([['/', t.home], ['/404.html', 'Niet gevonden']], 'Deze pagina bestaat niet meer', 'Zoek op naam of bestelcode, of bekijk alle producten.', `<div class="actions"><a class="btn" href="/producten/">Alle producten</a></div>`)}</main>
${footer()}`);

// ───────── zoekindex, sitemap, robots, redirects ─────────
writeFileSync(join(OUT, 'js', 'zoekindex.js'), `window.MMC_INDEX=${JSON.stringify(producten.map((p) => ({ n: p.naam, c: p.code || '', k: p.kort, u: urlVan(p), f: heeftFoto(p) ? '/img/producten/' + p.foto : '', t: p.toepassingen, v: p.varianten && /MMC/.test(p.varianten.rijen[0][0]) ? p.varianten.rijen.map((r) => r[0]) : [] })))};`);
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${gebouwd.filter((p) => !['fr', 'en'].includes(p)).map((p) => `  <url><loc>${bedrijf.url}/${p ? p + '/' : ''}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${bedrijf.url}/sitemap.xml\n`);
const red = Object.entries(oudeUrls).filter(([a, b]) => a !== b);
writeFileSync(join(OUT, '_redirects'), red.map(([a, b]) => `${a} ${b} 301`).join('\n') + '\n');
writeFileSync(join(OUT, '.htaccess'), `ErrorDocument 404 /404.html\n` + red.map(([a, b]) => `Redirect 301 ${a} ${b}`).join('\n') + '\n');

console.log(`Gebouwd: ${gebouwd.length} pagina's, ${producten.length} producten.`);
