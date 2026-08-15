import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

      getMealForSlot: (date, person, mealSlot) => {
        return get().plan[date]?.[person]?.[mealSlot] || null;
      },

      getDayPlan: (date, person) => {
        return get().plan[date]?.[person] || createEmptyDayPlan()[person];
      },
    }),
    {
      name: 'plan-storage',
      storage: AsyncStorage,
    }
  )
);
