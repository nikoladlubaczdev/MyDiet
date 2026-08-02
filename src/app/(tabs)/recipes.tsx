import { Text, View } from 'react-native';

export default function RecipesScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-amber-50 px-6">
            <View className="w-full rounded-3xl bg-white p-8 shadow">
                <Text className="text-center text-4xl">📖</Text>
                <Text className="mt-4 text-center text-3xl font-bold text-amber-700">
                    Przepisy
                </Text>
                <Text className="mt-2 text-center text-base text-slate-600">
                    Tutaj pojawi się baza przepisów.
                </Text>
            </View>
        </View>
    );
}
