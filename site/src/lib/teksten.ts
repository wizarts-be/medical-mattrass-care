// Longer explanatory copy for category and product pages (src/data/teksten-*.mjs).
// Loaded through a glob so a page still builds while a text file is missing.
const mods = import.meta.glob('../data/teksten-*.mjs', { eager: true }) as Record<string, any>;
const pick = (key: string) => Object.values(mods).find((m) => m[key])?.[key] ?? {};

export interface Blok { kop: string; tekst: string }
export interface CategorieTekst { titel: string; intro?: string; blokken: Blok[] }

export const categorieTekst = (slug: string): CategorieTekst | undefined => pick('categorieTeksten')[slug];
export const productTekst = (slug: string): Blok[] => pick('productTeksten')[slug] ?? [];
