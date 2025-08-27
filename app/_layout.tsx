import { GardenProvider } from "@/components/GardenProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { WaterProvider } from "@/components/WaterProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <WaterProvider>
        <GardenProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </GardenProvider>
      </WaterProvider>
    </ThemeProvider>
  );
}
