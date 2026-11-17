import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRecipes } from '@/features/recipes/hooks/useRecipes';
import { getRecipeVariant, type Person, type Recipe } from '@/shared/types/recipe';
import { usePlanStore, type MealPlan } from '../stores/usePlanStore';

interface DaySummaryProps {
  selectedDate: string;
  onGoToEdit: () => void;
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

export function DaySummary({ selectedDate, onGoToEdit }: DaySummaryProps) {
  const dayPlan = usePlanStore((state) => state.plan[selectedDate]);
  const { recipes } = useRecipes();

  const hasAnyMeals = [dayPlan?.you, dayPlan?.partner].some((meals) =>
    Object.values(meals ?? {}).some(Boolean)
  );

  if (!hasAnyMeals) {
    return (
      <View className="mx-2 mt-4 items-center rounded-lg border border-amber-200 bg-white p-6">
        <Ionicons name="calendar-outline" size={32} color="#b45309" />
        <Text className="mt-2 text-center text-base font-semibold text-amber-900">
          Brak zaplanowanych posiłków
        </Text>
        <Text className="mt-1 text-center text-sm text-slate-600">
          Dodaj posiłki w edycji, a tutaj zobaczysz sumę kalorii i makroskładników.
        </Text>
        <Pressable
          onPress={onGoToEdit}
          accessibilityRole="button"
          accessibilityLabel="Przejdź do edycji"
          className="mt-4 rounded-full bg-amber-500 px-5 py-2"
        >
          <Text className="text-sm font-semibold text-white">Przejdź do edycji</Text>
        </Pressable>
      </View>
    );
  }

  const yourTotals = calculateTotals(dayPlan?.you, 'you', recipes);
  const partnerTotals = calculateTotals(dayPlan?.partner, 'partner', recipes);

  return (
    <View className="mx-2 mt-4 flex-row gap-2">
      <SummaryColumn name="NIKOLA" totals={yourTotals} />
      <SummaryColumn name="BARTEK" totals={partnerTotals} />
    </View>
  );
}
