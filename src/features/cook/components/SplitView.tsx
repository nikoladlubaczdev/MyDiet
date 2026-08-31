import { Text, View } from 'react-native';
import { MealCard } from '../../plan/components/MealCard';

const MEAL_TYPES = ['Śniadanie', 'II Śniadanie', 'Obiad', 'Podwieczorek', 'Kolacja'];

interface SplitViewProps {
  selectedDate: string;
  onAddRecipe?: (slot: string, person: 'you' | 'partner') => void;
  onOpenAddRecipe?: () => void;
}

export function SplitView({ selectedDate, onAddRecipe, onOpenAddRecipe }: SplitViewProps) {
  return (
    <View className="gap-2 px-2 py-4">
      <View className="flex-row gap-2">
        <Text className="flex-1 px-2 text-sm font-bold text-amber-900">TY</Text>
        <Text className="flex-1 px-2 text-sm font-bold text-amber-900">PARTNER</Text>
      </View>

      {MEAL_TYPES.map((mealType) => (
        <View key={mealType}>
          <View className="mb-1 flex-row gap-2">
            <Text className="flex-1 px-2 text-xs font-semibold text-slate-600">
              {mealType}
            </Text>
            <Text className="flex-1 px-2 text-xs font-semibold text-slate-600">
              {mealType}
            </Text>
          </View>

          <View className="flex-row items-start gap-2">
            <View className="flex-1">
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
            <View className="flex-1">
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
          </View>
        </View>
      ))}
    </View>
  );
}
