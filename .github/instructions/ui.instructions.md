# UI & Components Development Instructions

applyTo: "src/features/**/components/**/_.tsx, src/shared/components/\*\*/_.tsx, app/\*_/_.tsx"

---

## 1. Techniczne Wytyczne UI & Styling

- Do stylizowania używaj wyłącznie klas Tailwind CSS poprzez prop `className` dzięki integracji NativeWind v4.
- Twórz wyłącznie czyste komponenty funkcyjne. Jeśli dwa komponenty w różnych modułach biznesowych mają podobny layout, ale różną logikę – **skopiuj kod zamiast tworzyć zbyt generyczną abstrakcję**.
- Każda interaktywna kontrolka (np. `Pressable`) musi zawierać atrybuty dostępności:
  - `accessible={true}`
  - `accessibilityRole="button"` (lub inny właściwy)
  - `accessibilityLabel="..."` (krótki, opisowy tekst w języku polskim dla VoiceOver)
- Do weryfikacji i obsługi formularzy w MVP stosuj proste podejście z kontrolowanymi inputami w `useState` (zgodnie ze specyfikacją projektu), unikaj dodatkowych bibliotek.
- Importuj ikony i obrazy wyłącznie zgodnie z wytycznymi Expo i NativeWind.
