import { Text, View } from 'react-native';

export default function PlanScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-green-50 px-6">
            <View className="w-full rounded-3xl bg-white p-8 shadow">
                <Text className="text-center text-4xl">📅</Text>
                <Text className="mt-4 text-center text-3xl font-bold text-blue-700">Plan</Text>
                <Text className="mt-2 text-center text-base text-slate-600">
                    NativeWind działa na ekranie planu.
                </Text>
            </View>
        </View>
    );
}
