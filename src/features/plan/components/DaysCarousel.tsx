import { FlatList, Text, View, Pressable } from 'react-native';

interface DaysCarouselProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function DaysCarousel({ selectedDate, onSelectDate }: DaysCarouselProps) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i - 3);
    return date;
  });

  const formatDay = (date: Date) => {
    const dayName = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'][date.getDay()];
    const dayNum = date.getDate();
    const dateStr = date.toISOString().split('T')[0];
    const isToday = dateStr === selectedDate;
    return { dayName, dayNum, isToday, dateStr };
  };

  return (
    <View className="border-b border-amber-200 bg-white px-4 py-3">
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={days}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => {
          const { dayName, dayNum, isToday, dateStr } = formatDay(item);
          return (
            <Pressable
              onPress={() => onSelectDate(dateStr)}
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
