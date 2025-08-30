import { GardenProvider } from "@/components/GardenProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { WaterProvider } from "@/components/WaterProvider";
import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

if (Device.isDevice) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

async function registerForPushNotificationsAsync() {
  let granted = false;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    granted = finalStatus === "granted";
  } else {
    alert("Must use physical device for Notifications");
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return granted;
}

export default function RootLayout() {
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync().then(granted => setPermissionGranted(granted));
  }, []);

  useEffect(() => {
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        console.log("Opened app from notif:", response);
      }
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Tapped notif while running:", response);
      }
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (permissionGranted) {
      scheduleWaterReminders();
    }
  }, [permissionGranted]);

  const scheduleWaterReminders = async () => {
    if (!permissionGranted) {
      alert("Please enable notifications in settings.");
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to Hydrate!",
        body: "Drink a glass of water to stay healthy.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        // seconds: 60,
        seconds: 2 * 60 * 60,
        repeats: true,
      } as Notifications.TimeIntervalTriggerInput,
    });

    alert("Hydration reminders set!");
  };

  const cancelReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    alert("Hydration reminders canceled.");
  };

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
