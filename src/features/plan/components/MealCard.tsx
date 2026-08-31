import { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { usePlanStore } from '../stores/usePlanStore';
import { useRecipes } from '@/features/recipes/hooks/useRecipes';

const MEAL_TYPES = ['Śniadanie', 'II Śniadanie', 'Obiad', 'Podwieczorek', 'Kolacja'];

interface MealCardProps {
  date: string;
  person: 'you' | 'partner';
  mealSlot: string;
  readonly?: boolean;
  isSharedRecipe?: boolean;
  isSimilarRecipe?: boolean;
  ingredientDifferences?: Record<string, 'product' | 'amount'>;
  onAddRecipe?: () => void;
}

export function MealCard({
  date,
  person,
  mealSlot,
  readonly = false,
  isSharedRecipe = false,
  isSimilarRecipe = false,
  ingredientDifferences = {},
  onAddRecipe,
}: MealCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const getMealForSlot = usePlanStore((state) => state.getMealForSlot);
  const removeMeal = usePlanStore((state) => state.removeMeal);
  const { recipes } = useRecipes();

  const meal = getMealForSlot(date, person, mealSlot);
  const recipe = meal ? recipes.find((r) => r.id === meal.recipeId) : null;

  if (!recipe) {
    return (
      <Pressable
        onPress={onAddRecipe}
        className="items-center justify-center rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 py-6"
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Dodaj posiłek"
      >
        <Text className="text-base font-semibold text-amber-700">+ Dodaj posiłek</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => setIsExpanded(!isExpanded)}
      className={`rounded-lg border bg-white p-3 ${
        isSharedRecipe
          ? 'border-2 border-emerald-400'
          : isSimilarRecipe
            ? 'border-2 border-amber-400'
            : 'border-amber-200'
      } ${
        readonly ? 'opacity-90' : ''
      }`}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={
        isSharedRecipe
          ? 'Karta wspólnego przepisu'
          : isSimilarRecipe
            ? 'Karta podobnego posiłku'
            : 'Karta przepisu'
      }
    >
      {/* Collapsed View */}
      {!isExpanded && (
        <View>
          <Text className="text-sm font-bold text-amber-900">{recipe.name}</Text>
          <Text className="mt-1 text-xs text-slate-600">Składniki:</Text>
          {recipe.ingredients.slice(0, 2).map((ing, idx) => (
            <Text key={idx} className="text-xs text-slate-600">
              • {ing.product} {ing.weight}{ing.unit}
            </Text>
          ))}
          {recipe.ingredients.length > 2 && (
            <Text className="text-xs text-slate-600">• +{recipe.ingredients.length - 2} więcej</Text>
          )}
          <Text className="mt-2 text-xs text-slate-500">
            {Math.round(recipe.macros.K * meal.servings)} kcal | {meal.servings} porcje |{' '}
            {recipe.prepTimeMinutes} min
          </Text>
        </View>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <View>
          <Text className="text-sm font-bold text-amber-900">{recipe.name}</Text>
          <Text className="mt-3 text-xs font-semibold text-slate-800">
            Składniki ({meal.servings} porcje):
          </Text>
          {recipe.ingredients.map((ing, idx) => {
            const difference = ingredientDifferences[ing.product];
            const amount = `${ing.weight * meal.servings}${ing.unit}`;

            if (difference === 'product') {
              return (
                <View key={idx} className="my-0.5 rounded-md bg-amber-100 px-2 py-1">
                  <Text className="text-xs font-bold text-amber-900">
                    • {ing.product} ({amount})
                  </Text>
                </View>
              );
            }

            return (
              <View
                key={idx}
                className={difference === 'amount' ? 'my-0.5 rounded-md bg-amber-50 px-2 py-1' : ''}
              >
                <Text className="text-xs text-slate-700">
                  • {ing.product} (
                  <Text className={difference === 'amount' ? 'font-bold text-amber-900' : ''}>
                    {amount}
                  </Text>
                  )
                </Text>
              </View>
            );
          })}

          <Text className="mt-3 text-xs font-semibold text-slate-800">Instrukcje:</Text>
          {recipe.instructions.map((instr, idx) => (
            <Text key={idx} className="text-xs text-slate-700">
              {idx + 1}. {instr}
            </Text>
          ))}

          <View className="mt-3 rounded-lg bg-slate-50 p-2">
            <Text className="text-xs font-semibold text-slate-800">📊 Makroskładniki:</Text>
            <Text className="text-xs text-slate-700">
              Kalorie: {Math.round(recipe.macros.K * meal.servings)} kcal
            </Text>
            <Text className="text-xs text-slate-700">
              Białko: {(recipe.macros.B * meal.servings).toFixed(0)}g | Tłuszcze:{' '}
              {(recipe.macros.T * meal.servings).toFixed(0)}g
            </Text>
            <Text className="text-xs text-slate-700">
              Węglowodany: {((recipe.macros.WP + recipe.macros.WW) * meal.servings).toFixed(0)}g
            </Text>
          </View>

          <Text className="mt-2 text-xs text-slate-600">⏱️ Czas przygotowania: {recipe.prepTimeMinutes} min</Text>

          {!readonly && (
            <View className="mt-4 flex-row gap-2">
              <Pressable
                className="flex-1 rounded-lg bg-amber-100 py-2"
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Edytuj porcje"
              >
                <Text className="text-center text-xs font-semibold text-amber-900">
                  Edytuj porcje
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  removeMeal(date, person, mealSlot);
                  setIsExpanded(false);
                }}
                className="flex-1 rounded-lg bg-red-100 py-2"
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Usuń"
              >
                <Text className="text-center text-xs font-semibold text-red-900">Usuń</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}
