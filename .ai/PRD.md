# MyDiet - Product Requirements Document (PRD)

**Version:** 1.0 MVP  
**Date:** 15 May 2026  
**Owner:** Nikola Dłubacz  
**Status:** Ready for Development

---

## 1. Executive Summary

**MyDiet** to prywatna mobilna aplikacja na iPhone dla dwuosobowego gospodarstwa domowego, której celem jest uproszczenie planowania tygodniowych posiłków i automatyzacja generowania listy zakupów. Aplikacja łączy w jednym miejscu bazę przepisów od dietetyka, wspólny plan żywieniowy oraz synchronizowaną w czasie rzeczywistym listę zakupów.

**Kluczowa wartość MVP:** Użytkownicy mogą w ciągu kilku minut zaplanować posiłki na cały tydzień dla dwóch osób i automatycznie wygenerować praktyczną listę zakupów z posortowanymi składnikami.

---

## 2. Problem Statement

### Problem użytkownika

Para mieszkająca wspólnie potrzebuje narzędzia do:

- Organizacji tygodniowego planu posiłków dla obu osób
- Unikania codziennego pytania "co dziś na obiad?"
- Efektywnego robienia zakupów bez zapominania składników
- Śledzenia przepisów z planu dietetyka w jednym miejscu
- Synchronizacji planów i listy zakupów między urządzeniami

### Obecne rozwiązania i ich wady

- Notatki papierowe - brak synchronizacji, łatwo zgubić
- Listy w Notes/Keep - brak powiązania z przepisami, ręczne sumowanie składników
- Pliki PDF od dietetyka - niewygodne do codziennego używania
- Aplikacje meal planning - zbyt skomplikowane, płatne, dla szerokiego grona użytkowników

---

## 3. Goals & Success Metrics

### Cele biznesowe

- ✅ Stworzenie funkcjonalnej aplikacji do użytku prywatnego dla 2 osób
- ✅ Zero kosztów operacyjnych (darmowy hosting, Firebase Spark Plan)
- ✅ Prostota w utrzymaniu (solo development, frontend only)

### Kryteria sukcesu MVP

Aplikacja jest uznana za sukces gdy użytkownicy mogą:

1. **Zaplanować tydzień:** Dodać 5+ przepisów na różne dni w ciągu 5-10 minut
2. **Wygenerować listę zakupów:** Z dowolnie wybranych dni (np. pon-śr) z poprawnie zsumowanymi składnikami
3. **Synchronizacja działa:** Oba urządzenia widzą te same dane realtime, odznaczenie produktu na liście przez jedną osobę jest widoczne u drugiej

### Metryki (opcjonalne dla prywatnej aplikacji)

- Średni czas od otwarcia aplikacji do dodania pierwszego przepisu < 30s
- Liczba przepisów używanych w typowym tygodniu: 7-15
- Frequency of use: minimum 2x tygodniowo (planowanie + zakupy)

---

## 4. Target Users

### Primary Users

- **User A:** Główny użytkownik, tworzy gospodarstwo, zarządza swoim planem
- **User B:** Drugi użytkownik, dołącza przez zaproszenie, zarządza swoim planem
- **Wspólne:** Oboje widzą wzajemne plany, korzystają ze wspólnej listy zakupów

### User Personas

**Persona: "Planująca para"**

- Wiek: 25-35
- Potrzeby: Zorganizowane posiłki, zdrowe odżywianie, efektywne zakupy
- Zachowania: Robi zakupy 1-2x w tygodniu, planuje z wyprzedzeniem
- Tech savvy: Średni-wysoki poziom, wygodnie czują się z aplikacjami mobilnymi
- Pain point: Chaos w planowaniu co gotować, zapominanie składników

---

## 5. Core Features & Requirements

### 5.1 Onboarding & Authentication

**Uproszczone logowanie bez rejestracji**

- Przy pierwszym uruchomieniu użytkownik wpisuje swoje imię (pole tekstowe)
- System generuje unikalny kod gospodarstwa domowego (6-8 znaków)
- Użytkownik może dodać drugą osobę: wprowadza jej imię
- Generuje się link zaproszenia (deep link)
- Partner klika link → widzi ekran "Dołącz do gospodarstwa [Nazwa]" → wybiera swoje imię z listy → dostęp do wspólnego planu
- Identyfikacja: lokalne ID urządzenia + kod gospodarstwa w Firebase
- **Limit:** Maksymalnie 2 użytkowników w gospodarstwie

**Acceptance Criteria:**

- ✅ Użytkownik może utworzyć gospodarstwo w <30s
- ✅ Link zaproszenia działa na innym urządzeniu iOS
- ✅ Po dołączeniu oba urządzenia widzą te same dane

---

### 5.2 Nawigacja główna

**Bottom Navigation Bar (3 główne ekrany):**

1. **📅 Plan** - Tygodniowy plan posiłków
2. **📖 Przepisy** - Przeglądanie i wyszukiwanie przepisów
3. **🛒 Lista zakupów** - Checklist do zakupów

**⚙️ Ustawienia** - Ikona w prawym górnym rogu (dostępna z każdego ekranu), zawiera:

- Zarządzanie gospodarstwem (nazwa, użytkownicy, kod zaproszenia)
- Opcja: Reset/Clear data (dla testów)

---

### 5.3 Ekran "Plan" - Szczegółowa specyfikacja

#### Layout strukturalny

```
┌─────────────────────────────────────────┐
│ ┌────────────────────────────────────┐  │
│ │ [ Ty | Oboje | Partner ]      ⚙️  │  │ ← Segmented control + settings
│ └────────────────────────────────────┘  │
├─────────────────────────────────────────┤
│ ┌────────────────────────────────────┐  │
│ │[Pon 12][Wt 13][Śr 14: Dziś][Czw 15]│  │ ← Karuzela dni
│ └────────────────────────────────────┘  │
├─────────────────────────────────────────┤
│                                         │
│         [Główny obszar treści]          │
│                                         │
│                                         │
└─────────────────────────────────────────┘
│ [ 📅 Plan | 📖 Przepisy | 🛒 Lista ]   │ ← Bottom nav
└─────────────────────────────────────────┘
```

#### Tryby widoku (Segmented Control)

**1. Widok "Ty"**

- Pokazuje tylko posiłki zaplanowane dla User A
- Pełna funkcjonalność edycji (dodawanie, usuwanie, edycja)
- Layout: Pionowa lista 5 slotów na wybrany dzień

**2. Widok "Oboje" (domyślny)**

