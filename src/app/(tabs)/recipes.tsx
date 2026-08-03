import { FlatList, Text, View, Pressable } from 'react-native';
import { useRecipes } from '@/features/recipes/hooks/useRecipes';
import { Recipe } from '@/shared/types/recipe';

export default function RecipesScreen() {
    const { recipes, categories } = useRecipes();

    const renderRecipeItem = ({ item }: { item: Recipe }) => (
        <Pressable 
            className="mb-3 rounded-2xl bg-white p-4 shadow-sm"
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${item.name} - ${item.category}`}
        >
            <Text className="text-lg font-semibold text-amber-900">{item.name}</Text>
            <View className="mt-2 flex-row gap-2">
                <View className="rounded-full bg-amber-100 px-3 py-1">
                    <Text className="text-xs font-medium text-amber-700">{item.category}</Text>
                </View>
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
            <Text className="mb-2 text-3xl font-bold text-amber-900">📖 Przepisy</Text>
            <Text className="mb-4 text-sm text-slate-600">
                {recipes.length} przepisów
            </Text>
            <View className="mb-4 flex-row gap-2">
                <View className="rounded-full bg-amber-200 px-4 py-2">
                    <Text className="text-xs font-semibold text-amber-900">Wszystkie</Text>
                </View>
                {categories.slice(0, 3).map((cat) => (
                    <View key={cat} className="rounded-full bg-white px-4 py-2">
                        <Text className="text-xs font-medium text-slate-700">{cat}</Text>
                    </View>
                ))}
            </View>
            <FlatList
                data={recipes}
                renderItem={renderRecipeItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
