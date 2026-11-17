import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AddRecipeBottomSheet } from '../components/AddRecipeBottomSheet';
import { DaySummary } from '../components/DaySummary';
import { SplitView } from '../components/SplitView';
import { DaysCarousel } from '@/shared/components/DaysCarousel';
import { usePlanStore } from '../stores/usePlanStore';

type PersonKey = 'you' | 'partner';
type PlanMode = 'edit' | 'summary';

const MODES: { label: string; value: PlanMode }[] = [
  { label: 'Edycja', value: 'edit' },
  { label: 'Podsumowanie', value: 'summary' },
];

const getPreviousDate = (date: string) => {
  const previous = new Date(`${date}T00:00:00Z`);
  previous.setUTCDate(previous.getUTCDate() - 1);
  return previous.toISOString().split('T')[0];
};

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
  const copyDayMeals = usePlanStore((state) => state.copyDayMeals);
  const plan = usePlanStore((state) => state.plan);

  const hasMeals = (date: string, person: PersonKey) =>
    Object.values(plan[date]?.[person] ?? {}).some(Boolean);

  const copyFromYesterday = () => {
    const yesterday = getPreviousDate(selectedDate);
    const people: PersonKey[] = ['you', 'partner'];
    const run = () =>
      people.forEach((person) => copyDayMeals(yesterday, person, selectedDate, person));

    if (!people.some((person) => hasMeals(selectedDate, person))) {
      run();
      return;
    }
    Alert.alert(
      'Nadpisać posiłki?',
      'Skopiowane posiłki zastąpią te, które są już zaplanowane w tym dniu.',
      [
        { text: 'Anuluj', style: 'cancel' },
        { text: 'Nadpisz', style: 'destructive', onPress: run },
      ]
    );
  };

  const canCopyFromYesterday = (['you', 'partner'] as PersonKey[]).some((person) =>
    hasMeals(getPreviousDate(selectedDate), person)
  );

  const handleOpenAddRecipe = (mealSlot: string, person: PersonKey) => {
    setSelectedMealSlot(mealSlot);
    setSelectedPerson(person);
    setIsAddRecipeVisible(true);
  };

  const handleAddRecipe = (recipeId: string, servings: number, forBoth: boolean) => {
    if (!selectedMealSlot) {
      return;
    }

    addMeal(selectedDate, selectedPerson, selectedMealSlot, recipeId, servings);
    if (forBoth) {
      const otherPerson = selectedPerson === 'you' ? 'partner' : 'you';
      addMeal(selectedDate, otherPerson, selectedMealSlot, recipeId, servings);
    }
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

      {mode === 'edit' && (
        <View className="flex-row px-4 py-2">
          <Pressable
            onPress={copyFromYesterday}
            disabled={!canCopyFromYesterday}
            accessibilityRole="button"
            accessibilityLabel="Skopiuj z wczoraj"
            className={`flex-row items-center gap-1.5 self-center rounded-full border border-amber-200 bg-white px-4 py-2 ${canCopyFromYesterday ? '' : 'opacity-50'
              }`}
          >
            <Ionicons name="copy-outline" size={16} color="#b45309" />
            <Text className="text-sm font-semibold text-amber-900">Skopiuj z wczoraj</Text>
          </Pressable>
        </View>
      )}

      <ScrollView className="flex-1">
        {mode === 'summary' && (
          <DaySummary selectedDate={selectedDate} onGoToEdit={() => setMode('edit')} />
        )}
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
        person={selectedPerson}
      />
    </View>
  );
}