- Ekran podzielony pionowo na pół
- Lewa połowa: "TY" (nagłówek + posiłki User A)
- Prawa połowa: "PARTNER" (nagłówek + posiłki User B)
- **Read-only mode** - brak edycji, tylko podgląd
- Cel: Szybkie zobaczenie co każdy ma zaplanowane na dany dzień

**3. Widok "Partner"**

- Pokazuje tylko posiłki zaplanowane dla User B
- Pełna funkcjonalność edycji

#### Karuzela dni

- Wyświetla 7 dni (cały tydzień) jako poziomy scroll
- Domyślnie zaznaczony: dzień dzisiejszy
- Format: "Pon 12 | Wt 13 | Śr 14: Dziś | Czw 15..."
- Dzień "dziś" wizualnie wyróżniony (inny kolor/bold)
- **Interakcje:**
  - Swipe lewo/prawo na głównym ekranie → zmiana dnia
  - Tap na mini dzień w karuzeli → przejście do tego dnia
- Można scrollować do przyszłych tygodni (nie ma ograniczenia)
- Przeszłe dni pozostają dostępne tylko do odczytu (opcjonalnie: można je nadal edytować w MVP dla elastyczności)

#### Sloty posiłków (5 na dzień)

Stałe, predefiniowane nazwy:

1. **Śniadanie**
2. **II Śniadanie**
3. **Obiad**
4. **Podwieczorek**
5. **Kolacja**

#### Karta przepisu w slocie

**Stan: Pusty slot**

```
┌─────────────────────────┐
│                         │
│    + Dodaj posiłek      │
│                         │
└─────────────────────────┘
```

- Tap → otwiera ekran/modal Przepisów

**Stan: Zwinięta karta (domyślny)**

```
┌─────────────────────────────────┐
│ 🍗 Kurczak z ryżem              │ ← Nazwa (opcjonalne emoji/ikona)
│                                 │
│ Składniki:                      │
│ • Kurczak 200g                  │
│ • Ryż biały 100g                │
│ • Marchew 50g                   │
│ • Cebula 30g                    │
│ • Olej 10ml                     │
│                                 │
│ 450 kcal | 2 porcje | 25 min   │ ← Mini info
└─────────────────────────────────┘
```

- Tap → rozwija kartę

**Stan: Rozwinięta karta**

```
┌─────────────────────────────────────┐
│ 🍗 Kurczak z ryżem                  │
│                                     │
│ Składniki (2 porcje):               │
│ • Kurczak (Mięso) 200g              │
│ • Ryż biały (Artykuły suche) 100g   │
│ • Marchew (Warzywa) 50g             │
│ • Cebula (Warzywa) 30g              │
│ • Olej (Przyprawy) 10ml             │
│                                     │
│ Instrukcje:                         │
│ 1. Pokrój kurczaka na kawałki       │
│ 2. Ugotuj ryż według instrukcji...  │
│ 3. Podsmaż cebulę i marchew...      │
│ 4. Dodaj kurczaka, smaż 10 min...   │
│                                     │
│ 📊 Makroskładniki (na porcję):     │
│ Kalorie: 450 kcal                   │
│ Białko: 35g | Tłuszcze: 12g         │
│ Węglowodany: 48g                    │
│                                     │
│ ⏱️ Czas przygotowania: 25 min      │
│                                     │
│ [ Edytuj porcje ]  [ Usuń ]         │ ← Akcje
└─────────────────────────────────────┘
```

- Tap ponownie → zwija kartę
- "Edytuj porcje" → modal z stepper/input
- "Usuń" → confirmation + usunięcie z planu

#### Widok "Oboje" - szczegóły podzielonego ekranu

```
┌──────────────────┬──────────────────┐
│       TY         │     PARTNER      │ ← Nagłówki
├──────────────────┼──────────────────┤
│ Śniadanie        │ Śniadanie        │
│ ┌──────────────┐ │ ┌──────────────┐ │
│ │ Jajecznica   │ │ │ Owsianka     │ │
│ │ • Jajka 3szt │ │ │ • Płatki 60g │ │
│ │ • Masło 10g  │ │ │ • Mleko 200ml│ │
│ │ 320 kcal     │ │ │ 280 kcal     │ │
│ └──────────────┘ │ └──────────────┘ │
│                  │                  │
│ II Śniadanie     │ II Śniadanie     │
│ [+ Dodaj]        │ [+ Dodaj]        │
│                  │                  │
│ Obiad            │ Obiad            │
│ ┌──────────────┐ │ ┌──────────────┐ │
│ │ Kurczak 200g │ │ │ Kurczak 120g │ │ ← Ten sam przepis
│ │ • Ryż 100g   │ │ │ • Ryż 60g    │ │   różne porcje
│ │ ...          │ │ │ ...          │ │
│ └──────────────┘ │ └──────────────┘ │
│                  │                  │
│ ... (pozostałe sloty)              │
└──────────────────┴──────────────────┘
```

**Funkcjonalność:**

- **Read-only:** Tap na kartę → rozwija/zwija, ale brak przycisków edycji/usuwania
- Wzualne rozróżnienie: jeśli obie osoby mają ten sam przepis, można użyć tej samej kolorystyki/borderu (nice to have)
- Jeśli różne porcje tego samego przepisu, składniki pokazują różne ilości

**Acceptance Criteria:**

- ✅ Przełączanie między 3 trybami jest płynne (<200ms)
- ✅ Karuzela dni działa swipe i tap
- ✅ Puste sloty mają CTA "Dodaj posiłek"
- ✅ Karta rozwija się/zwija płynnie z animacją
- ✅ W widoku "Oboje" nie ma przycisków edycji
- ✅ Wszystkie zmiany synchronizują się między urządzeniami <2s

---

### 5.4 Dodawanie przepisu do planu - User Flow

**Flow:**

1. Użytkownik w trybie "Ty" lub "Partner" (nie w "Oboje")
2. Tap na pusty slot LUB przycisk "+" w karcie
3. → Otwiera się modal/nawigacja do ekranu **Przepisy** (pełny ekran)
4. Użytkownik przegląda przepisy, używa search lub filtrów
5. Tap na kartę przepisu → Otwiera się **modal szczegółów przepisu**
6. Modal zawiera:
   - Pełny opis przepisu (składniki, instrukcje, makros)
   - **"Liczba porcji:"** Stepper/input (domyślnie wartość bazowa z przepisu, np. "2")
   - Przycisk **"Dodaj do planu"**
