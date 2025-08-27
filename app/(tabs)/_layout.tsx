import { Tabs } from "expo-router";
import * as Lucide from "lucide-react-native";
import { useTheme } from "../../components/ThemeProvider";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.waterPrimary,
        tabBarInactiveTintColor: theme.inactive,
        tabBarStyle: {
          backgroundColor: theme.appBackground,
          borderTopColor: theme.borderLight,
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: theme.appBackground,
        },
        headerTintColor: theme.foreground,

      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Track",
          headerShown: false,
          tabBarIcon: ({ color }) => (
                
            <Lucide.Droplets color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="garden"
        options={{
          title: "Garden",
          headerShown: false,
          tabBarIcon: ({ color }) => <Lucide.Sprout color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          headerShown: false,
          tabBarIcon: ({ color }) => <Lucide.ShoppingCart color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Lucide.BarChart3 color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="awards"
        options={{
          title: "Awards",
          headerShown: false,
          tabBarIcon: ({ color }) => <Lucide.Trophy color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
