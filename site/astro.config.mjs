import { defineConfig } from 'astro/config';
import { oudeUrls } from './src/data/site.mjs';

// Statische site. Oude WordPress-URL's worden doorverwezen (ook in public/_redirects en .htaccess).
export default defineConfig({
  site: 'https://www.medical-mattress-care.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  redirects: Object.fromEntries(
    Object.entries(oudeUrls).filter(([from, to]) => from !== to).map(([from, to]) => [from.replace(/\/$/, ''), to])
  ),
  devToolbar: { enabled: false },
});