7. Tap "Dodaj do planu" → Modal zamyka się, przepis pojawia się w wybranym slocie
8. Użytkownik wraca do ekranu Plan automatycznie

**Automatyczne przypisanie:** Przepis jest dodawany dla aktualnie wybranej osoby (tryb "Ty" = dla Ciebie, tryb "Partner" = dla partnera)

**Edycja istniejącego posiłku:**

1. Tap na kartę → rozwinięcie
2. Przycisk "Edytuj porcje" → Modal z:
   - Nazwa przepisu
   - Stepper do zmiany liczby porcji
   - Podgląd: "Składniki dla X porcji:" (realtime update ilości)
   - "Zapisz" / "Anuluj"
3. "Zapisz" → Karta aktualizuje się z nowymi ilościami

**Usuwanie:**

1. Tap na kartę → rozwinięcie
2. Przycisk "Usuń" → Alert confirmation "Usunąć [nazwa przepisu] z planu?" [Anuluj | Usuń]
3. "Usuń" → Karta znika, slot wraca do stanu pustego

**Acceptance Criteria:**

- ✅ Dodanie przepisu zajmuje <15s (od tap na slot do pojawienia się w planie)
- ✅ Edycja porcji automatycznie przelicza wszystkie składniki proporcjonalnie
- ✅ Usunięcie wymaga confirmation (zapobiega przypadkowemu usunięciu)
- ✅ Po dodaniu/edycji/usunięciu, dane synchronizują się na drugie urządzenie

---

### 5.5 Ekran "Przepisy"

#### Layout

```
┌─────────────────────────────────────┐
│ 🔍 Szukaj przepisu...          🔧   │ ← Search bar + filter icon
├─────────────────────────────────────┤
│ [ Wszystkie | Śniadania | Obiady |  │ ← Filter tabs (horizontal scroll)
│   Kolacje | Przekąski ]             │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 📷 [Zdjęcie opcjonalne]         │ │
│ │ Kurczak z ryżem                 │ │ ← Karta przepisu
│ │ 450 kcal | 25 min | 2 porcje    │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 📷                              │ │
│ │ Owsianka z owocami              │ │
│ │ 280 kcal | 10 min | 1 porcja    │ │
│ └─────────────────────────────────┘ │
│ ...                                 │
│                                     │
└─────────────────────────────────────┘
│ [ 📅 Plan | 📖 Przepisy | 🛒 Lista ]│
└─────────────────────────────────────┘
```

#### Funkcjonalność

**Search bar:**

- Filtruje po nazwie przepisu w czasie rzeczywistym (case-insensitive)
- Przykład: wpisanie "kurczak" → pokazuje tylko przepisy z "kurczak" w nazwie

**Filter tabs:**

- **Wszystkie** (domyślny) - pokazuje wszystkie przepisy
- **Śniadania** - tylko przepisy kategorii "breakfast"
- **Obiady** - kategoria "lunch"
- **Kolacje** - kategoria "dinner"
- **Przekąski** - kategoria "snack"

**Ważne:** Przepis może należeć do wielu kategorii jednocześnie (np. kanapki = śniadanie + kolacja)

**Karta przepisu (lista):**

- Opcjonalne zdjęcie (jeśli brak, placeholder ikona/emoji)
- Nazwa przepisu (max 2 linie)
- Mini info: Kalorie | Czas | Liczba porcji
- Tap → Otwiera modal szczegółów przepisu

**Modal szczegółów przepisu:**
(Ten sam co w flow dodawania do planu)

- Scroll view z pełnymi szczegółami
- Przycisk **"Dodaj do planu"** (sticky bottom)
- Po kliknięciu → użytkownik wraca do ekranu Plan, przepis pojawia się w ostatnio wybranym slocie/dniu

**Acceptance Criteria:**

- ✅ Lista przepisów ładuje się <1s
- ✅ Search działa realtime (filtruje podczas pisania)
- ✅ Filtry działają natychmiast po kliknięciu
- ✅ Przepisy z wieloma kategoriami pokazują się we wszystkich odpowiednich filtrach
- ✅ Modal szczegółów ma płynną animację otwarcia/zamknięcia

---

### 5.6 Ekran "Lista zakupów"

#### Generowanie listy

**Proces:**

1. Użytkownik otwiera ekran "Lista zakupów"
2. Jeśli lista nie istnieje lub jest pusta → Widzi ekran onboarding:
   ```
   ┌─────────────────────────────────┐
   │                                 │
   │     🛒                          │
   │                                 │
   │  Wybierz dni aby wygenerować    │
   │  listę zakupów                  │
   │                                 │
   │  [ Generuj listę ]              │
   │                                 │
   └─────────────────────────────────┘
   ```
3. Tap "Generuj listę" → Otwiera się **modal wyboru dni:**
   ```
   ┌─────────────────────────────────┐
   │  Wybierz dni:                   │
   │                                 │
   │  ☐ Poniedziałek 12 maja         │
   │  ☐ Wtorek 13 maja               │
   │  ☑ Środa 14 maja                │
   │  ☑ Czwartek 15 maja             │
   │  ☑ Piątek 16 maja               │
   │  ☐ Sobota 17 maja               │
   │  ☐ Niedziela 18 maja            │
   │                                 │
   │  [ Anuluj ]    [ Generuj ]      │
   └─────────────────────────────────┘
   ```
4. Użytkownik zaznacza checkboxy dni, które chce uwzględnić
5. Tap "Generuj" → System:
   - Zbiera wszystkie przepisy z zaznaczonych dni (obu użytkowników)
   - Sumuje powtarzające się składniki (np. kurczak 200g + 120g = 320g)
   - Grupuje składniki w kategorie
   - Generuje listę
6. Modal zamyka się, pokazuje się wygenerowana lista

**Ponowne generowanie:**

- Przycisk **"⚙️ Regeneruj"** w prawym górnym rogu ekranu listy
- Tap → Ten sam modal wyboru dni
- **Ważne:** Re-generacja **zastępuje** poprzednią listę całkowicie (nie dopisuje)

#### Layout listy zakupów

```
┌─────────────────────────────────────┐
│ Lista zakupów ⚙️ Regen              │
├─────────────────────────────────────┤
│                                     │
│ ☐ Cebula 80g 🥬                     │ ← Unchecked (górna sekcja)
│ ☐ Marchew 150g 🥬                   │
│ ☐ Pomidory 200g 🥬                  │
│ ☐ Chleb razowy 1szt 🥖              │
│ ☐ Jajka 6szt 🥛                     │
│ ☐ Mleko 400ml 🥛                    │
│ ☐ Kurczak 320g 🍗                   │
│ ☐ Łosoś 250g 🍗                     │
│ ☐ Olej 10ml 🧂                      │
│                                     │
│ ─────────────────────────────────   │ ← Separator
│                                     │
│ ☑ Masło 200g 🥛                     │ ← Checked (dolna sekcja)
│ ☑ Ryż 150g 🌾                       │
│                                     │
└─────────────────────────────────────┘

```

