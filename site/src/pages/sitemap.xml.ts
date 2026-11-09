import { categorieen, perCategorie, zichtbaar, productUrl, categorieUrl } from '../lib/catalogus.mjs';

export function GET({ site }: { site: URL }) {
  const paths = [
    '/', '/producten/', '/mmc-210-pu-hoes/', '/maatwerk/', '/kwaliteit/', '/over-mmc/', '/offerte/', '/contact/',
    ...categorieen.filter((c) => perCategorie(c.slug).length).map(categorieUrl),
    ...zichtbaar.filter((p) => !p.eigenPagina).map(productUrl),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
