import { useRecipes } from '@/features/recipes/hooks/useRecipes';
import type { Recipe } from '@/shared/types/recipe';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

interface AddRecipeBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (recipeId: string, servings: number) => void;
  mealSlot: string;
}

function Header({ mealSlot, recipeCount }: { mealSlot: string; recipeCount: number }) {
  return (
    <View className="border-b border-amber-200 px-6 py-6">
      <Text className="text-lg font-bold text-amber-900">
        Dodaj przepis do {mealSlot}
      </Text>
      <Text className="text-xs text-slate-500">{recipeCount} przepisów</Text>
    </View>
  );
}

function RecipesList({
  recipes,
  onSelectRecipe,
}: {
  recipes: Recipe[] | undefined;
  onSelectRecipe: (recipe: Recipe) => void;
}) {
  if (!recipes || recipes.length === 0) {
    return (
      <View className="bg-white px-4 py-8">
        <Text className="text-center text-slate-500">Brak przepisów</Text>
      </View>
    );
  }

  return recipes.map((recipe) => (
    <Pressable
      key={recipe.id}
      onPress={() => onSelectRecipe(recipe)}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Wybierz przepis ${recipe.name}`}
      className="border-b border-amber-100 bg-white px-4 py-3"
    >
      <Text className="text-base text-slate-900">{recipe.name}</Text>
      <Text className="text-xs text-slate-500">Porcji: {recipe.servings || 1}</Text>
    </Pressable>
  ));
}

export function AddRecipeBottomSheet({
  isVisible,
  onClose,
  onAdd,
  mealSlot,
}: AddRecipeBottomSheetProps) {
  const { recipes } = useRecipes();

  const handleRecipeSelect = (recipe: Recipe) => {
    onAdd(recipe.id, recipe.servings || 1);
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <Pressable
          className="flex-1"
          onPress={onClose}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Zamknij wybór przepisu"
        />
        <View className="max-h-[75%] overflow-hidden rounded-t-3xl bg-white pb-8">
          <Header mealSlot={mealSlot} recipeCount={recipes?.length || 0} />
          <ScrollView>
            <View>
              <RecipesList recipes={recipes} onSelectRecipe={handleRecipeSelect} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
