import { producten } from '../data/producten.mjs';
import { categorieen, hoezen } from '../data/site.mjs';

export const zichtbaar = producten.filter((p) => p.status !== 'uit-gamma');

export const productUrl = (p) => p.eigenPagina ?? `/producten/${p.categorie}/${p.slug}/`;
export const categorieUrl = (c) => `/producten/${typeof c === 'string' ? c : c.slug}/`;
export const fotoUrl = (f) => (f ? `/img/producten/${f}` : null);

export const perCategorie = (slug) => zichtbaar.filter((p) => p.categorie === slug);
export const categorie = (slug) => categorieen.find((c) => c.slug === slug);
export const hoes = (key) => (key ? hoezen[key] : null);

export const offerteUrl = (p, type = 'offerte') => {
  const q = new URLSearchParams({ type });
  if (p) q.set('product', p.code ?? p.naam);
  return `/offerte/?${q}`;
};

/** Toppers volgens de klant: V10, PUP 23, dekbedden, zitkussens. */
export const toppers = ['mmc-v10', 'mmc-pup-23', 'mmc-bicolor', 'mmc-r3dv-07']
  .map((s) => zichtbaar.find((p) => p.slug === s))
  .filter(Boolean);

export { categorieen, producten };
