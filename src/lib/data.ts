import { getCollection, type CollectionEntry } from 'astro:content';

export const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');

/** Adres strony wewnątrz serwisu, np. url('swiat/npc/') -> /dd/swiat/npc/ */
export const url = (p = '') => BASE + p.replace(/^\//, '');

/** Ścieżka obrazka z CMS (np. /media/npc/x.png) -> pełny adres z prefiksem /dd/ */
export function img(path?: string | null): string {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path)) return path;
  let p = path.replace(/^\/+/, '');
  const b = BASE.replace(/^\/+/, '');
  if (b && p.startsWith(b)) p = p.slice(b.length);
  return BASE + p.replace(/^public\//, '');
}
/** Zoptymalizowana wersja WebP (generowana przy budowie, patrz scripts/optimize-images.mjs) */
export function imgW(path: string | null | undefined, w: 800 | 1600 = 800): string {
  const u = img(path);
  if (!u || /^(https?:)?\/\//.test(u) || !/\.(png|jpe?g|webp)$/i.test(u)) return u;
  return `${u}.w${w}.webp`;
}

const norm = (p: string) => p.replace(/\\/g, '/').replace(/^\.?\//, '').replace(/^\/+/, '');
const baseName = (p: string) => norm(p).split('/').pop()!.replace(/\.(md|mdx|ya?ml|json)$/i, '');

/** Rozwiązuje listę odwołań z CMS (ścieżki plików lub identyfikatory) na wpisy; pomija usunięte. */
function resolver<T extends { id: string; filePath?: string; data: { id?: string } }>(entries: T[]) {
  const byKey = new Map<string, T>();
  for (const e of entries) {
    if (e.filePath) byKey.set(norm(e.filePath), e);
    byKey.set(e.id, e);
    if (e.filePath) byKey.set(baseName(e.filePath), e);
    if (e.data.id) byKey.set(e.data.id, e);
  }
  return (list: string[] = []) => {
    const out: T[] = [];
    for (const r of list) {
      const e = byKey.get(norm(r)) ?? byKey.get(baseName(r));
      if (e && !out.includes(e)) out.push(e);
    }
    return out;
  };
}

export const MONTHS = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'];
const ROMAN: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100 };
export function eraNum(e: string): number {
  const s = (e || '').toUpperCase().replace(/[^IVXLC0-9]/g, '');
  if (/^\d+$/.test(s)) return +s;
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    const v = ROMAN[s[i]], nx = ROMAN[s[i + 1]] ?? 0;
    n += v < nx ? -v : v;
  }
  return n || 0;
}
export const eraLabel = (e: string) => `${(e || 'III').toUpperCase()} Era`;

export type Ep = CollectionEntry<'epizody'>;

let cache: Awaited<ReturnType<typeof build>> | null = null;
export async function loadAll() {
  if (!cache) cache = await build();
  return cache;
}

async function build() {
  const [epizody, bohaterowie, npc, miejsca, odkrycia, wydarzenia] = await Promise.all([
    getCollection('epizody'), getCollection('bohaterowie'), getCollection('npc'),
    getCollection('miejsca'), getCollection('odkrycia'), getCollection('wydarzenia'),
  ]);
  epizody.sort((a, b) => a.data.kolejnosc - b.data.kolejnosc || a.id.localeCompare(b.id));
  const used = new Set<string>();
  for (const e of epizody) {
    let s = (e.data.id || '').toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    if (!s || used.has(s)) s = e.id;
    used.add(s);
    slugCache.set(e, s);
  }
  bohaterowie.sort((a, b) => a.data.kolejnosc - b.data.kolejnosc || a.data.imie.localeCompare(b.data.imie, 'pl'));
  const byName = (k: string) => (a: any, b: any) => String(a.data[k]).localeCompare(String(b.data[k]), 'pl');
  npc.sort(byName('imie')); miejsca.sort(byName('nazwa')); odkrycia.sort(byName('nazwa'));

  const rNpc = resolver(npc), rMie = resolver(miejsca), rOdk = resolver(odkrycia), rWyd = resolver(wydarzenia);

  // Jedyne źródło powiązań: pola w epizodach. Relacje odwrotne liczone tutaj.
  const rel = new Map<Ep, { npc: typeof npc; miejsca: typeof miejsca; odkrycia: typeof odkrycia; wydarzenia: typeof wydarzenia }>();
  const back = new Map<object, Ep[]>();
  const addBack = (o: object, e: Ep) => { const l = back.get(o) ?? []; if (!l.includes(e)) l.push(e); back.set(o, l); };
  for (const e of epizody) {
    const r = {
      npc: rNpc(e.data.npc), miejsca: rMie(e.data.miejsca),
      odkrycia: rOdk(e.data.odkrycia), wydarzenia: sortEvents(rWyd(e.data.wydarzenia)),
    };
    rel.set(e, r);
    [...r.npc, ...r.miejsca, ...r.odkrycia, ...r.wydarzenia].forEach((o) => addBack(o, e));
  }
  return {
    epizody, bohaterowie, npc, miejsca, odkrycia, wydarzenia: sortEvents(wydarzenia),
    rel: (e: Ep) => rel.get(e)!,
    episodesOf: (o: object) => back.get(o) ?? [],
  };
}

export function sortEvents<T extends CollectionEntry<'wydarzenia'>>(list: T[]): T[] {
  return [...list].sort((a, b) =>
    eraNum(a.data.era) - eraNum(b.data.era) ||
    a.data.data.localeCompare(b.data.data, 'en', { numeric: true }) ||
    a.id.localeCompare(b.id)
  );
}

export function parseDate(d: string) {
  const [y, m, day] = d.split('-').map((x) => parseInt(x, 10));
  return { y, m, day };
}
export const epLabel = (e: Ep) => [e.data.oznaczenie, e.data.tytul].filter(Boolean).join(' — ');
/** Adres epizodu: z pola „Identyfikator” (np. ep-003), a gdy puste lub zdublowane — z nazwy pliku. */
const slugCache = new WeakMap<object, string>();
export function epSlug(e: Ep): string {
  return slugCache.get(e) ?? e.id;
}
export const epUrl = (e: Ep) => url(`kronika/${epSlug(e)}/`);
export const paragraphs = (t: string) => (t || '').split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);

export const STATUS: Record<string, string> = { zyje: 'Żyje', 'nie-zyje': 'Nie żyje', nieznany: 'Los nieznany' };
