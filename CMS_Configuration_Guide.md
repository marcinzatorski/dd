# Dungeons and Dwarves — przewodnik konfiguracji CMS

Dokument techniczny dla osoby (lub agenta AI), która ma utrzymywać, odtworzyć albo przenieść stronę.
Instrukcja dla redaktora (bez programowania) znajduje się w pliku `Instrukcja_uzytkownika.md`.

| Co | Gdzie |
|---|---|
| Strona publiczna | https://marcinzatorski.github.io/dd/ |
| Repozytorium | https://github.com/marcinzatorski/dd (gałąź `main`) |
| CMS | https://app.pagescms.org/ (logowanie kontem GitHub) |
| Publikacja | GitHub Actions → GitHub Pages (`.github/workflows/deploy.yml`) |

---

## 1. Jaki CMS i gdzie go znaleźć

Używamy **Pages CMS** (https://pagescms.org) — darmowej aplikacji, która edytuje pliki bezpośrednio w repozytorium GitHub.
Nie ma własnego serwera, bazy danych ani osobnego panelu administracyjnego. Na stronie publicznej **nie ma** żadnego linku do CMS.

Wejście: https://app.pagescms.org/ → „Sign in with GitHub” → wybierz repozytorium `marcinzatorski/dd` → gałąź `main`.

## 2. Połączenie CMS z repozytorium

- Pages CMS loguje się przez GitHub (OAuth) i działa na uprawnieniach Twojego konta GitHub.
- Przy pierwszym logowaniu Pages CMS prosi o instalację swojej aplikacji GitHub („Pages CMS”) — trzeba wskazać repozytorium `dd` (albo „All repositories”).
- Uprawnienia aplikacji można sprawdzić/zmienić w GitHub: **Settings → Applications → Installed GitHub Apps → Pages CMS → Configure**.
- Każdy zapis w CMS to zwykły commit w gałęzi `main`, podpisany Twoim kontem.

## 3. Pliki sterujące CMS

| Plik | Rola |
|---|---|
| `.pages.yml` | **Cała konfiguracja CMS**: kolekcje, pola, etykiety po polsku, biblioteka obrazów. |
| `src/content.config.ts` | Schemat danych po stronie strony (Astro) — musi odpowiadać polom w `.pages.yml`. |
| `src/lib/data.ts` | Wczytywanie treści, rozwiązywanie powiązań, relacje odwrotne, sortowanie osi czasu, adresy obrazów. |
| `.github/workflows/deploy.yml` | Automatyczna budowa i publikacja po każdym commicie w `main`. |
| `astro.config.mjs` | Adres strony (`site`) i ścieżka bazowa (`base: '/dd'`). |

Zmiana w `.pages.yml` działa w CMS od razu po commicie (odśwież aplikację).

## 4. Kolekcje i pola

Wszystkie wpisy to pliki Markdown z nagłówkiem YAML (`format: yaml-frontmatter`). Nazwa pliku = klucz wpisu (np. `npc-012.md`).

| Kolekcja (CMS) | Folder | Najważniejsze pola |
|---|---|---|
| Kronika — epizody | `src/content/epizody/` | `id`, `kolejnosc`, `oznaczenie`, `tytul`, `ilustracja`, `npc[]`, `miejsca[]`, `odkrycia[]`, `wydarzenia[]`, treść = **Opowieść** (rich-text, Markdown) |
| Bohaterowie | `src/content/bohaterowie/` | `id`, `imie`, `nazwisko`, `rod`, `klan`, `przydomek`, `kolejnosc`, `portret`, `krotki_opis`, treść = biografia |
| NPC | `src/content/npc/` | `id`, `imie`, `tytul`, `opis`, `portret` (wymagany), `status` (`zyje` / `nie-zyje` / `nieznany`) |
| Miejsca | `src/content/miejsca/` | `id`, `nazwa`, `region`, `ilustracja` (wymagana), `galeria[]`, treść = opis |
| Odkrycia | `src/content/odkrycia/` | `id`, `nazwa`, `typ` (Przedmiot/Artefakt/Dokument/Symbol/Inne), `ilustracja`, `opis` |
| Kluczowe wydarzenia | `src/content/wydarzenia/` | `id`, `tytul`, `podtytul`, `data` (RRRR-MM-DD, wymagana), `era` (domyślnie `III`), `opis`, `punkt_zerowy` |
| Mapa świata | `src/data/swiat.json` | `tytul`, `mapa`, `podpis` |

Uwagi:
- `id` to stały identyfikator z arkusza początkowego (np. `npc-012`). Nowe wpisy: nadawaj kolejne numery.
- Epizod pojawia się w menu KRONIKA, gdy plik istnieje. Kolejność = pole `kolejnosc`. Adres strony epizodu = pole `id` (np. `/dd/kronika/ep-003/`); gdy puste lub zdublowane — nazwa pliku.
- Pages CMS nadaje nowym plikom nazwy w formacie `RRRR-MM-DD-tytul.md` — to normalne; identyfikację zapewnia pole `id`.
- Status „Nie żyje” → portret wyświetlany w sepii (filtr CSS; oryginał bez zmian).
- Ilustracja epizodu dostaje „malarską” maskę krawędzi automatycznie (CSS `mask-image`, klasa `.painterly` w `src/styles/global.css`).

## 5. Powiązania

- **Jedyne źródło powiązań to epizod.** Pola `npc`, `miejsca`, `odkrycia`, `wydarzenia` w epizodzie są polami typu `reference` i przechowują ścieżki plików, np. `src/content/npc/npc-012.md`.
- Relacje odwrotne (np. „Pojawia się w kronice: Epizod II” na karcie NPC, link do epizodu w osi czasu) są **liczone przy budowie strony** w `src/lib/data.ts` — nigdzie nie są zapisywane drugi raz.
- Bohaterów nie przypisujemy do epizodów.
- Usunięcie wpisu, który jest gdzieś przypisany, **nie psuje strony**: brakujące odwołania są pomijane. Warto jednak usunąć je z epizodu (porządek w danych).
- Zmiana nazwy pliku wpisu (np. ręcznie w GitHub) zrywa powiązania z nim — trzeba je wtedy wybrać ponownie w epizodzie.

## 6. Obrazy

- Biblioteka obrazów CMS = folder `public/media/` (podfoldery: `epizody`, `bohaterowie`, `npc`, `miejsca`, `odkrycia`, `swiat`, `placeholdery`).
- W treści zapisywana jest ścieżka np. `/media/npc/npc-012-berrik-zeidler.png`; strona sama dodaje prefiks `/dd/`.
- Placeholdery (wybierane ręcznie): `placeholdery/wizerunek-nieznany.png` (NPC), `placeholdery/miejsce-znane-z-opowiesci.png` (miejsca).
- Oryginały są przechowywane bez zmian. Przy budowie skrypt `scripts/optimize-images.mjs` tworzy lżejsze kopie `*.w800.webp` i `*.w1600.webp` (tylko w opublikowanej wersji, nie w repo). Jeśli kopii brak, strona wraca do oryginału.
- Zalecane: JPG/PNG/WebP do ok. 5 MB; większe pliki spowalniają repozytorium.

## 7. Jak zapis w CMS publikuje stronę

1. „Save” w Pages CMS → commit w gałęzi `main`.
2. Commit uruchamia workflow **„Publikacja strony”** (`.github/workflows/deploy.yml`): `npm ci` → `npm run build` (Astro + optymalizacja obrazów) → wysyłka `dist/` na GitHub Pages.
3. Po ok. 1–3 minutach zmiana jest na https://marcinzatorski.github.io/dd/.
4. Postęp: https://github.com/marcinzatorski/dd/actions (zielony znaczek = opublikowano).

Ustawienie wymagane w repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## 8. Odtworzenie / ponowna konfiguracja CMS

- Jeśli CMS nie widzi repo: w GitHub zainstaluj/skonfiguruj aplikację **Pages CMS** dla repo `dd`, potem wyloguj się i zaloguj w app.pagescms.org.
- Jeśli CMS pokazuje błąd konfiguracji: plik `.pages.yml` ma błąd składni YAML. Przywróć wersję z kopii w folderze `WWW` lub z historii commitów (GitHub → plik → History).
- Kopia zapasowa całej konfiguracji i treści jest w folderze `WWW` (ten folder) — to pełny projekt.

## 9. Podłączenie do innego repozytorium

1. Utwórz nowe repo na GitHub i wgraj do niego całą zawartość folderu `WWW/site` (bez `node_modules` i `dist`).
2. W `astro.config.mjs` ustaw `site` (np. `https://NOWE-KONTO.github.io`) i `base` (np. `'/NOWE-REPO'`; dla repo `NOWE-KONTO.github.io` lub własnej domeny: `base: '/'`).
3. W nowym repo: **Settings → Pages → Source: GitHub Actions**.
4. W app.pagescms.org wybierz nowe repo (zainstaluj aplikację Pages CMS dla niego).
5. Wypchnij zmiany — workflow opublikuje stronę.

## 10. Przebudowa i ponowna publikacja z plików kopii

Wymagany Node.js 22 (lub nowszy LTS).

```bash
cd WWW/site
npm ci            # instaluje zależności z package-lock.json
npm run dev       # podgląd lokalny: http://localhost:4321/dd/
npm run build     # wynik w dist/
```

Gotowa, zbudowana strona z chwili przekazania jest też w `WWW/dist` (do podglądu lub awaryjnej publikacji — wymaga serwowania pod ścieżką `/dd/`).
Ręczna publikacja: GitHub → Actions → „Publikacja strony” → **Run workflow**.

---

## Rozwiązywanie problemów

| Objaw | Co zrobić |
|---|---|
| Nie mogę wejść do CMS / nie widzę repo | Zaloguj się w app.pagescms.org tym samym kontem GitHub, które ma dostęp do repo; sprawdź instalację aplikacji Pages CMS (sekcja 2). |
| CMS: „Invalid configuration” | Błąd w `.pages.yml` — przywróć poprzednią wersję (sekcja 8). |
| Zapisałem, a na stronie nic się nie zmieniło | Odczekaj 3 min i odśwież stronę z pominięciem pamięci (Ctrl+F5). Sprawdź zakładkę Actions — jeśli czerwony krzyżyk, otwórz log; najczęściej błąd danych (np. puste wymagane pole, zła data). Popraw wpis w CMS i zapisz ponownie. |
| Obraz się nie wyświetla | Sprawdź, czy w polu wybrano plik z biblioteki (ścieżka zaczyna się od `/media/`). Nazwy plików najlepiej bez spacji i polskich znaków (CMS zamienia je automatycznie). |
| Epizod nie pojawia się w menu | Sprawdź, czy wpis jest zapisany i ma `kolejnosc`; po publikacji odśwież stronę. |
| Wybrane powiązanie „zniknęło” po zapisie | Wybór zrobiony tuż po otwarciu formularza mógł zostać nadpisany przez jego wczytywanie. Otwórz epizod, odczekaj chwilę, wybierz ponownie i zapisz. |
| NPC/miejsce nie pokazuje się w epizodzie | Przypisz je w **epizodzie** (pola „NPC w epizodzie” / „Miejsca w epizodzie”), nie w karcie NPC. |
| Oś czasu w złej kolejności | Sprawdź pełną datę i erę wydarzenia; „Klątwa i Krąg” musi mieć zaznaczone „Wydarzenie zerowe” (tylko jedno wydarzenie). |
| Workflow: błąd „Pages not enabled” | Settings → Pages → Source: GitHub Actions. |
