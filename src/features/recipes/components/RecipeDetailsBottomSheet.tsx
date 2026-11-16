import { MealCategory, Recipe } from '@/shared/types/recipe';
import { BottomSheet, Group, Host } from '@expo/ui/swift-ui';
import type { PresentationDetent } from '@expo/ui/swift-ui/modifiers';
import { presentationDetents, presentationDragIndicator } from '@expo/ui/swift-ui/modifiers';
import { ScrollView, Text, View } from 'react-native';
import { useMemo } from 'react';
import { normalizeProductName } from '@/shared/utils/normalizeProductName';

const categoryLabels: Record<MealCategory, string> = {
  'ś': 'Śniadanie',
  'o': 'Obiad',
  'k': 'Kolacja',
  'p': 'Przekąska',
  'sm': 'Smoothie',
};

type Ingredient = Recipe['ingredients'][number];

interface IngredientRow {
  product: string;
  nikola?: Ingredient;
  bartek?: Ingredient;
}

function buildIngredientRows(nikolaIngredients: Ingredient[], bartekIngredients?: Ingredient[]): IngredientRow[] {
  const rows = new Map<string, IngredientRow>();

  nikolaIngredients.forEach((ingredient) => {
    rows.set(normalizeProductName(ingredient.product), { product: ingredient.product, nikola: ingredient });
  });

  bartekIngredients?.forEach((ingredient) => {
    const key = normalizeProductName(ingredient.product);
    const existing = rows.get(key);
    if (existing) {
      existing.bartek = ingredient;
    } else {
      rows.set(key, { product: ingredient.product, bartek: ingredient });
    }
  });

  return [...rows.values()];
}

function formatAmount(ingredient?: Ingredient) {
  if (!ingredient) return { text: '-', hint: undefined };
  return { text: `${ingredient.weight} ${ingredient.unit}`, hint: ingredient.hint };
}

interface RecipeDetailsBottomSheetProps {
  recipe: Recipe | null;
  isVisible: boolean;
  onClose: () => void;
}

