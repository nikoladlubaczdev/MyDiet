import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MealPlan {
  recipeId: string;
  servings: number;
}

export interface DayPlan {
  [person: string]: {
    [mealSlot: string]: MealPlan | null;
  };
}

export interface PlanStoreState {
  // Format: YYYY-MM-DD -> { you: { Śniadanie: {...}, ... }, partner: { Śniadanie: {...}, ... } }
  plan: Record<string, DayPlan>;

  // Actions
  addMeal: (date: string, person: 'you' | 'partner', mealSlot: string, recipeId: string, servings: number) => void;
  removeMeal: (date: string, person: 'you' | 'partner', mealSlot: string) => void;
  editServings: (date: string, person: 'you' | 'partner', mealSlot: string, servings: number) => void;
  copyDayMeals: (fromDate: string, fromPerson: 'you' | 'partner', toDate: string, toPerson: 'you' | 'partner') => void;
  getMealForSlot: (date: string, person: 'you' | 'partner', mealSlot: string) => MealPlan | null;
  getDayPlan: (date: string, person: 'you' | 'partner') => Record<string, MealPlan | null>;
}

const MEAL_SLOTS = ['Śniadanie', 'II Śniadanie', 'Obiad', 'Podwieczorek', 'Kolacja'];

const createEmptyDayPlan = (): DayPlan => ({
  you: {
    'Śniadanie': null,
    'II Śniadanie': null,
    'Obiad': null,
    'Podwieczorek': null,
    'Kolacja': null,
  },
  partner: {
    'Śniadanie': null,
    'II Śniadanie': null,
    'Obiad': null,
    'Podwieczorek': null,
    'Kolacja': null,
  },
});

export const usePlanStore = create<PlanStoreState>()(
  persist(
    (set, get) => ({
      plan: {},

      addMeal: (date, person, mealSlot, recipeId, servings) => {
        set((state) => ({
          plan: {
            ...state.plan,
            [date]: {
              ...(state.plan[date] || createEmptyDayPlan()),
              [person]: {
                ...(state.plan[date]?.[person] || {}),
                [mealSlot]: { recipeId, servings },
              },
            },
          },
        }));
      },

      removeMeal: (date, person, mealSlot) => {
        set((state) => ({
          plan: {
            ...state.plan,
            [date]: {
              ...(state.plan[date] || createEmptyDayPlan()),
              [person]: {
                ...(state.plan[date]?.[person] || {}),
                [mealSlot]: null,
              },
            },
          },
        }));
      },

      editServings: (date, person, mealSlot, servings) => {
        set((state) => {
          const meal = state.plan[date]?.[person]?.[mealSlot];
          if (!meal) return state;

          return {
            plan: {
              ...state.plan,
              [date]: {
                ...(state.plan[date] || createEmptyDayPlan()),
                [person]: {
                  ...(state.plan[date]?.[person] || {}),
                  [mealSlot]: { ...meal, servings },
                },
              },
            },
          };
        });
      },

      copyDayMeals: (fromDate, fromPerson, toDate, toPerson) => {
        set((state) => {
          const source = state.plan[fromDate]?.[fromPerson] || {};
          const filledMeals = Object.fromEntries(
            Object.entries(source).filter(([, meal]) => meal !== null)
          );
          if (Object.keys(filledMeals).length === 0) return state;

          const targetDay = state.plan[toDate] || createEmptyDayPlan();
          return {
            plan: {
              ...state.plan,
              [toDate]: {
                ...targetDay,
                [toPerson]: {
                  ...targetDay[toPerson],
                  ...filledMeals,
                },
              },
            },
          };
        });
      },

      getMealForSlot: (date, person, mealSlot) => {
        return get().plan[date]?.[person]?.[mealSlot] || null;
      },

      getDayPlan: (date, person) => {
        return get().plan[date]?.[person] || createEmptyDayPlan()[person];
      },
    }),
    {
      name: 'plan-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // v2: recipes were rewritten to per-person variants; old recipe IDs no longer exist.
      version: 2,
      migrate: () => ({ plan: {} }),
    }
  )
);
