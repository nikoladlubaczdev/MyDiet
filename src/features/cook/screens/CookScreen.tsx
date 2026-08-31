import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { DaysCarousel } from '@/shared/components/DaysCarousel';
import { SplitView } from '../components/SplitView';

export function CookScreen() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  return (
    <View className="flex-1 bg-amber-50">
      <DaysCarousel selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      <ScrollView className="flex-1">
        <SplitView selectedDate={selectedDate} />
      </ScrollView>
    </View>
  );
}
