import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { Recipe, MealCategory } from '@/shared/types/recipe';

const categoryLabels: Record<MealCategory, string> = {
  'ś': 'Śniadanie',
  'o': 'Obiad',
  'k': 'Kolacja',
  'p': 'Przekąska',
  'sm': 'Smoothie',
};

interface RecipeDetailsModalProps {
  recipe: Recipe | null;
  isVisible: boolean;
  onClose: () => void;
}

export function RecipeDetailsModal({ recipe, isVisible, onClose }: RecipeDetailsModalProps) {
  if (!recipe) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <ScrollView className="flex-1 bg-amber-50">
        {/* Header */}
        <View className="bg-gradient-to-b from-amber-100 to-amber-50 px-4 py-6">
          <Pressable
            onPress={onClose}
            className="mb-4 h-10 w-10 items-center justify-center rounded-full bg-white"
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Zamknij"
          >
            <Text className="text-xl font-bold text-amber-900">×</Text>
          </Pressable>

          <Text className="mb-3 text-3xl font-bold text-amber-900">{recipe.name}</Text>

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
              <Text className="text-xs font-medium text-slate-600">Kcal</Text>
              <Text className="text-lg font-bold text-amber-900">{recipe.macros.K.toFixed(0)}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-4 py-6">
          {/* Ingredients */}
          <View className="mb-6">
            <Text className="mb-3 text-xl font-bold text-amber-900">Składniki</Text>
            <View className="gap-2 rounded-xl bg-white p-4">
              {recipe.ingredients.map((ingredient, idx) => (
                <View key={idx} className="flex-row items-start justify-between border-b border-amber-100 pb-2 last:border-0">
                  <View className="flex-1">
                    <Text className="font-medium text-slate-800">{ingredient.product}</Text>
                    {ingredient.hint && <Text className="text-xs text-slate-500">{ingredient.hint}</Text>}
                  </View>
                  <Text className="ml-2 text-sm font-semibold text-amber-900">
                    {ingredient.weight} {ingredient.unit}
                  </Text>
                </View>
              ))}
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
          <View className="mb-6">
            <Text className="mb-3 text-xl font-bold text-amber-900">Makroelementy</Text>
            <View className="gap-2">
              <View className="flex-row gap-2">
                <MacroCard label="Białko" value={recipe.macros.B} unit="g" color="bg-red-100" textColor="text-red-900" />
                <MacroCard label="Tłuszcze" value={recipe.macros.T} unit="g" color="bg-yellow-100" textColor="text-yellow-900" />
                <MacroCard label="Węglowodany" value={recipe.macros.WP + recipe.macros.WW} unit="g" color="bg-green-100" textColor="text-green-900" />
              </View>
              <View className="flex-row gap-2">
                <MacroCard label="Włókno" value={recipe.macros.F} unit="g" color="bg-purple-100" textColor="text-purple-900" />
                <MacroCard label="Ww. Proste" value={recipe.macros.WP} unit="g" color="bg-orange-100" textColor="text-orange-900" />
                <MacroCard label="Ww. Złożone" value={recipe.macros.WW} unit="g" color="bg-cyan-100" textColor="text-cyan-900" />
              </View>
            </View>
          </View>

          {/* Close Button */}
          <Pressable
            onPress={onClose}
            className="mb-8 rounded-xl bg-amber-200 py-4"
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Zamknij szczegóły przepisu"
          >
            <Text className="text-center text-base font-bold text-amber-900">Zamknij</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Modal>
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
