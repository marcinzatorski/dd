// @ts-check
import { defineConfig } from 'astro/config';

// Adres strony: https://marcinzatorski.github.io/dd/
// Przy przeniesieniu do innego repozytorium zmień `site` i `base`.
export default defineConfig({
  site: 'https://marcinzatorski.github.io',
  base: '/dd',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
