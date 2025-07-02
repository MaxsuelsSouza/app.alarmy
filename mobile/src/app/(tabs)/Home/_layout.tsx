import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Tabs } from "expo-router";
import { Text, Platform, useColorScheme } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        // Remova o Platform.select, e só coloque:
        tabBarStyle: { display: 'none' }, // <-- Esta linha oculta a tabBar!
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Alarme',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="alarm.fill" color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontSize: focused ? 18 : 16,
                fontWeight: 'bold',
                color,
                fontFamily: 'SpaceMono', // Remova se não usar fonte custom
                letterSpacing: 1,
                textShadowColor: focused ? '#111' : 'transparent',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 4,
              }}
            >
              Alarme
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
