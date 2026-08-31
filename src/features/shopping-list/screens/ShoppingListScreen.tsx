import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useRecipes } from '@/features/recipes/hooks/useRecipes';
import { usePlanStore } from '@/features/plan/stores/usePlanStore';
import { createShoppingListItems } from '../services/createShoppingList';
import { useShoppingListStore } from '../stores/useShoppingListStore';

const WEEK_DAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
const MONTHS = [
  'styczeń',
  'luty',
  'marzec',
  'kwiecień',
  'maj',
  'czerwiec',
  'lipiec',
  'sierpień',
  'wrzesień',
  'październik',
  'listopad',
  'grudzień',
];

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatShortDate = (dateKey: string) => {
  const [, month, day] = dateKey.split('-');
  return `${day}.${month}`;
};

const createListName = (dates: string[]) => {
  const sortedDates = [...dates].sort();
  const firstDate = formatShortDate(sortedDates[0]);
  const lastDate = formatShortDate(sortedDates[sortedDates.length - 1]);
  return firstDate === lastDate ? firstDate : `${firstDate}–${lastDate}`;
};

const getCalendarDays = (visibleMonth: Date) => {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return [
    ...Array.from({ length: leadingEmptyDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
  ];
};

export function ShoppingListScreen() {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const plan = usePlanStore((state) => state.plan);
  const lists = useShoppingListStore((state) => state.lists);
  const addList = useShoppingListStore((state) => state.addList);
  const updateList = useShoppingListStore((state) => state.updateList);
  const toggleItem = useShoppingListStore((state) => state.toggleItem);
  const { recipes } = useRecipes();
  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const selectedList = lists.find((list) => list.id === selectedListId);

  const handleToggleDate = (date: Date) => {
    const dateKey = toDateKey(date);
    setSelectedDates((currentDates) =>
      currentDates.includes(dateKey)
        ? currentDates.filter((currentDate) => currentDate !== dateKey)
        : [...currentDates, dateKey]
    );
  };

  const handleCreateList = () => {
    if (selectedDates.length === 0) {
      return;
    }

    const sortedDates = [...selectedDates].sort();
    const items = createShoppingListItems(plan, sortedDates, recipes);

    if (editingListId) {
      updateList(editingListId, createListName(sortedDates), sortedDates, items);
      setSelectedDates([]);
      setIsCalendarVisible(false);
      setSelectedListId(editingListId);
      setEditingListId(null);
      return;
    }

    const listId = addList(createListName(sortedDates), sortedDates, items);
    setSelectedDates([]);
    setIsCalendarVisible(false);
    setSelectedListId(listId);
  };

  const handleCloseCalendar = () => {
    setSelectedDates([]);
    setIsCalendarVisible(false);
    if (editingListId) {
      setSelectedListId(editingListId);
      setEditingListId(null);
    }
  };

  const handleEditDates = () => {
    if (!selectedList) {
      return;
    }

    setSelectedDates(selectedList.dates);
    setEditingListId(selectedList.id);
    setSelectedListId(null);
    setIsCalendarVisible(true);
  };

  const changeMonth = (offset: number) => {
    setVisibleMonth(
      (currentMonth) =>
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
    );
  };

  if (selectedList) {
    const checkedItems = selectedList.items.filter((item) => item.isChecked).length;

    return (
      <View className="flex-1 bg-emerald-50">
        <View className="border-b border-emerald-200 bg-white px-4 pb-3 pt-4">
          <Pressable
            onPress={() => setSelectedListId(null)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Wróć do list zakupów"
          >
            <Text className="text-base font-semibold text-emerald-700">‹ Listy zakupów</Text>
          </Pressable>
          <Text className="mt-3 text-2xl font-bold text-emerald-900">
            Lista {selectedList.name}
          </Text>
          <Text className="mt-1 text-sm text-slate-500">
            {checkedItems} z {selectedList.items.length} produktów kupionych
          </Text>
          <Pressable
            onPress={handleEditDates}
            className="mt-3 self-start rounded-lg bg-emerald-100 px-3 py-2"
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Edytuj wybrane dni listy zakupów"
          >
            <Text className="text-sm font-semibold text-emerald-800">Edytuj dni</Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-4 py-4">
          {selectedList.items.length === 0 ? (
            <View className="rounded-2xl bg-white p-6">
              <Text className="text-center text-slate-500">
                W wybranych dniach nie zaplanowano żadnych posiłków.
              </Text>
            </View>
          ) : (
            <View className="overflow-hidden rounded-2xl bg-white">
              {selectedList.items.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => toggleItem(selectedList.id, item.id)}
                  className="flex-row items-center gap-3 border-b border-emerald-100 px-4 py-4"
                  accessible={true}
                  accessibilityRole="checkbox"
                  accessibilityLabel={`${item.product}, ${item.weight} ${item.unit}`}
                  accessibilityState={{ checked: item.isChecked }}
                >
                  <View
                    className={`h-6 w-6 items-center justify-center rounded-md border-2 ${
                      item.isChecked
                        ? 'border-emerald-600 bg-emerald-600'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {item.isChecked && <Text className="font-bold text-white">✓</Text>}
                  </View>
                  <Text
                    className={`flex-1 text-base ${
                      item.isChecked ? 'text-slate-400 line-through' : 'text-slate-800'
                    }`}
                  >
                    {item.product}
                  </Text>
                  <Text className="font-semibold text-emerald-900">
                    {item.weight} {item.unit}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-emerald-50">
      <View className="border-b border-emerald-200 bg-white px-4 py-4">
        <Text className="text-2xl font-bold text-emerald-900">Listy zakupów</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        <Pressable
          onPress={() => setIsCalendarVisible(true)}
          className="mb-4 items-center rounded-2xl bg-emerald-600 px-4 py-4"
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Stwórz nową listę zakupów"
        >
          <Text className="text-base font-bold text-white">+ Stwórz nową listę</Text>
        </Pressable>

        {lists.length === 0 ? (
          <View className="rounded-2xl bg-white p-8">
            <Text className="text-center text-4xl">🛒</Text>
            <Text className="mt-3 text-center text-base text-slate-500">
              Nie masz jeszcze żadnej listy zakupów.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {lists.map((list) => {
              const checkedItems = list.items.filter((item) => item.isChecked).length;

              return (
                <Pressable
                  key={list.id}
                  onPress={() => setSelectedListId(list.id)}
                  className="rounded-2xl border border-emerald-100 bg-white p-4"
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Otwórz listę zakupów ${list.name}`}
                >
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-lg font-bold text-emerald-900">
                        Lista {list.name}
                      </Text>
                      <Text className="mt-1 text-sm text-slate-500">
                        {list.items.length} produktów
                      </Text>
                    </View>
                    <Text className="font-semibold text-emerald-700">
                      {checkedItems}/{list.items.length} ›
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={isCalendarVisible}
        transparent={true}
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={handleCloseCalendar}
      >
        <View className="flex-1 justify-end bg-black/40">
          <Pressable
            className="flex-1"
            onPress={handleCloseCalendar}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Zamknij kalendarz"
          />
          <View className="rounded-t-3xl bg-white px-4 pb-8 pt-5">
            <Text className="text-xl font-bold text-emerald-900">Wybierz dni</Text>
            <Text className="mt-1 text-sm text-slate-500">
              Zaznacz dni, z których mamy przeliczyć składniki.
            </Text>

            <View className="mt-5 flex-row items-center justify-between">
              <Pressable
                onPress={() => changeMonth(-1)}
                className="h-10 w-10 items-center justify-center rounded-full bg-emerald-50"
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Poprzedni miesiąc"
              >
                <Text className="text-xl text-emerald-800">‹</Text>
              </Pressable>
              <Text className="text-base font-bold text-emerald-900">
                {MONTHS[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
              </Text>
              <Pressable
                onPress={() => changeMonth(1)}
                className="h-10 w-10 items-center justify-center rounded-full bg-emerald-50"
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Następny miesiąc"
              >
                <Text className="text-xl text-emerald-800">›</Text>
              </Pressable>
            </View>

            <View className="mt-3 flex-row">
              {WEEK_DAYS.map((day) => (
                <Text
                  key={day}
                  className="w-[14.285%] text-center text-xs font-semibold text-slate-500"
                >
                  {day}
                </Text>
              ))}
            </View>

            <View className="mt-2 flex-row flex-wrap">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <View key={`empty-${index}`} className="w-[14.285%] py-1" />;
                }

                const dateKey = toDateKey(date);
                const isSelected = selectedDates.includes(dateKey);

                return (
                  <View key={dateKey} className="w-[14.285%] items-center py-1">
                    <Pressable
                      onPress={() => handleToggleDate(date)}
                      className={`h-10 w-10 items-center justify-center rounded-full ${
                        isSelected ? 'bg-emerald-600' : 'bg-transparent'
                      }`}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={`Wybierz dzień ${date.getDate()} ${
                        MONTHS[date.getMonth()]
                      }`}
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text
                        className={`text-sm ${
                          isSelected ? 'font-bold text-white' : 'text-slate-700'
                        }`}
                      >
                        {date.getDate()}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>

            <Pressable
              onPress={handleCreateList}
              disabled={selectedDates.length === 0}
              className={`mt-5 items-center rounded-xl py-4 ${
                selectedDates.length > 0 ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Utwórz listę z wybranych dni"
              accessibilityState={{ disabled: selectedDates.length === 0 }}
            >
              <Text
                className={`font-bold ${
                  selectedDates.length > 0 ? 'text-white' : 'text-slate-400'
                }`}
              >
                {editingListId ? 'Zapisz zmiany' : `Utwórz listę (${selectedDates.length})`}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
