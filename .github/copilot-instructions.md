# MyDiet - GitHub Copilot Custom Instructions

## 1. Oszczędzanie kredytów i optymalizacja zapytań (Cost Optimization)
- Czytaj pliki w większych blokach zamiast wywoływać małe interakcje krok po kroku. Edytuj pliki w jednym kroku za pomocą `replace_string_in_file`.
- Nigdy nie powtarzaj dużych bloków kodu w odpowiedziach czatu, jeśli plik został już pomyślnie zaktualizowany bezpośrednio w edytorze. Ogranicz odpowiedź do krótkiej informacji o zmianie i linku do pliku, np. `Zaktualizowano plik [src/api.ts](src/api.ts)`.
- Pisz krótko, technicznie i bez zbędnych uprzejmości. Przechodź od razu do sedna problemu.

## 2. Architektura Projektu (Feature-First)
- Projekt opiera się na architekturze zorientowanej na funkcjonalności (Feature-First / Screaming Architecture). Wszystkie pliki związane z danym modułem (komponenty, hooki, ekrany, usługi api) muszą znajdować się wewnątrz folderu `src/features/{feature-name}/`.
- Wspólny, bezstanowy kod techniczny oraz globalny system typów znajduje się w `src/shared/`.
- Jeśli dwa elementy są podobne wizualnie, ale różnią się logiką biznesową, **skopiuj je**: unikaj tworzenia generycznych rozwiązań na siłę z flagami warunkowymi ("iffologią").

## 3. Techniczne Wytyczne Kodowania
### standardy React, TypeScript & Hooks
- Używaj wyłącznie czystych komponentów funkcyjnych oraz React Hooks. Unikaj komponentów klasowych.
- Do definiowania propsów i struktur danych konsekwentnie stosuj `interface` zamiast `type`.
- Zawsze obsługuj błędy i warunki brzegowe na początku funkcji.
- Stosuj wzorzec `early returns` (instrukcje warunkowe z natychmiastowym wyjściem `return`/`throw` / guard clauses), aby uniknąć głęboko zagnieżdżonych bloków `if-else`.
- Główną ścieżkę wykonania funkcji (happy path) umieszczaj na samym końcu dla czytelności.
- Unikaj zbędnych bloków `else` po instrukcjach `return`/`throw`.

### Stylizowanie UI & Dostępność
- Klasy Tailwind CSS aplikuj poprzez prop `className` dzięki NativeWind.
- Nie dodawaj dedykowanych arkuszy `.css` ani obiektów `StyleSheet.create` (wyjątkiem są natywne style specyficzne dla Expo).
- Używaj wariantów responsywnych oraz stanowych do budowania interfejsu.
- Dbaj o dostępność elementów (accessibility w iOS) za pomocą natywnych atrybutów React Native, takich jak `accessible={true}`, `accessibilityRole`, `accessibilityLabel`.
