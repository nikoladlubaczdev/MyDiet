import { FlatList, Text, View, Pressable } from 'react-native';

interface DaysCarouselProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function DaysCarousel({ selectedDate, onSelectDate }: DaysCarouselProps) {
  const today = new Date();
  const days = Array.from({ length: 21 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i - 10);
    return date;
  });

  const formatDay = (date: Date) => {
    const dayName = ['Nd', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'][date.getDay()];
    const dayNum = date.getDate();
    const dateStr = date.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    const isToday = dateStr === todayStr;
    return { dayName, dayNum, isToday, dateStr };
  };

  return (
    <View className="border-b border-amber-200 bg-white px-4 py-3">
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={days}
        keyExtractor={(_, i) => i.toString()}
        initialScrollIndex={10}
        getItemLayout={(_, index) => ({
          length: 80,
          offset: 80 * index,
          index,
        })}
        renderItem={({ item }) => {
          const { dayName, dayNum, isToday, dateStr } = formatDay(item);
          const isSelected = dateStr === selectedDate;
          return (
            <Pressable
              onPress={() => onSelectDate(dateStr)}
              className={`mr-3 rounded-lg px-3 py-2 ${
                isSelected ? 'bg-amber-200' : 'bg-amber-100'
              }`}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`${dayName} ${dayNum}${isToday ? ' - Dziś' : ''}`}
            >
              <Text
                className={`text-center text-xs font-semibold ${
                  isSelected ? 'text-amber-900' : 'text-amber-800'
                }`}
              >
                {dayName}
              </Text>
              <Text
                className={`text-center text-sm font-bold ${
                  isSelected ? 'text-amber-900' : 'text-amber-800'
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
