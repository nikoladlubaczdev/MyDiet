import { Text, View } from 'react-native';
import { MealCard } from './MealCard';

const MEAL_TYPES = ['Śniadanie', 'II Śniadanie', 'Obiad', 'Podwieczorek', 'Kolacja'];

interface SplitViewProps {
  selectedDate: string;
  onAddRecipe?: (slot: string, person: 'you' | 'partner') => void;
  onOpenAddRecipe?: () => void;
}

export function SplitView({ selectedDate, onAddRecipe, onOpenAddRecipe }: SplitViewProps) {
  return (
    <View className="flex-row gap-2 px-2 py-4">
      {/* You - Left */}
      <View className="flex-1">
        <Text className="mb-2 px-2 text-sm font-bold text-amber-900">TY</Text>
        <View className="gap-2">
          {MEAL_TYPES.map((mealType) => (
            <View key={`you-${mealType}`}>
              <Text className="mb-1 px-2 text-xs font-semibold text-slate-600">
                {mealType}
              </Text>
              <MealCard 
                date={selectedDate} 
                person="you" 
                mealSlot={mealType} 
                readonly={!onAddRecipe}
                onAddRecipe={onAddRecipe ? () => {
                  onAddRecipe(mealType, 'you');
                  onOpenAddRecipe?.();
                } : undefined}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Partner - Right */}
      <View className="flex-1">
        <Text className="mb-2 px-2 text-sm font-bold text-amber-900">PARTNER</Text>
        <View className="gap-2">
          {MEAL_TYPES.map((mealType) => (
            <View key={`partner-${mealType}`}>
              <Text className="mb-1 px-2 text-xs font-semibold text-slate-600">
                {mealType}
              </Text>
              <MealCard 
                date={selectedDate} 
                person="partner" 
                mealSlot={mealType} 
                readonly={!onAddRecipe}
                onAddRecipe={onAddRecipe ? () => {
                  onAddRecipe(mealType, 'partner');
                  onOpenAddRecipe?.();
                } : undefined}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
