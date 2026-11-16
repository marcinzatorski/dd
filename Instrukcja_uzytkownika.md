# Dungeons and Dwarves — instrukcja dla Kronikarza

Jak dodawać i poprawiać treści na stronie **https://marcinzatorski.github.io/dd/** bez programowania.

## 1. Wejście do CMS

1. Otwórz **https://app.pagescms.org/** i kliknij **Sign in with GitHub** (konto `marcinzatorski`).
2. Wybierz repozytorium **marcinzatorski/dd** (gałąź `main`).
3. Po lewej zobaczysz sekcje: *Kronika — epizody, Bohaterowie, NPC, Miejsca, Odkrycia, Kluczowe wydarzenia, Mapa świata* oraz *Media* (biblioteka obrazów).

Na samej stronie kroniki nie ma żadnego przycisku do CMS — to celowe.

## 2. Nowy epizod

1. **Kronika — epizody → Add an entry** (Dodaj wpis).
2. Wypełnij:
   - **Identyfikator** — np. `ep-003` (małe litery, cyfry, łącznik; potem go nie zmieniaj),
   - **Kolejność w kronice** — np. `3`,
   - **Oznaczenie** — np. `Epizod III`,
   - **Tytuł** — np. `Cień nad Ostrowinem`.
3. **Opowieść** — skopiuj cały tekst z Worda (Ctrl+A, Ctrl+C) i wklej w pole (Ctrl+V). Akapity zostaną zachowane. Separator sceny: osobny akapit `***`.
4. (Opcjonalnie) **Ilustracja główna** — patrz punkt 4. Miękką „malarską” krawędź strona doda sama.
5. Przypisz postacie, miejsca itd. — punkt 5.
6. Kliknij **Save**. Epizod pojawi się w menu KRONIKA po ok. 1–3 minutach.

## 3. Wklejanie opowieści — wskazówki

- Wklejaj zwykły tekst/tekst z Worda; pogrubienia i kursywy zostaną zachowane.
- Nie wklejaj tytułu epizodu do treści — tytuł pokazuje się automatycznie.
- Przełącznik edytora (Editor/Source) pozwala zobaczyć tekst w formacie Markdown — zwykle niepotrzebny.

## 4. Dodanie lub wymiana ilustracji

1. Kliknij pole obrazu (np. **Portret**, **Ilustracja główna**, **Mapa**).
2. Wybierz istniejący plik z biblioteki albo **Upload** i wskaż plik z komputera (JPG/PNG/WebP, najlepiej do 5 MB).
3. Aby **wymienić** obraz — wybierz w tym samym polu inny plik.
4. **Save**.

Placeholdery (wybierasz ręcznie z biblioteki, folder `placeholdery`):
- **wizerunek-nieznany.png** — NPC bez znanego wizerunku,
- **miejsce-znane-z-opowiesci.png** — miejsca znane tylko z opowieści.

Gdy pojawi się prawdziwy portret, po prostu wybierz go w polu zamiast placeholdera.

## 5. Powiązania (NPC, Miejsca, Odkrycia, Wydarzenia)

Powiązania ustawia się **tylko w epizodzie**:
1. Otwórz epizod.
2. W polach **NPC w epizodzie**, **Miejsca w epizodzie**, **Odkrycia w epizodzie**, **Kluczowe wydarzenia w epizodzie** zacznij pisać nazwę i wybierz wpis z listy (można wybrać wiele).
3. Aby usunąć powiązanie — kliknij ✕ przy nazwie.
4. **Save**.

Strona sama doda np. na karcie NPC informację „Pojawia się w kronice: Epizod II”. Najpierw musi istnieć wpis (np. nowy NPC) — dopiero wtedy da się go wybrać w epizodzie.

## 6. Edycja wpisów

Wejdź do sekcji (np. **NPC**), kliknij wpis, popraw pola, **Save**.
- **Status** NPC: *Żyje / Nie żyje / Los nieznany*. Dla „Nie żyje” portret pokaże się w sepii.
- **Kluczowe wydarzenia**: zawsze podaj **pełną datę** (dzień, miesiąc, rok) i **Erę**. Kolejność na osi czasu ustawia się sama. Pole **Wydarzenie zerowe** zaznaczone jest tylko dla „Klątwa i Krąg” — zmiana jego daty automatycznie przesunie podział osi czasu.

## 7. Usuwanie wpisów

W liście wpisów kliknij menu „⋯” przy wpisie → **Delete** i potwierdź. Strona nie zepsuje się, nawet jeśli wpis był przypisany do epizodu — warto jednak usunąć go też z pól powiązań w epizodzie.

## 8. Wymiana mapy świata

**Mapa świata** → pole **Mapa** → wybierz/wgraj nowy plik → **Save**. Mapa pojawia się po kliknięciu nagłówka **ŚWIAT** w menu strony.

## 9. Jak sprawdzić, że zmiany są opublikowane

1. Po zapisie odczekaj 1–3 minuty.
2. Otwórz stronę i odśwież ją (**Ctrl+F5**).
3. Postęp publikacji: **https://github.com/marcinzatorski/dd/actions** — żółte kółko = trwa, zielony ✓ = opublikowano, czerwony ✗ = błąd (zwykle brak wymaganego pola lub błędna data — popraw wpis i zapisz ponownie).
