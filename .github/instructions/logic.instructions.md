# Data Layer, Firebase & Logic Instructions

applyTo: "src/features/**/hooks/**/_.ts, src/shared/hooks/\*\*/_.ts, src/features/**/services/**/_.ts, src/shared/stores/\*\*/_.ts"

---

## 1. Wytyczne Logiki i Bazy Danych

- Komunikację z Firestore projektuj w plikach `services/` oddzielnie dla każdego modułu.
- Do pobierania i synchronizacji stanu serwerowego realtime używaj wyłącznie **TanStack Query** v5.
- Pamiętaj o obsłudze trybu offline: Firestore ma włączony cache nielimitowany (offline persistence).
- Do zarządzania lokalnym UI state (np. aktualnie zaznaczony dzień w karuzeli, tryb widoku [Ty/Oboje/Partner]) używaj wyłącznie **Zustand**. Stany te powinny wspierać trwałość poprzez `persist` middleware (AsyncStorage).

## 2. Standardy Kodu TypeScript

- Konsekwentnie faworyzuj stosowanie `interface` nad `type` dla modeli obiektów oraz propsów.
- Pisz funkcje w oparciu o regułę `early returns` (guard clauses):
  - Sprawdź warunki wejściowe i obsłuż błędy na samym początku funkcji.
  - Główną ścieżkę wykonania (success path) zainstaluj na końcu funkcji.
  - Unikaj zbędnych zagnieżdżeń i bloków `else` po słowach kluczowych `return` lub `throw`.
