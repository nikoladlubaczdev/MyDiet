import { useRecipes } from '@/features/recipes/hooks/useRecipes';
import type { MealCategory, Person, Recipe } from '@/shared/types/recipe';
import { getRecipeVariant } from '@/shared/types/recipe';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

interface AddRecipeBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (recipeId: string, servings: number, forBoth: boolean) => void;
  mealSlot: string;
  person: Person;
}

const categoryLabels: Record<MealCategory, string> = {
  'ś': 'Śniadanie',
  'o': 'Obiad',
  'k': 'Kolacja',
  'p': 'Przekąska',
  'sm': 'Smoothie',
};

const defaultCategoryBySlot: Record<string, MealCategory> = {
  'Śniadanie': 'ś',
  'II Śniadanie': 'p',
  'Obiad': 'o',
  'Podwieczorek': 'p',
  'Kolacja': 'k',
};

function getDefaultCategory(mealSlot: string): MealCategory | undefined {
  return defaultCategoryBySlot[mealSlot];
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

function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: MealCategory[];
  selectedCategory: MealCategory | undefined;
  onSelectCategory: (category: MealCategory | undefined) => void;
}) {
  const chips: { key: string; label: string; value: MealCategory | undefined }[] = [
    { key: 'all', label: 'Wszystkie', value: undefined },
    ...categories.map((cat) => ({ key: cat, label: categoryLabels[cat], value: cat })),
  ];

  return (
    <View className="border-b border-amber-100">
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
      <View className="flex-row gap-2">
        {chips.map(({ key, label, value }) => (
          <Pressable
            key={key}
            onPress={() => onSelectCategory(value)}
            accessible={true}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === value }}
            className={`rounded-full px-4 py-2 ${selectedCategory === value ? 'bg-amber-200' : 'bg-white'}`}
          >
            <Text className={`text-xs font-semibold ${selectedCategory === value ? 'text-amber-900' : 'text-slate-700'}`}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      </ScrollView>
    </View>
  );
}

function RecipesList({
  recipes,
  person,
  onSelectRecipe,
}: {
  recipes: Recipe[] | undefined;
  person: Person;
  onSelectRecipe: (recipe: Recipe, forBoth: boolean) => void;
}) {
  if (!recipes || recipes.length === 0) {
    return (
      <View className="bg-white px-4 py-8">
        <Text className="text-center text-slate-500">Brak przepisów</Text>
      </View>
    );
  }

  return recipes.map((recipe) => (
    <View
      key={recipe.id}
      className="flex-row items-center border-b border-amber-100 bg-white"
    >
      <Pressable
        onPress={() => onSelectRecipe(recipe, false)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Wybierz przepis ${recipe.name}`}
        className="flex-1 px-4 py-3"
      >
        <Text className="text-base text-slate-900">{recipe.name}</Text>
        <Text className="text-xs text-slate-500">
          {Math.round(getRecipeVariant(recipe, person).macros.K)} kcal
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onSelectRecipe(recipe, true)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Dodaj ${recipe.name} dla obu osób`}
        className="mr-4 rounded-full bg-amber-100 p-2"
      >
        <Ionicons name="people-outline" size={18} color="#78350f" />
      </Pressable>
    </View>
  ));
}

export function AddRecipeBottomSheet({
  isVisible,
  onClose,
  onAdd,
  mealSlot,
  person,
}: AddRecipeBottomSheetProps) {
  const [selectedCategory, setSelectedCategory] = useState<MealCategory | undefined>(() =>
    getDefaultCategory(mealSlot)
  );
  const { recipes, categories } = useRecipes({ category: selectedCategory });

  useEffect(() => {
    if (!isVisible) {
      return;
    }
    setSelectedCategory(getDefaultCategory(mealSlot));
  }, [isVisible, mealSlot]);

  const handleRecipeSelect = (recipe: Recipe, forBoth: boolean) => {
    onAdd(recipe.id, 1, forBoth);
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
          <Header mealSlot={mealSlot} recipeCount={recipes.length} />
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <ScrollView>
            <View>
              <RecipesList recipes={recipes} person={person} onSelectRecipe={handleRecipeSelect} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
