import { useState } from 'react';
import { ScrollView, Text, View, FlatList, Pressable } from 'react-native';
import { AddRecipeBottomSheet } from '../components/AddRecipeBottomSheet';

type ViewMode = 'you' | 'both' | 'partner';

const MEAL_TYPES = ['Śniadanie', 'II Śniadanie', 'Obiad', 'Podwieczorek', 'Kolacja'];
const VIEW_MODES: { label: string; value: ViewMode }[] = [
  { label: 'Ty', value: 'you' },
  { label: 'Oboje', value: 'both' },
  { label: 'Partner', value: 'partner' },
];

export function PlanScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('both');
  const [isAddRecipeVisible, setIsAddRecipeVisible] = useState(false);
  const [selectedMealSlot, setSelectedMealSlot] = useState<string>('');

  return (
    <View className="flex-1 bg-amber-50">
      {/* Header with Segmented Control */}
      <View className="border-b border-amber-200 bg-white px-4 py-3">
        <View className="flex-row items-center justify-between gap-2">
          <View className="flex-1 flex-row gap-1 rounded-lg bg-amber-100 p-1">
            {VIEW_MODES.map(({ label, value }) => (
              <Pressable
                key={value}
                onPress={() => setViewMode(value)}
                className={`flex-1 rounded-md py-2 ${
                  viewMode === value ? 'bg-white' : 'bg-transparent'
                }`}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected: viewMode === value }}
              >
                <Text
                  className={`text-center text-sm font-semibold ${
                    viewMode === value ? 'text-amber-900' : 'text-amber-700'
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

      {/* Days Carousel */}
      <DaysCarousel />

      {/* Main Content Area */}
      <ScrollView className="flex-1">
        {viewMode === 'both' ? (
          <SplitView onAddRecipe={setSelectedMealSlot} onOpenAddRecipe={() => setIsAddRecipeVisible(true)} />
        ) : (
          <MealSlots userType={viewMode} onAddRecipe={setSelectedMealSlot} onOpenAddRecipe={() => setIsAddRecipeVisible(true)} />
        )}
      </ScrollView>

      {/* Add Recipe Bottom Sheet */}
      <AddRecipeBottomSheet
        isVisible={isAddRecipeVisible}
        onClose={() => setIsAddRecipeVisible(false)}
        onAdd={(recipeId, servings) => {
          console.log(`Added recipe ${recipeId} with ${servings} servings to ${selectedMealSlot}`);
          // TODO: Save to state/Firestore
        }}
        mealSlot={selectedMealSlot}
      />
    </View>
  );
}

function DaysCarousel() {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i - 3); // Show past 3 days
    return date;
  });

  const formatDay = (date: Date) => {
    const dayName = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'][date.getDay()];
    const dayNum = date.getDate();
    const isToday = date.toDateString() === today.toDateString();
    return { dayName, dayNum, isToday };
  };

  return (
    <View className="border-b border-amber-200 bg-white px-4 py-3">
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={days}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => {
          const { dayName, dayNum, isToday } = formatDay(item);
          return (
            <Pressable
              className={`mr-3 rounded-lg px-3 py-2 ${
                isToday ? 'bg-amber-200' : 'bg-amber-100'
              }`}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`${dayName} ${dayNum}${isToday ? ' - Dziś' : ''}`}
            >
              <Text
                className={`text-center text-xs font-semibold ${
                  isToday ? 'text-amber-900' : 'text-amber-800'
                }`}
              >
                {dayName}
              </Text>
              <Text
                className={`text-center text-sm font-bold ${
                  isToday ? 'text-amber-900' : 'text-amber-800'
                }`}
              >
                {dayNum}
              </Text>
              {isToday && <Text className="text-center text-xs">Dziś</Text>}
            </Pressable>
          );
        }}
      />
    </View>
  );
}

function MealSlots({ userType, onAddRecipe, onOpenAddRecipe }: { userType: 'you' | 'partner'; onAddRecipe: (slot: string) => void; onOpenAddRecipe: () => void; }) {
  return (
    <View className="gap-3 px-4 py-4">
      {MEAL_TYPES.map((mealType) => (
        <View key={mealType}>
          <Text className="mb-2 text-sm font-semibold text-amber-900">{mealType}</Text>
          <MealCard 
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

function SplitView({ onAddRecipe, onOpenAddRecipe }: { onAddRecipe: (slot: string) => void; onOpenAddRecipe: () => void; }) {
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
              <MealCard readonly />
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
              <MealCard readonly />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function MealCard({ readonly = false, onAddRecipe }: { readonly?: boolean; onAddRecipe?: () => void; }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasRecipe = false; // TODO: Replace with actual data

  if (!hasRecipe) {
    return (
      <Pressable
        onPress={onAddRecipe}
        className="items-center justify-center rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 py-6"
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Dodaj posiłek"
      >
        <Text className="text-base font-semibold text-amber-700">+ Dodaj posiłek</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => !readonly && setIsExpanded(!isExpanded)}
      className={`rounded-lg border border-amber-200 bg-white p-3 ${
        readonly ? 'opacity-90' : ''
      }`}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Karta przepisu"
    >
      {/* Collapsed View */}
      {!isExpanded && (
        <View>
          <Text className="text-sm font-bold text-amber-900">🍗 Kurczak z ryżem</Text>
          <Text className="mt-1 text-xs text-slate-600">Składniki:</Text>
          <Text className="text-xs text-slate-600">• Kurczak 200g</Text>
          <Text className="text-xs text-slate-600">• Ryż biały 100g</Text>
          <Text className="mt-2 text-xs text-slate-500">450 kcal | 2 porcje | 25 min</Text>
        </View>
      )}

      {/* Expanded View */}
      {isExpanded && !readonly && (
        <View>
          <Text className="text-sm font-bold text-amber-900">🍗 Kurczak z ryżem</Text>
          <Text className="mt-3 text-xs font-semibold text-slate-800">
            Składniki (2 porcje):
          </Text>
          <Text className="text-xs text-slate-700">• Kurczak (Mięso) 200g</Text>
          <Text className="text-xs text-slate-700">• Ryż biały (Artykuły suche) 100g</Text>
          <Text className="text-xs text-slate-700">• Marchew (Warzywa) 50g</Text>
          <Text className="text-xs text-slate-700">• Cebula (Warzywa) 30g</Text>
          <Text className="text-xs text-slate-700">• Olej (Przyprawy) 10ml</Text>

          <Text className="mt-3 text-xs font-semibold text-slate-800">Instrukcje:</Text>
          <Text className="text-xs text-slate-700">1. Pokrój kurczaka na kawałki</Text>
          <Text className="text-xs text-slate-700">2. Ugotuj ryż według instrukcji...</Text>

          <View className="mt-3 rounded-lg bg-slate-50 p-2">
            <Text className="text-xs font-semibold text-slate-800">📊 Makroskładniki:</Text>
            <Text className="text-xs text-slate-700">Kalorie: 450 kcal</Text>
            <Text className="text-xs text-slate-700">Białko: 35g | Tłuszcze: 12g</Text>
            <Text className="text-xs text-slate-700">Węglowodany: 48g</Text>
          </View>

          <Text className="mt-2 text-xs text-slate-600">⏱️ Czas przygotowania: 25 min</Text>

          <View className="mt-4 flex-row gap-2">
            <Pressable
              className="flex-1 rounded-lg bg-amber-100 py-2"
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Edytuj porcje"
            >
              <Text className="text-center text-xs font-semibold text-amber-900">
                Edytuj porcje
              </Text>
            </Pressable>
            <Pressable
              className="flex-1 rounded-lg bg-red-100 py-2"
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Usuń"
            >
              <Text className="text-center text-xs font-semibold text-red-900">Usuń</Text>
            </Pressable>
          </View>
        </View>
      )}
    </Pressable>
  );
}
