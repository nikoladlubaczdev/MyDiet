import { useState } from 'react';
import { BottomSheet, Group, Host } from '@expo/ui/swift-ui';
import type { PresentationDetent } from '@expo/ui/swift-ui/modifiers';
import { presentationDetents, presentationDragIndicator } from '@expo/ui/swift-ui/modifiers';
import { ScrollView, Text, View, Pressable, FlatList } from 'react-native';
import { useRecipes } from '@/features/recipes/hooks/useRecipes';
import { Recipe } from '@/shared/types/recipe';

interface AddRecipeBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (recipeId: string, servings: number) => void;
  mealSlot: string;
}

export function AddRecipeBottomSheet({
  isVisible,
  onClose,
  onAdd,
  mealSlot,
}: AddRecipeBottomSheetProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [servings, setServings] = useState(2);
  const { recipes } = useRecipes();

  const handleAdd = () => {
    if (selectedRecipe) {
      onAdd(selectedRecipe.id, servings);
      // Reset state
      setSelectedRecipe(null);
      setServings(2);
      onClose();
    }
  };

  const detents: PresentationDetent[] = [{ fraction: 0.8 }, 'large'];

  return (
    <Host>
      <BottomSheet isPresented={isVisible} onIsPresentedChange={onClose}>
        <Group modifiers={[presentationDetents(detents), presentationDragIndicator('visible')]}>
          <ScrollView className="flex-1 bg-amber-50">
            {!selectedRecipe ? (
              // Recipe List View
              <View className="flex-1">
                <View className="border-b border-amber-200 bg-white px-4 py-4">
                  <Text className="text-lg font-bold text-amber-900">
                    Dodaj przepis do {mealSlot}
                  </Text>
                </View>

                <FlatList
                  scrollEnabled={false}
                  data={recipes}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => setSelectedRecipe(item)}
                      className="border-b border-amber-100 bg-white px-4 py-3"
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={item.name}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="font-semibold text-amber-900">{item.name}</Text>
                          <Text className="mt-1 text-xs text-slate-600">
                            {item.macros.K.toFixed(0)} kcal • {item.prepTimeMinutes} min
                          </Text>
                        </View>
                        <Text className="text-xl">→</Text>
                      </View>
                    </Pressable>
                  )}
                />
              </View>
            ) : (
              // Recipe Details & Servings View
              <View className="flex-1">
                <View className="border-b border-amber-200 bg-white px-4 py-4">
                  <Pressable
                    onPress={() => setSelectedRecipe(null)}
                    className="flex-row items-center gap-2"
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Wróć"
                  >
                    <Text className="text-xl">←</Text>
                    <Text className="text-lg font-bold text-amber-900">{selectedRecipe.name}</Text>
                  </Pressable>
                </View>

                <View className="px-4 py-6">
                  {/* Servings Section */}
                  <View className="rounded-lg bg-white p-4">
                    <Text className="mb-4 text-sm font-semibold text-amber-900">
                      Liczba porcji:
                    </Text>

                    <View className="flex-row items-center justify-between rounded-lg bg-amber-50 px-4 py-3">
                      <Pressable
                        onPress={() => servings > 1 && setServings(servings - 1)}
                        className="h-10 w-10 items-center justify-center rounded-md bg-amber-200"
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="Zmniejsz porcje"
                      >
                        <Text className="text-lg font-bold text-amber-900">−</Text>
                      </Pressable>

                      <Text className="text-center text-2xl font-bold text-amber-900 w-12">
                        {servings}
                      </Text>

                      <Pressable
                        onPress={() => setServings(servings + 1)}
                        className="h-10 w-10 items-center justify-center rounded-md bg-amber-200"
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="Zwiększ porcje"
                      >
                        <Text className="text-lg font-bold text-amber-900">+</Text>
                      </Pressable>
                    </View>

                    <View className="mt-4 rounded-lg bg-slate-50 p-3">
                      <Text className="text-xs font-semibold text-slate-700">
                        Całkowite kalorie:
                      </Text>
                      <Text className="mt-1 text-2xl font-bold text-amber-900">
                        {Math.round(selectedRecipe.macros.K * servings)} kcal
                      </Text>
                    </View>
                  </View>

                  {/* Info */}
                  <View className="mt-4 rounded-lg bg-white p-4">
                    <Text className="text-sm text-slate-600">
                      Domyślnie: {selectedRecipe.ingredients.length} składników
                    </Text>
                    <Text className="text-sm text-slate-600">
                      Czas przygotowania: {selectedRecipe.prepTimeMinutes} min
                    </Text>
                  </View>

                  {/* Add Button */}
                  <Pressable
                    onPress={handleAdd}
                    className="mt-6 rounded-lg bg-amber-500 py-4"
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Dodaj do planu"
                  >
                    <Text className="text-center text-base font-bold text-white">
                      Dodaj do planu
                    </Text>
                  </Pressable>

                  {/* Cancel Button */}
                  <Pressable
                    onPress={onClose}
                    className="mt-2 rounded-lg border border-slate-300 py-3"
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Anuluj"
                  >
                    <Text className="text-center text-base font-semibold text-slate-700">
                      Anuluj
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>
        </Group>
      </BottomSheet>
    </Host>
  );
}