#### Funkcjonalność listy

**Interakcje:**

- **Tap na checkbox** → Składnik przesuw się z animacją **na dół listy** (sekcja checked)
- **Tap na checked item** → Uncheck → item wraca z animacją **na górę listy** (sekcja unchecked)
- **Synchronizacja realtime:** Przesunięcie przez jednego użytkownika widoczne u drugiego <1s

**Sortowanie:**

- **Sekcja unchecked (góra):** Sortowanie niejawne po kategorii (wszystkie warzywa, potem pieczywo, nabiał, mięso...) + alfabetycznie w ramach kategorii
- **Separator:** Cienka linia/odstęp wizualny między unchecked a checked
- **Sekcja checked (dół):** Sortowanie niejawne po kategorii + alfabetycznie w ramach kategorii
- **Ikona kategorii:** Po prawej stronie każdego składnika - emoji wskazujące typ (🥬🥖🥛🍗🧊🌾🧂)

**Kolejność kategorii (niejawna, bez nagłówków):**

1. Warzywa i owoce (🥬)
2. Pieczywo (🥖)
3. Nabiał i jajka (🥛)
4. Mięso i ryby (🍗)
5. Mrożonki (🧊)
6. Artykuły suche (🌾)
7. Przyprawy i dodatki (🧂)

**Acceptance Criteria:**

- ✅ Generowanie listy dla 3 dni z ~10 przepisami trwa <2s
- ✅ Powtarzające się składniki są poprawnie zsumowane (suma ilości)
- ✅ Składniki są sortowane po kategorii (bez nagłówków kategorii)
- ✅ Każdy składnik ma ikonę kategorii po prawej stronie
- ✅ Odznaczenie składnika przenosi go na dół listy z płynną animacją
- ✅ Checked items są wizualnie wyróżnione (strikethrough + szary kolor)
- ✅ Odznaczenie synchronizuje się <1s na drugie urządzenie
- ✅ Re-generacja zastępuje starą listę (nie duplikuje)

---

### 5.7 Ekran "Ustawienia"

**Dostęp:** Ikona ⚙️ w prawym górnym rogu (dostępna na każdym ekranie)

**Zawartość:**

```
┌─────────────────────────────────────┐
│ ← Ustawienia                        │
├─────────────────────────────────────┤
│                                     │
│ GOSPODARSTWO DOMOWE                 │
│ Nazwa: "Dom Nikola & Partner"       │
│ Kod: XY8K2P                         │
│ [ Skopiuj kod zaproszenia ]         │
│                                     │
│ UŻYTKOWNICY                         │
│ 👤 Nikola (Ty)                      │
│ 👤 Partner                          │
│                                     │
│ --- Separator ---                   │
│                                     │
│ O APLIKACJI                         │
│ Wersja: 1.0.0 MVP                   │
│                                     │
│ ZAAWANSOWANE (Dev only)             │
│ [ Wyczyść wszystkie dane ]          │ ← Wymaga confirmation
│                                     │
└─────────────────────────────────────┘
```

**Funkcjonalność:**

- **"Skopiuj kod zaproszenia"** → Kopiuje link zaproszenia do clipboard + komunikat "Link skopiowany!"
- **"Wyczyść dane"** → Alert confirmation → Usuwa wszystkie dane lokalnie i z Firebase (reset do stanu początkowego)

---

## 6. Technical Architecture

### 6.1 Tech Stack

**Frontend:**

- **Framework:** React Native + Expo
- **Język:** TypeScript
- **Styling:** NativeWind v4+ (Tailwind CSS dla React Native)
- **Nawigacja:** Expo Router v3.x (filesystem-based routing)
  - Layout-based navigation z automatycznym Bottom Tab
  - Type-safe routing z parametrami
  - Deep linking out-of-the-box
- **State Management:** Zustand v4.5.x
  - Lightweight, bez boilerplate
  - Persist middleware dla offline support
  - DevTools integration
- **Data Fetching & Caching:** TanStack Query (React Query) v5.x
  - Automatyczny cache i refetch dla Firebase
  - Optimistic updates
  - Offline queue dla mutations
- **Animacje:** React Native Reanimated v3.10+
  - 60fps+ animacje na native thread
  - Gesture Handler integration
- **Storage:** React Native MMKV v2.x
  - 100x szybszy niż AsyncStorage
  - Synchronous API
  - Zustand persist middleware compatible
- **Walidacja:** Zod v3.22+
  - Runtime schema validation
  - Type inference dla TypeScript
  - Walidacja JSON recipes i Firebase data
- **Formularze:** React Hook Form v7.x
  - Lightweight, uncontrolled forms
  - Integracja z Zod dla validation

**Backend & Database:**

- **Firebase Firestore:** NoSQL database do przechowywania danych
- **Firebase Authentication:** Anonymous auth lub custom token auth (bez email/password)
- **Firebase Hosting:** (opcjonalnie dla configuration/assets)
- **Plan:** Spark (Free) - 1GB storage, 50k reads/day, 20k writes/day

**Development Tools:**

- **Expo CLI + EAS Build:** Development, build i deployment
- **TypeScript ESLint + Prettier:** Code quality i formatting
- **iOS only** w MVP - brak kodu Android-specific

### 6.2 Data Models

#### Collection: `households`

```typescript
interface Household {
  id: string; // Auto-generated
  name: string; // "Dom Nikola & Partner"
  inviteCode: string; // "XY8K2P" - unikalny 6-char kod
  createdAt: Timestamp;
  users: {
    [userId: string]: {
      name: string; // "Nikola" lub "Partner"
      deviceId: string; // Unique device identifier
      joinedAt: Timestamp;
    };
  };
  maxUsers: 2; // Hard limit
}
```

#### Collection: `mealPlans`

