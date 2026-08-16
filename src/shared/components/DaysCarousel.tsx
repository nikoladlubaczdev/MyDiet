import { FlatList, Text, View, Pressable, useWindowDimensions } from 'react-native';
import { useRef, useCallback, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';

interface DaysCarouselProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function DaysCarousel({ selectedDate, onSelectDate }: DaysCarouselProps) {
  const today = new Date();
  const flatListRef = useRef<FlatList>(null);
  const { width: screenWidth } = useWindowDimensions();
  const ITEM_WIDTH = 49;
  const SEPARATOR_WIDTH = 7;
  const HORIZONTAL_PADDING = 16;
  const ITEM_WITH_SEPARATOR = ITEM_WIDTH + SEPARATOR_WIDTH;

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

  const scrollToSelectedDate = useCallback(() => {
    const selectedIndex = days.findIndex(
      (date) => formatDay(date).dateStr === selectedDate
    );
    if (selectedIndex !== -1) {
      const offset =
        selectedIndex * ITEM_WITH_SEPARATOR - (screenWidth - ITEM_WIDTH) / 2 + HORIZONTAL_PADDING;
      flatListRef.current?.scrollToOffset({
        offset: Math.max(0, offset),
        animated: true,
      });
    }
  }, [selectedDate, days, screenWidth]);

  useEffect(() => {
    scrollToSelectedDate();
  }, [scrollToSelectedDate]);

  useFocusEffect(
    useCallback(() => {
      scrollToSelectedDate();
    }, [scrollToSelectedDate])
  );

  return (
    <View className="border-b border-amber-200 bg-white px-4 py-3">
      <FlatList
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={days}
        keyExtractor={(_, i) => i.toString()}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => {
          const { dayName, dayNum, isToday, dateStr } = formatDay(item);
          const isSelected = dateStr === selectedDate;
          return (
            <Pressable
              onPress={() => onSelectDate(dateStr)}
              className={`w-14 items-center justify-center rounded-lg py-2 ${isSelected ? 'bg-amber-200' : 'bg-amber-100'
                }`}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`${dayName} ${dayNum}${isToday ? ' - Dziś' : ''}`}
            >
              <Text
                className={`text-center text-xs font-semibold ${isSelected ? 'text-amber-900' : 'text-amber-800'
                  }`}
              >
                {dayName}
              </Text>
              <Text
                className={`text-center text-sm font-bold ${isSelected ? 'text-amber-900' : 'text-amber-800'
                  }`}
              >
                {dayNum}
              </Text>
              {isToday && <Text className="text-center text-xs">Dziś</Text>}
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View className="w-2" />}
      />
    </View>
  );
}
