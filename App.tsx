import './global.css';

import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import React from "react";

export default function App() {
    return (
        <View className="flex-1 bg-blue-50 items-center justify-center px-6">
            <View className="bg-white rounded-2xl p-8 items-center">
                <Text className="text-5xl mb-4">✨</Text>
                <Text className="text-3xl font-bold text-blue-600 mb-2">
                    NativeWind Działa!
                </Text>
                <Text className="text-lg text-gray-900 text-center mb-6">
                    Tailwind CSS i kolory działają super
                </Text>

                <View className="flex-row items-center">
                    <View className="bg-red-500 px-4 py-3 rounded-lg mr-2">
                        <Text className="text-white font-bold">Red</Text>
                    </View>
                    <View className="bg-green-500 px-4 py-3 rounded-lg mr-2">
                        <Text className="text-white font-bold">Green</Text>
                    </View>
                    <View className="bg-purple-500 px-4 py-3 rounded-lg">
                        <Text className="text-white font-bold">Purple</Text>
                    </View>
                </View>
            </View>

            <StatusBar style="dark" />
        </View>
    );
}
