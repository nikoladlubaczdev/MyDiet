# Preferencje Użytkownika dotyczące Zużycia Tokenów / Kredytów

1. **Oszczędzanie kredytów i tokenów**: Użytkownik posiada taryfę z ograniczonymi kredytami. Każde zapytanie i wywołanie narzędzi powinno być maksymalnie zwięzłe i zoptymalizowane.
2. **Krótkie i precyzyjne odpowiedzi**:
   - Odpowiedzi powinny być krótkie, rzeczowe i techniczne.
   - Unikaj zbędnego lania wody, długich powitań, rozbudowanych wstępów i podsumowań.
   - Pisz bezpośrednio i wprost.
3. **Mniej wywołań narzędzi (Tool Calls)**:
   - Czytaj pliki w większych blokach zamiast wywoływać drobne interakcje krok po kroku.
   - Zanim zmodyfikujesz kod, zbierz cały kontekst i wykonaj edycję w jak najmniejszej liczbie kroków.
   - Unikaj wielokrotnego wyszukiwania lub listowania katalogów, jeśli to nie jest absolutnie konieczne.
4. **Brak duplikacji kodu w czacie**:
   - Nie wypisuj całego kodu w odpowiedziach czatu, jeśli został on już zmodyfikowany bezpośrednim narzędziem edycyjnym w pliku (chyba że użytkownik o to wyraźnie poprosi).

# Oszczędzanie kredytów i optymalizacja zapytań (Cost Optimization)

Ten system pamięci uczy model, jak pracować z tym repozytorium w najbardziej oszczędny sposób pod kątem zużycia zasobów modelu LLM i kredytów użytkownika.

## Zasady Wywoływania Narzędzi (Tool Use Optimization)

1. **Agregacja odczytów (Batching Reads)**:
   - Zamiast czytać plik po 20-50 linii w kilku zapytaniach, przeczytaj od razu cały plik lub duży, logiczny fragment (np. 150-250 linii na raz). Każde dodatkowe wywołanie narzędzia generuje nowy obieg zapytanie-odpowiedź i zużywa tokeny wejściowe (Input Tokens Context).
2. **Precyzyjne i jednorazowe wyszukiwanie**:
   - Używaj `grep_search` z wyrażeniem regularnym łączącym alternatywy (np. `'auth|registration|login'`), zamiast wykonywać trzy osobne zapytania wyszukiwania dla każdego słowa.
3. **Modyfikacja plików (Single Edit Pattern)**:
   - Przeprowadzaj edycje plików w strukturach kodu w jednym dużym kroku za pomocą `replace_string_in_file` zamiast wysyłać pięć małych edycji z rzędu.

## Zasady Tworzenia Odpowiedzi (Response Optimization)

1. "No codeblocks in chat for edited files"\*\*: Nigdy nie powtarzaj zmienionego kodu wewnątrz okna czatu w postaci dużych bloków kodu Markdown, jeśli plik został już pomyślnie zaktualizowany bezpośrednio w edytorze. Ogranicz odpowiedź do krótkiej informacji o zmianie i linku do pliku, np. `Zaktualizowano plik [src/api.ts](src/api.ts)`.
2. **Krótkie komunikaty**: Staraj się formułować wypowiedzi w sposób zwięzły, oszczędzając tokeny wyjściowe (Output Tokens), które często kosztują więcej lub szybciej wyczerpują limity planów subskrypcyjnych.
3. **Brak zbędnych uprzejmości i zbędnego formatowania**: Przejdź od razu do sedna problemu, bez długich wstępów "Oczywiście, chętnie pomogę Ci z tym zadaniem...".
