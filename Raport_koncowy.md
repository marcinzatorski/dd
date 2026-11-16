# Dungeons and Dwarves — raport końcowy wdrożenia

Data: 16.11.2026

## Adresy

| | |
|---|---|
| Strona publiczna | https://marcinzatorski.github.io/dd/ |
| Repozytorium | https://github.com/marcinzatorski/dd |
| CMS | https://app.pagescms.org/ → repozytorium `marcinzatorski/dd` |
| Publikacje (Actions) | https://github.com/marcinzatorski/dd/actions |

## Technologia

Astro 5 (strona statyczna) · Pages CMS (edycja treści w repozytorium) · GitHub Pages + GitHub Actions (automatyczna publikacja po każdym zapisie). Bez serwera, bazy danych i płatnych usług.

## Zaimportowane treści (jednorazowo z `Dane_Poczatkowe.xlsx` i plików Word)

- 3 epizody: Prolog — Dwa serca, jeden los · Epizod I — Pod obcymi gwiazdami · Epizod II — Znak trzech szponów (pełne teksty z DOCX, z kursywą i separatorami scen), każdy z ilustracją.
- 3 bohaterów (Amboß, Karvuß, Gooryg) z portretami i biografiami.
- 16 NPC (w tym połączony wpis „Wojmir i Dobrochna”), 9 miejsc, 5 odkryć, 5 kluczowych wydarzeń.
- 37 powiązań epizod → NPC / miejsce / odkrycie / wydarzenie (zapisane wyłącznie w epizodach).
- Mapa świata, logotyp (wersja z przezroczystym tłem z mockupu HTML), kamienny herb, placeholdery „Wizerunek nieznany” i „Miejsce znane z opowieści”.

## Testy akceptacyjne (wykonane rzeczywiście, przez Pages CMS w przeglądarce)

| Obszar | Test | Wynik |
|---|---|---|
| A. NPC | utworzenie NPC z wgraniem obrazu; edycja imienia, tytułu i opisu; podmiana obrazu (placeholder → prawdziwy portret); usunięcie | ✅ |
| A. Pozostałe kategorie | utworzenie i usunięcie: bohatera (z portretem i biografią), miejsca (z placeholderem z biblioteki), odkrycia (z typem i ilustracją), dwóch wydarzeń | ✅ |
| B. Epizody | utworzenie epizodu, wklejenie wieloakapitowej opowieści (kursywa/pogrubienie zachowane), ilustracja, automatyczna maska „malarska” na żywej stronie, edycja opowieści (dopisany akapit), usunięcie | ✅ |
| C. Powiązania | przypisanie NPC, miejsca, odkrycia i wydarzenia do epizodu; poprawne wyświetlanie w zakładkach i sekcjach; relacje odwrotne („Pojawia się w kronice”, link z osi czasu); usunięcie powiązania; usunięcie NPC wciąż przypisanego do epizodu → strona buduje się, brak zepsutych linków | ✅ |
| D. Oś czasu | nowe wydarzenia z pełną datą III Ery sortują się automatycznie (historyczne i z kroniki); zmiana daty „Klątwa i Krąg” z 20.10 na 29.10.3343 przesunęła wcześniejsze wydarzenia do „Historii świata” (wyświetlany sam rok), po czym przywrócono 20.10.3343 | ✅ |
| E. Obrazy | portrety NPC, placeholdery, podmiana placeholdera na portret, sepia dla zmarłych (Oren, Varrik), mapa i jej powiększenie, ilustracje epizodów z maską | ✅ |
| E. Mapa | podmiana mapy przez CMS, weryfikacja na stronie, przywrócenie oryginału | ✅ |
| F. Publikacja | każdy zapis w CMS → commit → workflow „Publikacja strony” → zmiana widoczna na żywej stronie (ok. 1,5 min) | ✅ |
| F. Inne repozytoria | aplikacja Pages CMS zainstalowana tylko dla repo `dd`; innych repozytoriów nie zmieniano | ✅ |
| Strona końcowa | 10 podstron = HTTP 200; 107 linków i obrazów wewnętrznych sprawdzonych — 0 błędów; brak linków do CMS na stronie publicznej | ✅ |
| Wygląd | zrzuty Full HD i mobilne (390 px): nagłówek, panel boczny, zakładki, karty, okna, oś czasu, menu mobilne | ✅ |

Wszystkie dane testowe (wpisy i 6 testowych obrazów) zostały usunięte; treść repozytorium odpowiada importowi początkowemu.

## Ustalenia i ograniczenia

1. **Zbyszko (npc-010)** — przekazany portret ma na obrazie podpis „War'en” (możliwy spoiler lub pomyłka). Na życzenie użytkownika ustawiony placeholder; obraz nie został umieszczony w repozytorium.
2. **Pergamin Orena (odk-001)** — plik identyczny z kamiennym herbem bohaterów; zaimportowany bez zmian.
3. **Data wyd-001** (16.05.3093) daje 250 lat przed 3343 r., a opisy mówią „ok. 280 lat temu” — nie korygowano.
4. Ilustracje Epizodu I i II to te same pliki co „Kamienny krąg” i „Stary Młyn” (zapisane jako osobne kopie, by zmiana jednej nie zmieniała drugiej).
5. **Pages CMS — wybór powiązań tuż po otwarciu formularza** może zostać nadpisany przez wczytujący się formularz. Wystarczy odczekać 2–3 s po otwarciu wpisu (opisane w instrukcji).
6. Pages CMS nadaje nowym plikom nazwy `RRRR-MM-DD-tytul.md`; adres epizodu na stronie tworzony jest z pola **Identyfikator** (np. `/dd/kronika/ep-003/`).
7. Repozytorium zostało przemianowane z `DD` na `dd` (zgodnie z wymaganym adresem `/dd/`).
8. Kolejne zapisy w krótkim odstępie: GitHub publikuje tylko najnowszy (pośrednie przebiegi są anulowane) — to zamierzone.
