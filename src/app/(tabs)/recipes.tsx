import { FlatList, Text, View, Pressable, ScrollView } from 'react-native';
import { useRecipes } from '@/features/recipes/hooks/useRecipes';
import { Recipe, MealCategory } from '@/shared/types/recipe';
import { RecipeDetailsModal } from '@/features/recipes/components/RecipeDetailsModal';
import { useState } from 'react';

const categoryLabels: Record<MealCategory, string> = {
  'ś': 'Śniadanie',
  'o': 'Obiad',
  'k': 'Kolacja',
  'p': 'Przekąska',
  'sm': 'Smoothie',
};

export default function RecipesScreen() {
    const [selectedCategory, setSelectedCategory] = useState<MealCategory | undefined>();
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const { recipes, categories } = useRecipes({ category: selectedCategory });

    const renderRecipeItem = ({ item }: { item: Recipe }) => (
        <Pressable 
            onPress={() => setSelectedRecipe(item)}
            className="mb-3 rounded-2xl bg-white p-4 shadow-sm"
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${item.name} - ${item.categories.map(c => categoryLabels[c]).join(', ')}`}
        >
            <Text className="text-lg font-semibold text-amber-900">{item.name}</Text>
            <View className="mt-2 flex-row flex-wrap gap-2">
                {item.categories.map((cat) => (
                    <View key={cat} className="rounded-full bg-amber-100 px-3 py-1">
                        <Text className="text-xs font-medium text-amber-700">{categoryLabels[cat]}</Text>
                    </View>
                ))}
                <View className="rounded-full bg-blue-100 px-3 py-1">
                    <Text className="text-xs font-medium text-blue-700">{item.prepTimeMinutes}min</Text>
                </View>
            </View>
            <View className="mt-2 flex-row gap-2">
                <Text className="text-xs text-slate-500">K: {item.macros.K.toFixed(0)}</Text>
                <Text className="text-xs text-slate-500">B: {item.macros.B.toFixed(0)}</Text>
                <Text className="text-xs text-slate-500">T: {item.macros.T.toFixed(0)}</Text>
            </View>
        </Pressable>
    );

    return (
        <View className="flex-1 bg-amber-50 px-4 py-6">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                <View className="flex-row gap-2">
                    {categories.map((cat) => (
                        <Pressable
                            key={cat}
                            onPress={() => setSelectedCategory(cat)}
                            className={`rounded-full px-4 py-2 ${selectedCategory === cat ? 'bg-amber-200' : 'bg-white'}`}
                        >
                            <Text className={`text-xs font-semibold ${selectedCategory === cat ? 'text-amber-900' : 'text-slate-700'}`}>
                                {categoryLabels[cat]}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
            <FlatList
                data={recipes}
                renderItem={renderRecipeItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />
            <RecipeDetailsModal 
                recipe={selectedRecipe}
                isVisible={selectedRecipe !== null}
                onClose={() => setSelectedRecipe(null)}
            />
        </View>
    );
}
