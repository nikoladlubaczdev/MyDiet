MyDietMobileApp/
├── app/ # Expo Router entry screens (high-level routing only)
│ ├── (tabs)/ # Bottom navigation tabs
│ │ ├── \_layout.tsx # Tab bar layout configuration
│ │ ├── plan.tsx # 📅 Plan screen (delegates to features/meal-planner)
│ │ ├── recipes.tsx # 📖 Recipes screen (delegates to features/recipes)
│ │ └── shopping.tsx # 🛒 Shopping list (delegates to features/shopping-list)
│ ├── onboarding.tsx # First-time household setup (delegates to features/onboarding)
│ ├── settings.tsx # ⚙️ Settings modal (delegates to features/settings)
│ └── \_layout.tsx # Root layout & providers
│
├── src/ # Application source code
│ ├── features/ # Self-contained business features (Feature-First)
│ │ ├── onboarding/ # Onboarding & register/login flow
│ │ │ ├── components/ # Onboarding-specific components (e.g., HouseholdSetupForm)
│ │ │ ├── hooks/ # Onboarding-specific hooks
│ │ │ ├── screens/ # Onboarding steps
│ │ │ └── services/ # Onboarding Firestore services
│ │ │
│ │ ├── meal-planner/ # 📅 Diet and meal plan feature
│ │ │ ├── components/ # Meal planner UI (e.g., MealCard, DayCarousel, SegmentedControl)
│ │ │ ├── hooks/ # useMealPlans, useAddMeal, useUpdateMeal
│ │ │ ├── screens/ # PlanScreen content
│ │ │ └── services/ # MealPlan Firestore service
│ │ │
│ │ ├── recipes/ # 📖 Recipe browsing and management
│ │ │ ├── components/ # Recipe-specific UI (e.g., RecipeCard, IngredientsList)
│ │ │ ├── hooks/ # useRecipes
│ │ │ ├── screens/ # RecipesScreen content
│ │ │ └── services/ # Recipe Firestore service
│ │ │
│ │ ├── shopping-list/ # 🛒 Shopping list generation
│ │ │ ├── components/ # Shopping list UI (e.g., ShoppingListItem)
│ │ │ ├── hooks/ # useShoppingList, useToggleShoppingItem
│ │ │ ├── screens/ # ShoppingScreen content
│ │ │ └── services/ # Shopping Firestore service
│ │ │
│ │ └── settings/ # ⚙️ App / Household settings
│ │ ├── components/ # Settings-specific UI
│ │ ├── hooks/ # useHousehold
│ │ ├── screens/ # SettingsScreen content
│ │ └── services/ # Household Firestore service
│ │
│ ├── shared/ # Strictly generic reusable code (NO business logic)
│ │ ├── components/ # Dumb primitive UI (e.g., Button, Input, Modal, Loader)
│ │ ├── hooks/ # Technical hooks (e.g., useDebounce, useTheme)
│ │ ├── stores/ # State managers (e.g., useUIStore, useAuthStore)
│ │ ├── lib/ # Generic utilities & third-party configs
│ │ │ ├── firebase/ # Firebase initialization/config only
│ │ │ └── utils/ # Non-business utility helpers (e.g., dates.ts, ids.ts)
│ │ └── types/ # Core domain TypeScript models (recipe, mealPlan, household)
│ │
│ └── constants/ # App-wide technical constants (Colors, config keys)
│
├── assets/ # Static assets (images, fonts, icons)
├── tailwind.config.js # NativeWind config
├── app.json # Expo config
├── tsconfig.json # TypeScript config
├── package.json
└── README.md
