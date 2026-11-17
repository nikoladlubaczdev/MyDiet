import { Text, View } from 'react-native';
import { MealCard } from './MealCard';
import { usePlanStore } from '../stores/usePlanStore';
import { useRecipes } from '../../recipes/hooks/useRecipes';
import { getRecipeVariant, type Recipe } from '@/shared/types/recipe';
import { normalizeProductName } from '@/shared/utils/normalizeProductName';

const MEAL_TYPES = ['Śniadanie', 'II Śniadanie', 'Obiad', 'Podwieczorek', 'Kolacja'];

interface SplitViewProps {
  selectedDate: string;
  onAddRecipe?: (slot: string, person: 'you' | 'partner') => void;
}

interface RecipeComparison {
  isSimilarRecipe: boolean;
  yourDifferences: Record<string, 'product' | 'amount'>;
  partnerDifferences: Record<string, 'product' | 'amount'>;
}

function compareRecipes(
  yourRecipe: Recipe | undefined,
  partnerRecipe: Recipe | undefined,
  yourServings: number,
  partnerServings: number
): RecipeComparison {
  const emptyComparison: RecipeComparison = {
    isSimilarRecipe: false,
    yourDifferences: {},
    partnerDifferences: {},
  };

  if (!yourRecipe || !partnerRecipe) {
    return emptyComparison;
  }

  const yourIngredients = new Map(
    getRecipeVariant(yourRecipe, 'you').ingredients.map((ingredient) => [
      normalizeProductName(ingredient.product),
      ingredient,
    ])
  );
  const partnerIngredients = new Map(
    getRecipeVariant(partnerRecipe, 'partner').ingredients.map((ingredient) => [
      normalizeProductName(ingredient.product),
      ingredient,
    ])
  );
  const allProducts = new Set([...yourIngredients.keys(), ...partnerIngredients.keys()]);
  const sharedProductCount = [...yourIngredients.keys()].filter((product) =>
    partnerIngredients.has(product)
  ).length;
  const smallerRecipeSize = Math.min(yourIngredients.size, partnerIngredients.size);

  if (smallerRecipeSize === 0 || sharedProductCount / smallerRecipeSize < 0.5) {
    return emptyComparison;
  }

  const yourDifferences: Record<string, 'product' | 'amount'> = {};
  const partnerDifferences: Record<string, 'product' | 'amount'> = {};

  allProducts.forEach((product) => {
    const yourIngredient = yourIngredients.get(product);
    const partnerIngredient = partnerIngredients.get(product);

    if (!yourIngredient || !partnerIngredient) {
      if (yourIngredient) {
        yourDifferences[yourIngredient.product] = 'product';
      }
      if (partnerIngredient) {
        partnerDifferences[partnerIngredient.product] = 'product';
      }
      return;
    }

    const yourAmount = yourIngredient.weight * yourServings;
    const partnerAmount = partnerIngredient.weight * partnerServings;
    if (yourIngredient.unit !== partnerIngredient.unit || yourAmount !== partnerAmount) {
      yourDifferences[yourIngredient.product] = 'amount';
      partnerDifferences[partnerIngredient.product] = 'amount';
    }
  });

  return {
    isSimilarRecipe: yourRecipe.id !== partnerRecipe.id,
    yourDifferences,
    partnerDifferences,
  };
}

export function SplitView({ selectedDate, onAddRecipe }: SplitViewProps) {
  const dayPlan = usePlanStore((state) => state.plan[selectedDate]);
  const { recipes } = useRecipes();

  return (
    <View className="gap-2 px-2 py-4">
      <View className="flex-row gap-2">
        <Text className="flex-1 px-2 text-sm font-bold text-amber-900">NIKOLA</Text>
        <Text className="flex-1 px-2 text-sm font-bold text-amber-900">BARTEK</Text>
      </View>

      {MEAL_TYPES.map((mealType) => {
        const yourMeal = dayPlan?.you?.[mealType];
        const partnerMeal = dayPlan?.partner?.[mealType];
        const isSharedRecipe = Boolean(
          yourMeal && partnerMeal && yourMeal.recipeId === partnerMeal.recipeId
        );
        const yourRecipe = recipes.find((recipe) => recipe.id === yourMeal?.recipeId);
        const partnerRecipe = recipes.find((recipe) => recipe.id === partnerMeal?.recipeId);
        const comparison = compareRecipes(
          yourRecipe,
          partnerRecipe,
          yourMeal?.servings ?? 1,
          partnerMeal?.servings ?? 1
        );

        return (
          <View key={mealType}>
          <View className="mb-1 flex-row gap-2">
            <Text className="flex-1 px-2 text-xs font-semibold text-slate-600">
              {mealType}
            </Text>
            <Text className="flex-1 px-2 text-xs font-semibold text-slate-600">
              {mealType}
            </Text>
          </View>

          {isSharedRecipe && (
            <View className="mb-1 items-center">
              <View className="rounded-full bg-emerald-100 px-3 py-1">
                <Text className="text-xs font-semibold text-emerald-800">
                  Wspólny przepis
                </Text>
              </View>
            </View>
          )}

          {comparison.isSimilarRecipe && (
            <View className="mb-1 items-center">
              <View className="rounded-full bg-amber-100 px-3 py-1">
                <Text className="text-xs font-semibold text-amber-800">
                  Podobne posiłki
                </Text>
              </View>
            </View>
          )}

          <View className="flex-row items-start gap-2">
            <View className="flex-1">
              <MealCard
                date={selectedDate}
                person="you"
                mealSlot={mealType}
                readonly={!onAddRecipe}
                isSharedRecipe={isSharedRecipe}
                isSimilarRecipe={comparison.isSimilarRecipe}
                ingredientDifferences={comparison.yourDifferences}
                onAddRecipe={onAddRecipe ? () => onAddRecipe(mealType, 'you') : undefined}
              />
            </View>
            <View className="flex-1">
              <MealCard
                date={selectedDate}
                person="partner"
                mealSlot={mealType}
                readonly={!onAddRecipe}
                isSharedRecipe={isSharedRecipe}
                isSimilarRecipe={comparison.isSimilarRecipe}
                ingredientDifferences={comparison.partnerDifferences}
                onAddRecipe={onAddRecipe ? () => onAddRecipe(mealType, 'partner') : undefined}
              />
            </View>
          </View>
          </View>
        );
      })}
    </View>
  );
}