```typescript
interface MealPlan {
  id: string; // Format: "householdId_YYYY-MM-DD"
  householdId: string; // Reference do Household
  date: string; // "2026-05-15"
  meals: {
    [userId: string]: {
      // "user1" lub "user2"
      breakfast?: MealSlot;
      secondBreakfast?: MealSlot;
      lunch?: MealSlot;
      snack?: MealSlot;
      dinner?: MealSlot;
    };
  };
  updatedAt: Timestamp;
  updatedBy: string; // userId
}

interface MealSlot {
  recipeId: string; // ID przepisu
  servings: number; // Liczba porcji (może być decimal: 1.5)
  addedAt: Timestamp;
}
```

#### Collection: `recipes`

```typescript
interface Recipe {
  id: string; // Auto-generated lub custom
  name: string; // "Kurczak z ryżem"
  description?: string; // Krótki opis (opcjonalny)
  categories: MealCategory[]; // ["lunch", "dinner"]
  ingredients: Ingredient[];
  instructions: string[]; // Array kroków
  nutrition: {
    calories: number; // Na porcję
    protein: number; // g
    fats: number; // g
    carbs: number; // g
  };
  baseServings: number; // Domyślna liczba porcji (np. 2)
  prepTime?: number; // Minuty (opcjonalne)
  imageUrl?: string; // URL lub null
  createdAt: Timestamp;
}

type MealCategory = "breakfast" | "lunch" | "dinner" | "snack";

interface Ingredient {
  name: string; // "Kurczak"
  amount: number; // 200
  unit: string; // "g"
  category: IngredientCategory; // "meat"
}

type IngredientCategory =
  | "vegetables" // Warzywa i owoce
  | "bread" // Pieczywo
  | "dairy" // Nabiał i jajka
  | "meat" // Mięso i ryby
  | "frozen" // Mrożonki
  | "dry" // Artykuły suche
  | "spices"; // Przyprawy i dodatki
```

#### Collection: `shoppingLists`

```typescript
interface ShoppingList {
  id: string; // householdId (jeden na gospodarstwo)
  householdId: string;
  generatedFrom: {
    dates: string[]; // ["2026-05-13", "2026-05-14", "2026-05-15"]
    generatedAt: Timestamp;
  };
  items: {
    [category: string]: ShoppingItem[];
  };
  updatedAt: Timestamp;
}

interface ShoppingItem {
  name: string; // "Kurczak"
  totalAmount: number; // 320 (zsumowane)
  unit: string; // "g"
  checked: boolean; // false
  checkedBy?: string; // userId (kto odznaczył)
  checkedAt?: Timestamp;
}
```

### 6.3 Firebase Configuration

**Firestore Rules (Security):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Pomocnicza funkcja sprawdzająca czy user należy do gospodarstwa
    function isMemberOf(householdId) {
      let household = get(/databases/$(database)/documents/households/$(householdId));
      return request.auth.uid in household.data.users;
    }

    // Households - read/write tylko dla członków
    match /households/{householdId} {
      allow read, write: if isMemberOf(householdId);
    }

    // Meal Plans - read/write tylko dla członków gospodarstwa
    match /mealPlans/{planId} {
      allow read, write: if isMemberOf(resource.data.householdId);
    }

    // Recipes - read dla wszystkich (közna baza), write: false (static data)
    match /recipes/{recipeId} {
      allow read: if true;
      allow write: if false;  // Przepisy są statyczne, dodawane ręcznie
    }

    // Shopping Lists - read/write tylko dla członków
    match /shoppingLists/{listId} {
      allow read, write: if isMemberOf(resource.data.householdId);
    }
  }
}
```

**Offline Persistence:**

```typescript
import firestore from "@react-native-firebase/firestore";

