// Po zbudowaniu strony tworzy lżejsze kopie WebP obrazów z folderu media
// (oryginały w repozytorium pozostają nietknięte). Strona używa plików *.w800.webp / *.w1600.webp,
// a gdy ich brak — automatycznie wraca do oryginału.
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('../dist/media/', import.meta.url).pathname;
const SIZES = [800, 1600];
let n = 0, failed = 0;

async function walk(dir) {
  let items = [];
  try { items = await readdir(dir); } catch { return; }
  for (const name of items) {
    const p = join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) { await walk(p); continue; }
    if (!/\.(png|jpe?g|webp)$/i.test(name) || /\.w\d+\.webp$/i.test(name)) continue;
    for (const w of SIZES) {
      try {
        await sharp(p).rotate().resize({ width: w, height: w, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 82 }).toFile(`${p}.w${w}.webp`);
        n++;
      } catch (e) {
        failed++;
        console.warn(`[obrazy] Nie udało się przetworzyć ${p}: ${e.message}`);
      }
    }
  }
}
await walk(ROOT);
console.log(`[obrazy] Utworzono ${n} wersji WebP${failed ? `, błędy: ${failed}` : ''}.`);
