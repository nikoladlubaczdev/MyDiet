import type { DayPlan } from '@/features/plan/stores/usePlanStore';
import type { Recipe, WeightUnit } from '@/shared/types/recipe';
import type { ShoppingListItem } from '../types/shoppingList';

interface AggregatedItem {
  product: string;
  weight: number;
  unit: WeightUnit;
}

const normalizeProductName = (product: string) =>
  product
    .toLocaleLowerCase('pl')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

export function createShoppingListItems(
  plan: Record<string, DayPlan>,
  dates: string[],
  recipes: Recipe[]
): ShoppingListItem[] {
  const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const aggregatedItems = new Map<string, AggregatedItem>();

  dates.forEach((date) => {
    const dayPlan = plan[date];
    if (!dayPlan) {
      return;
    }

    Object.values(dayPlan).forEach((personPlan) => {
      Object.values(personPlan).forEach((meal) => {
        if (!meal) {
          return;
        }

        const recipe = recipesById.get(meal.recipeId);
        if (!recipe) {
          return;
        }

        recipe.ingredients.forEach((ingredient) => {
          const normalizedProduct = normalizeProductName(ingredient.product);
          const itemId = `${normalizedProduct}-${ingredient.unit}`;
          const existingItem = aggregatedItems.get(itemId);
          const weight = ingredient.weight * meal.servings;

          aggregatedItems.set(itemId, {
            product: existingItem?.product ?? ingredient.product,
            weight: (existingItem?.weight ?? 0) + weight,
            unit: ingredient.unit,
          });
        });
      });
    });
  });

  return [...aggregatedItems.entries()]
    .map(([id, item]) => ({
      id,
      ...item,
      isChecked: false,
    }))
    .sort((firstItem, secondItem) =>
      firstItem.product.localeCompare(secondItem.product, 'pl')
    );
}
