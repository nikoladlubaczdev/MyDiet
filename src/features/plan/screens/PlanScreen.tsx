import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AddRecipeBottomSheet } from '../components/AddRecipeBottomSheet';
import { SplitView } from '../components/SplitView';
import { DaysCarousel } from '@/shared/components/DaysCarousel';
import { usePlanStore } from '../stores/usePlanStore';

type PersonKey = 'you' | 'partner';
type PlanMode = 'edit' | 'summary';

const MODES: { label: string; value: PlanMode }[] = [
  { label: 'Edycja', value: 'edit' },
  { label: 'Podsumowanie', value: 'summary' },
];

export function PlanScreen() {
  const [mode, setMode] = useState<PlanMode>('edit');
  const [isAddRecipeVisible, setIsAddRecipeVisible] = useState(false);
  const [selectedMealSlot, setSelectedMealSlot] = useState<string>('');
  const [selectedPerson, setSelectedPerson] = useState<PersonKey>('you');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const addMeal = usePlanStore((state) => state.addMeal);

  const handleOpenAddRecipe = (mealSlot: string, person: PersonKey) => {
    setSelectedMealSlot(mealSlot);
    setSelectedPerson(person);
    setIsAddRecipeVisible(true);
  };

  const handleAddRecipe = (recipeId: string, servings: number) => {
    if (!selectedMealSlot) {
      return;
    }

    addMeal(selectedDate, selectedPerson, selectedMealSlot, recipeId, servings);
    setIsAddRecipeVisible(false);
    setSelectedMealSlot('');
  };

  const handleCloseAddRecipe = () => {
    setIsAddRecipeVisible(false);
    setSelectedMealSlot('');
  };

  return (
    <View className="flex-1 bg-amber-50">
      <View className="border-b border-amber-200 bg-white px-4 py-3">
        <View className="flex-row items-center justify-between gap-2">
          <View className="flex-1 flex-row gap-1 rounded-lg bg-amber-100 p-1">
            {MODES.map(({ label, value }) => (
              <Pressable
                key={value}
                onPress={() => setMode(value)}
                className={`flex-1 rounded-md py-2 ${mode === value ? 'bg-white' : 'bg-transparent'
                  }`}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected: mode === value }}
              >
                <Text
                  className={`text-center text-sm font-semibold ${mode === value ? 'text-amber-900' : 'text-amber-700'
                    }`}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <DaysCarousel selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      <ScrollView className="flex-1">
        <SplitView
          selectedDate={selectedDate}
          onAddRecipe={mode === 'edit' ? handleOpenAddRecipe : undefined}
        />
      </ScrollView>

      <AddRecipeBottomSheet
        isVisible={isAddRecipeVisible}
        onClose={handleCloseAddRecipe}
        onAdd={handleAddRecipe}
        mealSlot={selectedMealSlot}
      />
    </View>
  );
}