export function RecipeDetailsBottomSheet({ recipe, isVisible, onClose }: RecipeDetailsBottomSheetProps) {
  if (!recipe) return null;

  const personVariants = recipe.partnerVariant
    ? [
      { label: 'Nikola', variant: recipe },
      { label: 'Bartek', variant: recipe.partnerVariant },
    ]
    : [{ label: '', variant: recipe }];

  const detents: PresentationDetent[] = useMemo(() => {
    return [{ fraction: 0.6 }, 'large'];
  }, []);

  return (
    <Host>
      <BottomSheet isPresented={isVisible} onIsPresentedChange={onClose} >
        <Group modifiers={[presentationDetents(detents), presentationDragIndicator('visible')]}>
          <ScrollView className="flex-1 bg-amber-50 ">
            <View className="mt-2 ml-6 bg-gradient-to-b from-amber-100 to-amber-50 py-6 ">
              <Text className="mb-3 mt-6 text-center text-3xl font-bold text-amber-900">{recipe.name}</Text>
              <View className="mb-3 flex-row flex-wrap gap-2">
                {recipe.categories.map((cat) => (
                  <View key={cat} className="rounded-full bg-amber-200 px-3 py-1">
                    <Text className="text-xs font-semibold text-amber-900">{categoryLabels[cat]}</Text>
                  </View>
                ))}
              </View>
              <View className="flex-row items-center gap-3">
                <View className="flex-1 rounded-lg bg-white px-3 py-2">
                  <Text className="text-xs font-medium text-slate-600">Czas przygotowania</Text>
                  <Text className="text-lg font-bold text-amber-900">{recipe.prepTimeMinutes} min</Text>
                </View>
                <View className="flex-1 rounded-lg bg-white px-3 py-2">
                  <Text className="text-xs font-medium text-slate-600">Kcal Nikola</Text>
                  <Text className="text-lg font-bold text-amber-900">{recipe.macros.K.toFixed(0)}</Text>
                </View>
                {recipe.partnerVariant && (
                  <View className="flex-1 rounded-lg bg-white px-3 py-2">
                    <Text className="text-xs font-medium text-slate-600">Kcal Bartek</Text>
                    <Text className="text-lg font-bold text-amber-900">{recipe.partnerVariant.macros.K.toFixed(0)}</Text>
                  </View>
                )}
              </View>
            </View>
            {/* Content */}
            <View className="ml-6 py-3">
              {/* Ingredients */}
              <View className="mb-2 w-full">
                <Text className="mb-3 text-xl font-bold text-amber-900">Składniki</Text>
                <View className="w-full rounded-xl bg-white p-4">
                  <View className="w-full flex-row border-b border-amber-200 pb-2">
                    <Text className="flex-1 text-xs font-semibold uppercase text-slate-600">Składnik</Text>
                    <Text className="w-24 text-right text-xs font-semibold uppercase text-amber-900">Nikola</Text>
                    {recipe.partnerVariant && (
                      <Text className="w-24 text-right text-xs font-semibold uppercase text-amber-900">Bartek</Text>
                    )}
                  </View>
                  {buildIngredientRows(recipe.ingredients, recipe.partnerVariant?.ingredients).map((row) => {
                    const nikolaAmount = formatAmount(row.nikola);
                    const bartekAmount = formatAmount(row.bartek);
                    return (
                      <View key={row.product} className="w-full flex-row items-start border-b border-amber-100 py-2 last:border-0">
                        <Text className="flex-1 font-medium text-slate-800">{row.product}</Text>
                        <View className="w-24 items-end">
                          <Text className="text-sm font-semibold text-amber-900">{nikolaAmount.text}</Text>
                          {nikolaAmount.hint && <Text className="text-right text-xs text-slate-500">{nikolaAmount.hint}</Text>}
                        </View>
                        {recipe.partnerVariant && (
                          <View className="w-24 items-end">
                            <Text className="text-sm font-semibold text-amber-900">{bartekAmount.text}</Text>
                            {bartekAmount.hint && <Text className="text-right text-xs text-slate-500">{bartekAmount.hint}</Text>}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Instructions */}
              <View className="mb-6">
                <Text className="mb-3 text-xl font-bold text-amber-900">Instrukcja</Text>
                <View className="gap-3">
                  {recipe.instructions.map((instruction, idx) => (
                    <View key={idx} className="flex-row gap-3 rounded-xl bg-white p-4">
                      <View className="h-7 w-7 items-center justify-center rounded-full bg-amber-200">
                        <Text className="font-bold text-amber-900">{idx + 1}</Text>
                      </View>
                      <Text className="flex-1 text-base text-slate-800">{instruction}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Tips */}
              {recipe.tips && recipe.tips.length > 0 && (
                <View className="mb-6">
                  <Text className="mb-3 text-xl font-bold text-amber-900">💡 Porady</Text>
                  <View className="gap-2 rounded-xl bg-blue-50 p-4">
                    {recipe.tips.map((tip, idx) => (
                      <View key={idx} className="flex-row gap-2 border-b border-blue-100 pb-2 last:border-0">
                        <Text className="text-blue-600">•</Text>
                        <Text className="flex-1 text-sm text-blue-900">{tip}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Macros */}
              {personVariants.map(({ label, variant }) => (
                <View key={label} className="mb-6">
                  <Text className="mb-3 text-xl font-bold text-amber-900">
                    {label ? `Makroelementy: ${label}` : 'Makroelementy'}
                  </Text>
                  <View className="gap-2">
                    <View className="flex-row gap-2">
                      <MacroCard label="Białko" value={variant.macros.B} unit="g" color="bg-red-100" textColor="text-red-900" />
                      <MacroCard label="Tłuszcze" value={variant.macros.T} unit="g" color="bg-yellow-100" textColor="text-yellow-900" />
                      <MacroCard label="Węglowodany" value={variant.macros.WP + variant.macros.WW} unit="g" color="bg-green-100" textColor="text-green-900" />
                    </View>
                    <View className="flex-row gap-2">
                      <MacroCard label="Włókno" value={variant.macros.F} unit="g" color="bg-purple-100" textColor="text-purple-900" />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </Group>
      </BottomSheet>
    </Host>
  );
}

interface MacroCardProps {
  label: string;
  value: number;
  unit: string;
  color: string;
  textColor: string;
}

function MacroCard({ label, value, unit, color, textColor }: MacroCardProps) {
  return (
    <View className={`flex-1 rounded-lg ${color} p-3`}>
      <Text className={`text-xs font-medium ${textColor}`}>{label}</Text>
      <Text className={`text-lg font-bold ${textColor}`}>
        {value.toFixed(1)} {unit}
      </Text>
    </View>
  );
}
