# Dungeons and Dwarves — Cienie Rudych Wzgórz

Ilustrowana kronika kampanii: **https://marcinzatorski.github.io/dd/**

- Strona: [Astro](https://astro.build) (statyczna), hosting: GitHub Pages, publikacja: GitHub Actions (`.github/workflows/deploy.yml`).
- Treści edytujesz w **Pages CMS**: https://app.pagescms.org/ (konfiguracja: `.pages.yml`).
- Treści: `src/content/*` (Markdown z nagłówkiem YAML), mapa: `src/data/swiat.json`, obrazy: `public/media/`.

Lokalnie: `npm ci && npm run dev` (podgląd), `npm run build` (wynik w `dist/`).
