import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AddRecipeBottomSheet } from '../components/AddRecipeBottomSheet';
import { DaysCarousel } from '../components/DaysCarousel';
import { MealSlots } from '../components/MealSlots';
import { SplitView } from '../components/SplitView';
import { usePlanStore } from '../stores/usePlanStore';

type ViewMode = 'you' | 'both' | 'partner';

const VIEW_MODES: { label: string; value: ViewMode }[] = [
  { label: 'Ty', value: 'you' },
  { label: 'Oboje', value: 'both' },
  { label: 'Partner', value: 'partner' },
];

export function PlanScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('both');
  const [isAddRecipeVisible, setIsAddRecipeVisible] = useState(false);
  const [selectedMealSlot, setSelectedMealSlot] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const addMeal = usePlanStore((state) => state.addMeal);

  const handleAddRecipe = (recipeId: string, servings: number) => {
    addMeal(selectedDate, viewMode === 'both' ? selectedPerson : viewMode, selectedMealSlot, recipeId, servings);
    setIsAddRecipeVisible(false);
  };

  const [selectedPerson, setSelectedPerson] = useState<'you' | 'partner'>('you');

  return (
    <View className="flex-1 bg-amber-50">
      <View className="border-b border-amber-200 bg-white px-4 py-3">
        <View className="flex-row items-center justify-between gap-2">
          <View className="flex-1 flex-row gap-1 rounded-lg bg-amber-100 p-1">
            {VIEW_MODES.map(({ label, value }) => (
              <Pressable
                key={value}
                onPress={() => setViewMode(value)}
                className={`flex-1 rounded-md py-2 ${viewMode === value ? 'bg-white' : 'bg-transparent'
                  }`}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected: viewMode === value }}
              >
                <Text
                  className={`text-center text-sm font-semibold ${viewMode === value ? 'text-amber-900' : 'text-amber-700'
                    }`}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            className="p-2"
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Ustawienia"
          >
            <Text className="text-xl">⚙️</Text>
          </Pressable>
        </View>
      </View>

      <DaysCarousel selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      <ScrollView className="flex-1">
        {viewMode === 'both' ? (
          <SplitView
            selectedDate={selectedDate}
            onAddRecipe={(slot, person) => {
              setSelectedMealSlot(slot);
              setSelectedPerson(person);
              setIsAddRecipeVisible(true);
            }}
            onOpenAddRecipe={() => setIsAddRecipeVisible(true)}
          />
        ) : (
          <MealSlots
            selectedDate={selectedDate}
            userType={viewMode}
            onAddRecipe={setSelectedMealSlot}
            onOpenAddRecipe={() => setIsAddRecipeVisible(true)}
          />
        )}
      </ScrollView>
      <AddRecipeBottomSheet
        isVisible={isAddRecipeVisible}
        onClose={() => setIsAddRecipeVisible(false)}
        onAdd={handleAddRecipe}
        mealSlot={selectedMealSlot}
      />
    </View>
  );
}
