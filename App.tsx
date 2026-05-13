import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import React from "react";

export default function App() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-lg font-bold text-gray-800">
        🎉 NativeWind + Tailwind uszkonfigurowane!
      </Text>
      <Text className="text-sm text-gray-500 mt-2">
        Edytuj App.tsx i zacznij tworzyć
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
