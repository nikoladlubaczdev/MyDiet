import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs
            initialRouteName="plan"
            screenOptions={{
                tabBarActiveTintColor: 'blue',
            }}
        >
            <Tabs.Screen
                name="plan"
                options={{
                    title: 'Plan',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="calendar" color={color} size={28} />
                    ),
                }}
            />
            <Tabs.Screen
                name="recipes"
                options={{
                    title: 'Przepisy',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="book" color={color} size={28} />
                    ),
                }}
            />
            <Tabs.Screen
                name="shopping"
                options={{
                    title: 'Lista',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="shopping-cart" color={color} size={28} />
                    ),
                }}
            />
        </Tabs>
    );
}
