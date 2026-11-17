import { Text, View } from 'react-native';
import { useRecipes } from '@/features/recipes/hooks/useRecipes';
import { getRecipeVariant, type Person, type Recipe } from '@/shared/types/recipe';
import { usePlanStore, type MealPlan } from '../stores/usePlanStore';

interface DaySummaryProps {
  selectedDate: string;
}

interface PersonTotals {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

const EMPTY_TOTALS: PersonTotals = { kcal: 0, protein: 0, fat: 0, carbs: 0 };

export function calculateTotals(
  meals: Record<string, MealPlan | null> | undefined,
  person: Person,
  recipes: Recipe[]
): PersonTotals {
  return Object.values(meals ?? {}).reduce<PersonTotals>((totals, meal) => {
    const recipe = meal ? recipes.find((r) => r.id === meal.recipeId) : undefined;
    if (!meal || !recipe) {
      return totals;
    }

    const { macros } = getRecipeVariant(recipe, person);
    return {
      kcal: totals.kcal + macros.K * meal.servings,
      protein: totals.protein + macros.B * meal.servings,
      fat: totals.fat + macros.T * meal.servings,
      carbs: totals.carbs + (macros.WP + macros.WW) * meal.servings,
    };
  }, EMPTY_TOTALS);
}

function SummaryColumn({ name, totals }: { name: string; totals: PersonTotals }) {
  return (
    <View className="flex-1 rounded-lg border border-amber-200 bg-white p-3">
      <Text className="text-center text-base font-bold text-amber-900">{name}</Text>
      <Text className="mt-2 text-center text-2xl font-bold text-amber-900">
        {Math.round(totals.kcal)} kcal
      </Text>
      <Text className="mt-2 text-xs text-slate-700">Białko: {totals.protein.toFixed(0)}g</Text>
      <Text className="text-xs text-slate-700">Tłuszcze: {totals.fat.toFixed(0)}g</Text>
      <Text className="text-xs text-slate-700">Węglowodany: {totals.carbs.toFixed(0)}g</Text>
    </View>
  );
}

export function DaySummary({ selectedDate }: DaySummaryProps) {
  const dayPlan = usePlanStore((state) => state.plan[selectedDate]);
  const { recipes } = useRecipes();

  const yourTotals = calculateTotals(dayPlan?.you, 'you', recipes);
  const partnerTotals = calculateTotals(dayPlan?.partner, 'partner', recipes);

  return (
    <View className="mx-2 mt-4 flex-row gap-2">
      <SummaryColumn name="NIKOLA" totals={yourTotals} />
      <SummaryColumn name="BARTEK" totals={partnerTotals} />
    </View>
  );
}