// Enable offline persistence
firestore().settings({
  persistence: true,
  cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
});
```

### 6.4 Key Algorithms

#### Sumowanie składników dla listy zakupów

```typescript
function generateShoppingList(
  mealPlans: MealPlan[],
  recipes: Record<string, Recipe>,
): ShoppingList {
  const ingredientMap = new Map<
    string,
    {
      name: string;
      totalAmount: number;
      unit: string;
      category: IngredientCategory;
    }
  >();

  // Iteruj po wszystkich planach posiłków
  mealPlans.forEach((plan) => {
    Object.values(plan.meals).forEach((userMeals) => {
      Object.values(userMeals).forEach((slot) => {
        const recipe = recipes[slot.recipeId];
        const scaleFactor = slot.servings / recipe.baseServings;

        // Skaluj składniki
        recipe.ingredients.forEach((ingredient) => {
          const key = `${ingredient.name}_${ingredient.unit}`;
          const scaledAmount = ingredient.amount * scaleFactor;

          if (ingredientMap.has(key)) {
            const existing = ingredientMap.get(key)!;
            existing.totalAmount += scaledAmount;
          } else {
            ingredientMap.set(key, {
              name: ingredient.name,
              totalAmount: scaledAmount,
              unit: ingredient.unit,
              category: ingredient.category,
            });
          }
        });
      });
    });
  });

  // Grupuj po kategoriach
  const itemsByCategory: Record<string, ShoppingItem[]> = {};
  ingredientMap.forEach((item) => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    itemsByCategory[item.category].push({
      name: item.name,
      totalAmount: Math.round(item.totalAmount * 10) / 10, // Round to 1 decimal
      unit: item.unit,
      checked: false,
    });
  });

  return {
    items: itemsByCategory,
    // ... inne pola
  };
}
```

---

## 7. UI/UX Specifications

### 7.1 Design System

**Kolorystyka (proposal - minimalistyczna):**

- **Primary:** #4A90E2 (niebieski - akcje, CTA)
- **Secondary:** #7ED321 (zielony - success, checked items)
- **Background:** #FFFFFF (białe tło)
- **Surface:** #F5F5F5 (karty, sekcje)
- **Text Primary:** #333333
- **Text Secondary:** #999999
- **Border:** #E0E0E0
- **Error:** #D0021B

**Typografia:**

- **System Font:** San Francisco (iOS native)
- **Headers:** SF Pro Display, Bold, 20-24pt
- **Body:** SF Pro Text, Regular, 16pt
- **Caption:** SF Pro Text, Regular, 14pt

**Spacing:**

- Base unit: 8px
- Small: 8px
- Medium: 16px
- Large: 24px
- XLarge: 32px

**Corner Radius:**

- Karty: 12px
- Buttons: 8px
- Inputs: 8px

### 7.2 Component Library

**Używane komponenty React Native:**

- `View`, `Text`, `ScrollView`, `FlatList`
- `TouchableOpacity`, `Pressable`
- `TextInput`
- `Modal`
- `Switch` (dla checkboxów)

**Custom Components:**

- `MealCard` - Karta przepisu w planie
- `RecipeCard` - Karta w liście przepisów
- `ShoppingListItem` - Element listy zakupów z checkboxem
- `DayCarousel` - Karuzela dni
- `SegmentedControl` - [Ty | Oboje | Partner]
- `CategoryFilter` - Filtry kategorii przepisów

### 7.3 Animacje

**Transycje:**

- Modal otwarcie/zamknięcie: slide up/down, 300ms ease-out
- Rozwijanie/zwijanie karty: expand/collapse, 250ms ease-in-out
- Bottom navigation: fade, 200ms
- Swipe karuzeli dni: spring animation

**Biblioteka:** React Native Reanimated v3.10+ (core library w projekcie)

### 7.4 Accessibility

- **VoiceOver support:** Wszystkie interaktywne elementy muszą mieć `accessibilityLabel`
- **Contrast ratio:** Min 4.5:1 dla tekstu
- **Touch targets:** Min 44x44pt (iOS standard)
- **Font scaling:** Support dla Dynamic Type (iOS)

---

## 8. User Stories & Acceptance Criteria

### Epic 1: Onboarding & Setup

**US-1.1:** Jako nowy użytkownik, chcę utworzyć gospodarstwo domowe w prosty sposób

- **AC:** Mogę wprowadzić swoje imię i nazwę gospodarstwa
- **AC:** System generuje unikalny kod zaproszenia
- **AC:** Widzę ekran sukcesu z kodem do skopiowania
- **AC:** Proces zajmuje <30s

**US-1.2:** Jako drugi użytkownik, chcę dołączyć do istniejącego gospodarstwa

- **AC:** Mogę kliknąć link zaproszenia i otworzyć aplikację
- **AC:** Widzę nazwę gospodarstwa i mogę wybrać swoje imię
- **AC:** Po dołączeniu widzę ten sam plan co pierwszy użytkownik

### Epic 2: Planowanie posiłków

**US-2.1:** Jako użytkownik, chcę dodać przepis do mojego planu na konkretny dzień

- **AC:** Mogę przełączyć widok na "Ty" lub "Partner"
- **AC:** Mogę wybrać pusty slot (śniadanie/obiad/etc)
- **AC:** Widzę listę przepisów do wyboru
- **AC:** Mogę wybrać przepis i ustawić liczbę porcji
- **AC:** Przepis pojawia się w mojej połowie planu

**US-2.2:** Jako użytkownik, chcę zobaczyć co mój partner ma zaplanowane

- **AC:** Mogę przełączyć widok na "Oboje"
- **AC:** Widzę ekran podzielony na pół z planami obu osób
- **AC:** Mogę rozwijać karty aby zobaczyć szczegóły przepisów

**US-2.3:** Jako użytkownik, chcę edytować liczbę porcji zaplanowanego posiłku

- **AC:** Mogę kliknąć "Edytuj porcje" na rozwiniętej karcie
- **AC:** Mogę zmienić liczbę porcji
- **AC:** Składniki automatycznie przeliczają się proporcjonalnie

**US-2.4:** Jako użytkownik, chcę usunąć przepis z planu

- **AC:** Mogę kliknąć "Usuń" na rozwiniętej karcie
- **AC:** System pyta o potwierdzenie przed usunięciem
- **AC:** Po usunięciu slot wraca do stanu pustego

### Epic 3: Przeglądanie przepisów

**US-3.1:** Jako użytkownik, chcę przeglądać wszystkie dostępne przepisy

- **AC:** Widzę listę wszystkich przepisów z miniaturami i podstawowymi info
- **AC:** Lista ładuje się <1s

**US-3.2:** Jako użytkownik, chcę wyszukać przepis po nazwie

- **AC:** Mogę wpisać tekst w search bar
- **AC:** Lista filtruje się realtime podczas pisania
- **AC:** Widzę tylko przepisy pasujące do wyszukiwania

**US-3.3:** Jako użytkownik, chcę filtrować przepisy po kategorii

- **AC:** Mogę kliknąć tab "Śniadania", "Obiady", etc
- **AC:** Widzę tylko przepisy z wybranej kategorii
- **AC:** Przepisy należące do wielu kategorii pojawiają się we wszystkich

**US-3.4:** Jako użytkownik, chcę zobaczyć pełne szczegóły przepisu

- **AC:** Mogę kliknąć kartę przepisu
- **AC:** Otwiera się modal z pełnymi składnikami, instrukcjami i makros
- **AC:** Mogę dodać przepis do planu bezpośrednio z modalu

### Epic 4: Lista zakupów

**US-4.1:** Jako użytkownik, chcę wygenerować listę zakupów na wybrane dni

- **AC:** Mogę wybrać dowolne dni tygodnia (checkboxy)
- **AC:** System zbiera wszystkie przepisy z wybranych dni (obu użytkowników)
- **AC:** Lista generuje się w <2s
- **AC:** Składniki są zsumowane i pogrupowane w kategorie

**US-4.2:** Jako użytkownik, chcę odznaczać produkty podczas zakupów

- **AC:** Mogę tapnąć checkbox przy składniku
- **AC:** Składnik zostaje checked (strikethrough + szary)
- **AC:** Mój partner widzi odznaczenie <2s po mojej akcji

**US-4.3:** Jako użytkownik, chcę ponownie wygenerować listę dla innych dni

- **AC:** Mogę kliknąć przycisk "Regeneruj"
- **AC:** Mogę wybrać nowe dni
- **AC:** Stara lista zostaje zastąpiona nową (nie dopisuje się)

### Epic 5: Synchronizacja

**US-5.1:** Jako użytkownik, chcę aby moje zmiany były widoczne dla partnera realtime

- **AC:** Dodanie przepisu przez mnie pojawia się u partnera <2s
- **AC:** Usunięcie przepisu synchronizuje się <2s
- **AC:** Edycja porcji synchronizuje się <2s
- **AC:** Odznaczenie na liście zakupów synchronizuje się <1s

**US-5.2:** Jako użytkownik, chcę pracować offline i zsynchronizować zmiany później

- **AC:** Mogę dodawać/edytować przepisy bez internetu
- **AC:** Zmiany są kolejkowane lokalnie
- **AC:** Gdy internet wraca, zmiany synchronizują się automatycznie
- **AC:** Widzę banner "Synchronizuję..." gdy są pending changes

---

## 9. Out of Scope (v2.0 Features)

Następujące funkcjonalności **nie są** wliczone w MVP i zostaną rozważone w przyszłych wersjach:

### Funkcje zaawansowane

- ❌ AI/OCR konwersja przepisów z PDF/screenshot
- ❌ Dodawanie własnych przepisów przez użytkowników
- ❌ Filtrowanie przepisów po składnikach ("pokaż przepisy z kurczakiem")
- ❌ Historia planów tygodniowych (archiwum)
- ❌ Kopiowanie planu z poprzedniego tygodnia
- ❌ Export listy zakupów do innych format (PDF, email, share)
- ❌ Sugestie przepisów oparte na AI/algorytmach
- ❌ Cele kaloryczne użytkownika i tracking
- ❌ Profile żywieniowe (diety, alergie, preferencje)
- ❌ Kalendarz dostarczeń zakupów / integracje z supermarketami
- ❌ Konwersje jednostek miar (automatyczne przeliczanie ml→szklanki)
- ❌ Porównywanie składników między użytkownikami w widoku "Oboje"
- ❌ Sumowanie składników w czasie gotowania (funkcja "skonwertuj posiłki")

### UX enhancements

- ❌ Push notifications (powiadomienia o zmianach planu)
- ❌ Tutorial / onboarding dla nowych użytkowników
- ❌ Drag & drop przepisów między dniami
- ❌ Duplikacja przepisu na wiele dni jednocześnie
- ❌ Customizacja nazw slotów posiłków
- ❌ Dark mode
- ❌ Motywy kolorystyczne

### Skalowanie

- ❌ Możliwość >2 użytkowników w gospodarstwie
- ❌ Wersja na Android
- ❌ Wersja web (PWA)
- ❌ Multi-household support (jedna osoba w wielu gospodarstwach)

### Społecznościowe

- ❌ Udostępnianie przepisów między użytkownikami
- ❌ Oceny i komentarze do przepisów
- ❌ Social features (follow, share meals)

---

## 10. Risks & Mitigations

### Risk 1: Firebase darmowy limit przekroczony

**Prawdopodobieństwo:** Niskie  
**Wpływ:** Średni  
**Mitigation:**

- 2 użytkowników generuje ~1k reads/day (10x poniżej limitu 50k)
- Monitoring użycia w Firebase Console
- Optymalizacja: cache lokalny, batch reads
- Plan B: Migracja na Supabase (też darmowy tier)

### Risk 2: Brak doświadczenia z Firebase/backend

**Prawdopodobieństwo:** Średnie  
**Wpływ:** Wysoki  
**Mitigation:**

- Firebase ma świetną dokumentację i tutoriale
- React Native Firebase library jest dobrze wspierana
- Start z prostymi operacjami (CRUD), nie używać zaawansowanych features (Cloud Functions)
- W razie problemów: społeczność, Stack Overflow
- Alternatywa: Zatrudnienie freelancera do setup Firebase (jednorazowy koszt)

### Risk 3: Synchronizacja - konflikty zapisu

**Prawdopodobieństwo:** Niskie  
**Wpływ:** Niski  
**Mitigation:**

- Dla 2 użytkowników ryzyko konfliktu jest minimalne
- Firebase Firestore ma wbudowany conflict resolution ("last write wins")
- W praktyce: jeśli oboje edytujecie różne dni/sloty, nie ma konfliktu
- Jeśli konflikt: łatwo naprawić ręcznie (re-dodanie przepisu)

### Risk 4: Formatowanie przepisów z PDF jest czasochłonne

**Prawdopodobieństwo:** Wysokie  
**Wpływ:** Średni  
**Mitigation:**

- Użycie ChatGPT/Claude do jednorazowej konwersji (skopiuj tekst → prompt)
- Start z małą bazą 20-30 przepisów, dodawanie stopniowe
- Format JSON jest prosty, można zrobić template i kopiować
- W v2.0: AI automation

### Risk 5: MVP jest za duży, development zajmie >2 miesiące

**Prawdopodobieństwo:** Średnie  
**Wpływ:** Niski (to prywatny projekt, deadline nie jest krytyczny)  
**Mitigation:**

- Fazowanie: Zbuduj najpierw "Plan" + "Przepisy", potem "Lista zakupów"
- Use case 1: "Mogę dodać przepis do planu" → Milestone 1
- Use case 2: "Mogę wygenerować listę zakupów" → Milestone 2
- Synchronizacja Firebase dodaj na końcu (start z local state)
- Użycie boilerplate / templates dla Expo Router + Firebase

### Risk 6: iOS deployment - problemy z certyfikatami/provisioning

**Prawdopodobieństwo:** Średnie  
**Wpływ:** Średni  
**Mitigation:**

- Użycie Expo EAS Build (upraszcza iOS build process)
- Development: Test na własnym urządzeniu przez Xcode (free)
- Distribution: TestFlight dla 2 urządzeń (free, bez App Store review)
- Dokumentacja Expo jest kompleksowa
- Plan B: Użycie React Native CLI zamiast Expo (więcej kontroli)

---

## 11. Implementation Roadmap

### Phase 0: Setup & Infrastructure (Week 1)

- ✅ Firebase project setup
- ✅ Firestore collections & security rules
- ✅ Expo Router configuration (tabs layout + stack screens)
- ✅ Authentication flow (anonymous/custom token)
- ✅ Basic UI layout (3 ekrany + bottom nav)

### Phase 1: Przepisy & Przeglądanie (Week 2-3)

- Ekran "Przepisy" - lista + search + filtry
- Modal szczegółów przepisu
- Formatowanie ~30 przepisów do JSON
- Import przepisów do Firestore
- Component: `RecipeCard`, `RecipeDetailModal`

### Phase 2: Planowanie posiłków (Week 4-6)

- Ekran "Plan" - layout z karuzelą dni
- Segmented control [Ty | Oboje | Partner]
- Component: `MealCard` (zwinięta/rozwinięta)
- Flow dodawania przepisu do slotu
- Edycja liczby porcji
- Usuwanie przepisu z planu
- Zapisywanie planu do Firestore
- Synchronizacja realtime między urządzeniami

### Phase 3: Lista zakupów (Week 7-8)

- Ekran "Lista zakupów"
- Modal wyboru dni
- Algorytm sumowania składników
- Generowanie listy z grupowaniem po kategoriach
- Component: `ShoppingListItem` z checkbox
- Synchronizacja checked items realtime
- Re-generacja listy

### Phase 4: Onboarding & Ustawienia (Week 9)

- Ekran onboardingu (tworzenie gospodarstwa)
- Ekran zaproszenia (dołączanie przez link)
- Ekran "Ustawienia"
- Deep linking (invite URLs)

### Phase 5: Polish & Testing (Week 10-11)

- Animacje i transitions
- Error handling
- Offline persistence testing
- Bug fixing
- UI/UX improvements
- Performance optimization

### Phase 6: Deployment (Week 12)

- iOS build przez EAS/Xcode
- TestFlight deployment
- Testing na 2 urządzeniach
- Final bug fixes
- Release v1.0

**Całkowity czas:** ~3 miesiące (solo development, part-time)

---

## 12. Appendix

### A. JSON Schema dla przepisu (przykład)

```json
{
  "id": "recipe_001",
  "name": "Kurczak z ryżem i warzywami",
  "description": "Zdrowy, pełnowartościowy posiłek bogaty w białko",
  "categories": ["lunch", "dinner"],
  "ingredients": [
    {
      "name": "Kurczak (pierś)",
      "amount": 200,
      "unit": "g",
      "category": "meat"
    },
    {
      "name": "Ryż biały",
      "amount": 100,
      "unit": "g",
      "category": "dry"
    },
    {
      "name": "Marchew",
      "amount": 50,
      "unit": "g",
      "category": "vegetables"
    },
    {
      "name": "Cebula",
      "amount": 30,
      "unit": "g",
      "category": "vegetables"
    },
    {
      "name": "Olej",
      "amount": 10,
      "unit": "ml",
      "category": "spices"
    }
  ],
  "instructions": [
    "Pokrój kurczaka na małe kawałki",
    "Ugotuj ryż według instrukcji na opakowaniu",
    "Pokrój marchew i cebulę w kostkę",
    "Rozgrzej olej na patelni",
    "Podsmaż cebulę i marchew przez 3-4 minuty",
    "Dodaj kurczaka i smaż na średnim ogniu przez 10 minut",
    "Wymieszaj z ugotowanym ryżem i podawaj"
  ],
  "nutrition": {
    "calories": 450,
    "protein": 35,
    "fats": 12,
    "carbs": 48
  },
  "baseServings": 2,
  "prepTime": 25,
  "imageUrl": null,
  "createdAt": "2026-05-15T10:00:00Z"
}
```

### B. Mapowanie kategorii składników (PL → code)

| Polski              | Category Code | Ikona | Kolejność |
| ------------------- | ------------- | ----- | --------- |
| Warzywa i owoce     | vegetables    | 🥬    | 1         |
| Pieczywo            | bread         | 🥖    | 2         |
| Nabiał i jajka      | dairy         | 🥛    | 3         |
| Mięso i ryby        | meat          | 🍗    | 4         |
| Mrożonki            | frozen        | 🧊    | 5         |
| Artykuły suche      | dry           | 🌾    | 6         |
| Przyprawy i dodatki | spices        | 🧂    | 7         |

### C. Polskie jednostki miar do użycia

**Stałe:**

- `g` (gramy)
- `kg` (kilogramy)
- `ml` (mililitry)
- `l` (litry)
- `szt` (sztuki)
- `łyżka` (łyżka stołowa)
- `łyżeczka` (łyżeczka do herbaty)
- `szklanka` (250ml)
- `szczypta`

**W MVP:** Nie implementujemy konwersji między jednostkami - każdy składnik ma jedną przypisaną jednostkę w bazie.

---

## 13. Success Criteria Final Checklist

MVP jest gotowe do użycia gdy spełnia następujące warunki:

### Funkcjonalność

- [ ] Użytkownik może utworzyć gospodarstwo w <30s
- [ ] Drugi użytkownik może dołączyć przez link zaproszenia
- [ ] Oba urządzenia widzą te same dane w czasie rzeczywistym
- [ ] Użytkownik może dodać przepis do dowolnego slotu w ciągu <15s
- [ ] Użytkownik może edytować liczbę porcji i składniki przeliczają się poprawnie
- [ ] Użytkownik może usunąć przepis z planu
- [ ] Użytkownik może przełączać między widokami [Ty | Oboje | Partner]
- [ ] Karuzela dni działa swipe i tap
- [ ] Użytkownik może wyszukać przepis po nazwie
- [ ] Użytkownik może filtrować przepisy po kategorii
- [ ] Użytkownik może wygenerować listę zakupów wybierając dni
- [ ] Lista zakupów sumuje powtarzające się składniki poprawnie
- [ ] Składniki są pogrupowane w kategorie
- [ ] Użytkownik może odznaczać produkty na liście
- [ ] Odznaczenie synchronizuje się na drugie urządzenie <2s
- [ ] Aplikacja działa offline i synchronizuje zmiany gdy wraca internet

### Wydajność

- [ ] Ekran "Plan" ładuje się <1s
- [ ] Ekran "Przepisy" ładuje się <1s
- [ ] Generowanie listy zakupów trwa <2s dla 3 dni z ~10 przepisami
- [ ] Synchronizacja zmian <2s między urządzeniami
- [ ] Animacje są płynne (60fps)

### UX/UI

- [ ] Wszystkie ekrany są responsive na różnych rozmiarach iPhone
- [ ] Touch targets są min 44x44pt
- [ ] Kolory mają kontrast ratio >4.5:1
- [ ] Fonty skalują się z Dynamic Type
- [ ] Wszystkie interakcje mają feedback (visual/haptic)
- [ ] Loading states są zaimplementowane
- [ ] Error states są zaimplementowane z czytelnymi komunikatami

### Stabilność

- [ ] Brak crashy podczas podstawowych user flows
- [ ] Firebase nie przekracza darmowego limitów
- [ ] Aplikacja działa poprawnie po restarcie
- [ ] Dane persystują lokalnie (offline mode)

---

## Podsumowanie

MyDiet MVP to kompletna, funkcjonalna aplikacja do planowania posiłków dla 2-osobowego gospodarstwa domowego. Jej główna wartość to:

1. **Szybkie planowanie** - Dodaj przepisy na cały tydzień w kilka minut
2. **Automatyzacja zakupów** - Lista zakupów generuje się automatycznie z zsumowanymi składnikami
3. **Synchronizacja realtime** - Oboje użytkownicy widzą te same dane bez opóźnień
4. **Zero kosztów** - Firebase Spark Plan + prywatna aplikacja = darmowe użytkowanie

Dokument ten zawiera wszystkie wymagania potrzebne do implementacji MVP. Roadmap zakłada ~3 miesiące developmentu (part-time, solo). Po ukończeniu MVP można iteracyjnie dodawać funkcje z sekcji "Out of Scope" na podstawie rzeczywistych potrzeb użytkowników.

**Gotowe do developmentu! 🚀**
