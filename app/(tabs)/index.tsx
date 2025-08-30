import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  useColorScheme,
  StyleSheet,
  Platform
} from "react-native";
import { useWater } from "@/components/WaterProvider";
import { getTheme } from "@/constants/Colors";
import { Droplets, Target } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Circle,
} from "react-native-svg";

export default function Track() {
  const { items, addWater, dailyIntake, dropletPoints } = useWater();
  const scheme = useColorScheme();
  const theme = getTheme(scheme);

  const dailyGoal = 2000;
  const dailyProgress = Math.min(dailyIntake / dailyGoal, 1);

  const glassesCompleted = Math.floor(dailyIntake / 250);

  const currentHour = new Date().getHours();
  const hoursPassed = Math.max(0, currentHour - 6);
  const targetHourlyIntake =
    hoursPassed <= 0 ? 0 : Math.round((dailyGoal / 16) * hoursPassed);

  const hourlyProgress =
    targetHourlyIntake > 0 ? Math.min(dailyIntake / targetHourlyIntake, 1) : 0;
    
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.appBackground }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.appBackground }}
        contentContainerStyle={{ paddingTop: 20 }}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.waterPrimary }]}>
            Track
          </Text>
          <View
            style={[
              styles.pointsBox,
              { backgroundColor: theme.pointsBackground },
            ]}
          >
            <Droplets color={theme.waterPrimary} size={20} />
            <Text style={{ color: theme.foreground, fontSize: 14 }}>
              {dropletPoints} points
            </Text>
          </View>
        </View>

        <LinearGradient
          colors={[theme.cardGradientStart, theme.cardGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderColor: theme.borderLight }]}
        >
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <Svg width={200} height={200} viewBox="0 0 200 200">
              <Defs>
                <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor={theme.waterPrimary} />
                  <Stop offset="100%" stopColor={theme.waterSecondary} />
                </SvgLinearGradient>
              </Defs>

              <Circle
                cx="100"
                cy="100"
                r="80"
                stroke={theme.waterGlassBorder}
                strokeWidth="20"
                fill="none"
              />

              <Circle
                cx="100"
                cy="100"
                r="80"
                stroke="url(#grad)"
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 80}`}
                strokeDashoffset={`${2 * Math.PI * 80 * (1 - dailyProgress)}`}
                transform="rotate(-90 100 100)"
              />
            </Svg>

            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Droplets color={theme.waterPrimary} size={48} />
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: theme.foreground,
                  marginTop: 6,
                }}
              >
                {dailyIntake} ml
              </Text>
              <Text style={{ color: theme.mutedForeground }}>
                of {dailyGoal} ml
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: theme.headlineForeground,
            }}
          >
            {dailyProgress >= 1
              ? "Daily Goal Complete!"
              : `${Math.round(dailyProgress * 100)}% of daily goal`}
          </Text>

          <Text
            style={{
              fontSize: 14,
              marginTop: 8,
              color: theme.subheadlineForeground,
            }}
          >
            {glassesCompleted} glasses completed
          </Text>
        </LinearGradient>

        <View style={styles.grid}>
          {[250, 500, 750].map((amount) => (
            <Pressable
              key={amount}
              style={[
                styles.gridItem,
                {
                  backgroundColor: theme.appBackground,
                  borderColor: theme.waterLight,
                },
              ]}
              onPress={() => addWater(amount)}
            >
              <Droplets color={theme.waterPrimary} size={20} />
              <Text style={{ color: theme.waterPrimary, fontWeight: "500" }}>
                {amount} ml
              </Text>
            </Pressable>
          ))}
        </View>

        <View
          style={[
            styles.targetBox,
            {
              backgroundColor: theme.appBackground,
              borderColor: theme.borderLight,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Target color={theme.waterPrimary} size={20} />
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.headlineForeground, marginLeft: 8 },
              ]}
            >
              Water Target
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: theme.foreground }}>
              Target by now: {targetHourlyIntake} ml
            </Text>
            <Text
              style={{
                color:
                  hourlyProgress >= 1
                    ? theme.waterSuccess
                    : hourlyProgress >= 0.8
                      ? theme.waterWarning
                      : theme.waterDanger,
              }}
            >
              {hourlyProgress >= 1
                ? "On track!"
                : hourlyProgress >= 0.8
                  ? "Close"
                  : "Behind"}
            </Text>
          </View>

          <View
            style={{
              height: 12,
              backgroundColor: theme.waterLight,
              borderRadius: 4,
              marginVertical: 12,
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${hourlyProgress * 100}%`,
                backgroundColor: theme.waterPrimary,
                borderRadius: 4,
              }}
            />
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <StatThing label="Drinks" value={items.length} theme={theme} />
            <StatThing label="Glasses" value={glassesCompleted} theme={theme} />
            <StatThing
              label="On Pace"
              value={`${Math.round(hourlyProgress * 100)}%`}
              theme={theme}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const StatThing = ({
  label,
  value,
  theme,
}: {
  label: string;
  value: string | number;
  theme: any;
}) => (
  <View style={{ alignItems: "center" }}>
    <Text style={{ fontSize: 20, fontWeight: "bold", color: theme.foreground }}>
      {value}
    </Text>
    <Text style={{ color: theme.inactive, fontSize: 12 }}>{label}</Text>
  </View>
);


const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  pointsBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  card: {
    borderRadius: 10,
    alignItems: "center",
    padding: 20,
    marginHorizontal: 16,
    borderWidth: 1,
    marginBottom: 32,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginBottom: 24,
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  targetBox: {
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
});
