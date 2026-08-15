import { Text, View } from 'react-native';
import { MealCard } from './MealCard';

const MEAL_TYPES = ['Śniadanie', 'II Śniadanie', 'Obiad', 'Podwieczorek', 'Kolacja'];

interface MealSlotsProps {
  selectedDate: string;
  userType: 'you' | 'partner';
  onAddRecipe: (slot: string) => void;
  onOpenAddRecipe: () => void;
}

export function MealSlots({
  selectedDate,
  userType,
  onAddRecipe,
  onOpenAddRecipe,
}: MealSlotsProps) {
  return (
    <View className="gap-3 px-4 py-4">
      {MEAL_TYPES.map((mealType) => (
        <View key={mealType}>
          <Text className="mb-2 text-sm font-semibold text-amber-900">{mealType}</Text>
          <MealCard
            date={selectedDate}
            person={userType}
            mealSlot={mealType}
            onAddRecipe={() => {
              onAddRecipe(mealType);
              onOpenAddRecipe();
            }}
          />
        </View>
      ))}
    </View>
  );
}
