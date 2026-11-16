import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const md = (dir: string) => glob({ pattern: '**/*.md', base: `./src/content/${dir}` });
const str = z.string().nullish().transform((v) => (v ?? '').toString());
const refs = z.array(z.string()).nullish().transform((v) => (v ?? []).filter(Boolean));
// Pola daty mogą przyjść jako tekst „RRRR-MM-DD” albo jako obiekt Date (YAML).
const date = z.union([z.string(), z.date()]).transform((v) =>
  typeof v === 'string' ? v.slice(0, 10) : v.toISOString().slice(0, 10)
);

export const collections = {
  epizody: defineCollection({
    loader: md('epizody'),
    schema: z.object({
      id: str, kolejnosc: z.coerce.number().default(999), oznaczenie: str, tytul: str,
      ilustracja: str, npc: refs, miejsca: refs, odkrycia: refs, wydarzenia: refs,
    }),
  }),
  bohaterowie: defineCollection({
    loader: md('bohaterowie'),
    schema: z.object({
      id: str, imie: z.string(), nazwisko: str, rod: str, klan: str, przydomek: str,
      kolejnosc: z.coerce.number().default(999), portret: str, krotki_opis: str,
    }),
  }),
  npc: defineCollection({
    loader: md('npc'),
    schema: z.object({
      id: str, imie: z.string(), tytul: str, opis: str, portret: str,
      status: z.string().nullish().transform((v) => v || 'nieznany'),
    }),
  }),
  miejsca: defineCollection({
    loader: md('miejsca'),
    schema: z.object({
      id: str, nazwa: z.string(), region: str, ilustracja: str,
      galeria: z.array(z.string()).nullish().transform((v) => (v ?? []).filter(Boolean)),
    }),
  }),
  odkrycia: defineCollection({
    loader: md('odkrycia'),
    schema: z.object({ id: str, nazwa: z.string(), typ: str, ilustracja: str, opis: str }),
  }),
  wydarzenia: defineCollection({
    loader: md('wydarzenia'),
    schema: z.object({
      id: str, tytul: z.string(), podtytul: str, era: z.coerce.string().default('III'),
      data: date, opis: str, punkt_zerowy: z.preprocess((v) => v === true || v === 'true' || v === 'TAK', z.boolean()),
    }),
  }),
};
