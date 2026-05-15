# MyDiet - Tech Stack Specification

**Version:** 1.0 MVP  
**Status:** Approved  
**Last Updated:** 15 May 2026

---

## Overview

Stack zoptymalizowany dla **prywatnej aplikacji iOS** dla 2 użytkowników. Priorytet: prostota, zero kosztów operacyjnych, szybki development MVP (2-3 miesiące part-time).

---

## Frontend

### Core Framework
- **React Native + Expo SDK 54+**
  - Cross-platform z native performance
  - Over-the-air updates (hot-fix bez app store review)
  - Szybki development cycle (hot reload)
  - iOS-only w MVP 

- **TypeScript 5.x**
  - Type safety
  - Better IDE support
  - Łatwiejsze refactoring

### Navigation
- **Expo Router v3.x**
  - Filesystem-based routing (app/ directory)
  - Type-safe navigation z parametrami
  - Deep linking out-of-the-box (invite URLs)
  - Layout-based navigation (automatic Bottom Tab)

### Styling
- **NativeWind v4.1+**
  - Tailwind CSS dla React Native
  - Utility-first CSS
  - Hot reload dla stylów
  - Responsive design z breakpoints
 
### State Management

**Zustand v4.5.x** - Local UI State
- Selected day, view mode (Ty/Oboje/Partner)
- Modal open/close state
- Filters, search queries
- **Dlaczego:** Lightweight (~1KB), prosty API, persist middleware dla offline

**TanStack Query v5.x** - Server State
- Cache dla danych z Firebase
- Automatic refetch i revalidation
- Optimistic updates dla mutations
- Offline queue
- **Dlaczego:** Must-have dla Firebase realtime sync, eliminuje potrzebę ręcznego cache management

### Storage
- **AsyncStorage** (Expo built-in)
  - Persist Zustand state
  - Offline support
  - **Dlaczego:** Wystarczające dla MVP (2 użytkowników), 100% darmowe

### Animations
- **React Native Animated API** (core)
  - Expand/collapse cards
  - Fade transitions
  - Modal slide up/down
  - **Dlaczego:** Built-in, wystarczające dla MVP
  - *(React Native Reanimated odrzucone - można dodać później jeśli potrzeba advanced gestures)*

### Utilities
- **date-fns v3.x** - Date manipulation
  - Karuzela dni (add/subtract days)
  - Formatowanie dat (pon, wt, śr)
  - Locale support (PL)

- **nanoid v5.x** - ID generation
  - Invite codes (6-8 znaków)
  - Household ID
  - Device ID

### Form Handling
- **React useState + kontrolowane inputy**
  - Proste formy (imię, liczba porcji)
  - Inline validation
  - **Dlaczego:** React Hook Form + Zod overkill dla MVP

---

## Backend & Database

### Firebase (BaaS)

**Firestore** - NoSQL Database
- **Collections:**
  - `households` - Gospodarstwa domowe
  - `mealPlans` - Plany posiłków (per dzień)
  - `recipes` - Baza przepisów (read-only)
  - `shoppingLists` - Listy zakupów
- **Features:**
  - Realtime listeners dla synchronizacji
  - Offline persistence (unlimited cache)
  - Document-based queries
  - Automatic indexing

**Firebase Authentication**
- **Custom Token Auth** z device ID jako claim
  - Stałe ID urządzenia (nie zmienia się po reinstall)
  - Brak email/password/SMS
  - Security przez invite codes
- **Anonymous Auth** jako fallback

**Firebase Security Rules**
- Backend authorization logic
- Row-level access control (per household)
- Walidacja zapisów (struktura danych)
- Recipes read-only dla wszystkich

**Firebase Plan:** Spark (Free)
- 1GB storage
- 50k reads/day, 20k writes/day
- 10GB bandwidth/month
- **Estymacja dla 2 użytkowników:** ~1k reads/day (10x poniżej limitu)

---

## Development Tools

### Tooling
- **Expo CLI** - Development server
- **EAS Build** - Cloud builds dla iOS (30 builds/month free tier)
- **TypeScript ESLint + Prettier** - Code quality & formatting
- **Expo Dev Client** - Custom native code (jeśli potrzeba)

### Testing
- **Jest** (Expo built-in) - Unit tests
- **React Native Testing Library** - Component tests
- *(E2E testy opcjonalnie: Detox/Maestro - nice to have)*

### Deployment
- **TestFlight** - iOS beta distribution (free, do 100 testerów)
- **Expo OTA Updates** - Instant updates bez app store review
- **EAS Submit** - Automated App Store submission

### Monitoring (opcjonalnie)
- **Sentry** - Error tracking (free tier: 5k events/month)
- **Firebase Analytics** - Basic usage analytics (free)

---

## Target Platform

**iOS 15.0+** (iPhone 8 i nowsze)
- Wsparcie dla iOS 15, 16, 17, 18
- Screen sizes: 5.5" - 6.7" (iPhone SE - iPhone 15 Pro Max)
- Safe area dla notch/Dynamic Island
- Dark mode support (nice to have, nie w MVP)

**Brak Android w MVP** - kod iOS-specific allowed

---

## Dependencies Overview

### Production Dependencies
```json
{
  "expo": "~52.0.0",
  "expo-router": "~3.5.0",
  "react": "18.3.0",
  "react-native": "0.76.0",
  
  "firebase": "^10.12.0",
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.40.0",
  "@react-native-async-storage/async-storage": "^1.23.0",
  
  "nativewind": "^4.1.0",
  "tailwindcss": "^3.4.0",
  
  "date-fns": "^3.6.0",
  "nanoid": "^5.0.0"
}