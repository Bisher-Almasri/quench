import React from "react";
import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  StyleSheet,
} from "react-native";
import { useWater } from "@/components/WaterProvider";
import { useGarden } from "@/components/GardenProvider";
import { getTheme } from "@/constants/Colors";
import { BarChart, Grid, LineChart, XAxis } from "react-native-svg-charts";
import { Defs, LinearGradient, Stop } from "react-native-svg";
import { Circle } from "react-native-svg";
import {
  Calendar,
  Droplets,
  Flame,
  Target,
  TrendingUp,
  LineChart as LC,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type DailyStat = {
  day: string;
  intake: number;
  goal: number;
};

type WeeklyTrend = {
  week: string;
  avg: number;
};

export default function StatsScreen() {
  const scheme = useColorScheme();
  const theme = getTheme(scheme);
  const { items, dropletPoints } = useWater();
  const { plants } = useGarden();

  const dailyGoal = 2000;

  const weeklyData: DailyStat[] = (() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);

    const days: DailyStat[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);

      const intake = items
        .filter(
          (it) => new Date(it.timestamp).toDateString() === date.toDateString(),
        )
        .reduce((sum, it) => sum + it.amount, 0);

      days.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        intake,
        goal: dailyGoal,
      });
    }
    return days;
  })();

  // TEMP: Make it real data
  const monthlyTrend: WeeklyTrend[] = [
    { week: "Week 1", avg: 1850 },
    { week: "Week 2", avg: 2100 },
    { week: "Week 3", avg: 1950 },
    { week: "Week 4", avg: 2250 },
  ];

  const averageDailyIntake =
    weeklyData.length > 0
      ? weeklyData.reduce((sum, d) => sum + d.intake, 0) / weeklyData.length
      : 0;

  const daysGoalMet = weeklyData.filter((d) => d.intake >= d.goal).length;

  const weeklyGoalProgress = Math.round(
    (weeklyData.reduce((sum, d) => sum + d.intake, 0) / (dailyGoal * 7)) * 100,
  );

  const Gradient = () => (
    <Defs key={"gradient"}>
      <LinearGradient
        id={"gradientFill"}
        x1={"0"}
        y1={"0"}
        x2={"100%"}
        y2={"0"}
      >
        <Stop offset={"0%"} stopColor={theme.waterPrimary} />
        <Stop offset={"100%"} stopColor={theme.waterSecondary} />
      </LinearGradient>
    </Defs>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.appBackground }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.appBackground }}
        contentContainerStyle={{ paddingTop: 20 }}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.waterPrimary }]}>
            Stats
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
        <View style={styles.container}>
          <View style={[styles.card, { borderColor: theme.borderLight }]}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Calendar color={theme.waterWarning} size={20} />
              <Text
                style={[
                  styles.cardTitle,
                  { marginBottom: 0, color: theme.waterWarning },
                ]}
              >
                This Week
              </Text>
            </View>

            <View style={styles.metricsRow}>
              <StatMetric
                value={`${Math.round(averageDailyIntake)}ml`}
                label="Daily Avg"
                color={theme.waterPrimary}
              />
              <StatMetric
                value={`${daysGoalMet}/7`}
                label="Goals Met"
                color={theme.waterSuccess}
              />
            </View>

            <Text style={{ color: theme.foreground, marginBottom: 6 }}>
              Weekly Goal Progress
            </Text>
            <View
              style={{
                height: 10,
                backgroundColor: theme.borderLight,
                borderRadius: 5,
                overflow: "hidden",
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${Math.min(weeklyGoalProgress, 100)}%`,
                  backgroundColor: theme.waterPrimary,
                }}
              />
            </View>

            <BarChart
              style={{ height: 180 }}
              data={weeklyData.map((d) => d.intake)}
              svg={{ fill: theme.waterPrimary }}
              contentInset={{ top: 10, bottom: 10 }}
            >
              <Grid />
            </BarChart>
            <XAxis
              style={{ marginTop: 8 }}
              data={weeklyData}
              formatLabel={(value, index) => weeklyData[index].day}
              contentInset={{ left: 20, right: 20 }}
              svg={{ fill: theme.foreground, fontSize: 12 }}
            />
          </View>

          <View style={[styles.card, { borderColor: theme.borderLight }]}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <LC color={theme.waterSuccess} size={20} />
              <Text
                style={[
                  styles.cardTitle,
                  { marginBottom: 0, color: theme.waterSuccess },
                ]}
              >
                Monthly Trend
              </Text>
            </View>

            <LineChart
              style={{ height: 180 }}
              data={monthlyTrend.map((w) => w.avg)}
              svg={{ stroke: theme.waterPrimary, strokeWidth: 3 }}
              contentInset={{ top: 20, bottom: 20 }}
            >
              <Grid />
            </LineChart>
            <XAxis
              style={{ marginTop: 8 }}
              data={monthlyTrend}
              formatLabel={(value, index) => monthlyTrend[index].week}
              contentInset={{ left: 20, right: 20 }}
              svg={{ fill: theme.foreground, fontSize: 12 }}
            />

            <Text
              style={{
                textAlign: "center",
                color: theme.mutedForeground,
                marginTop: 8,
              }}
            >
              Avg Weekly Intake
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
                color: theme.waterPrimary,
              }}
            >
              {Math.round(
                monthlyTrend.reduce((sum, w) => sum + w.avg, 0) /
                  monthlyTrend.length,
              )}
              ml
            </Text>
          </View>

          <View style={[styles.card, { borderColor: theme.borderLight }]}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Flame color={theme.waterPrimary} size={20} />
              <Text
                style={[
                  styles.cardTitle,
                  { marginBottom: 0, color: theme.waterPrimary },
                ]}
              >
                Quick Stats
              </Text>
            </View>

            <View style={[styles.statsGrid]}>
              <View
                style={[
                  styles.statsCard,
                  { backgroundColor: theme.pointsBackground },
                ]}
              >
                <Droplets
                  color={theme.waterPrimary}
                  size={24}
                  style={styles.cardIcon}
                />
                <Text style={[styles.cardValue, { color: theme.waterPrimary }]}>
                  28
                </Text>
                <Text style={[styles.cardLabel, { color: theme.waterPrimary }]}>
                  Glasses This Week
                </Text>
              </View>

              <View
                style={[
                  styles.statsCard,
                  { backgroundColor: theme.pointsBackground },
                ]}
              >
                <Target
                  color={theme.waterSuccess}
                  size={24}
                  style={styles.cardIcon}
                />
                <Text style={[styles.cardValue, { color: theme.waterSuccess }]}>
                  {plants.filter(p => p.stage === 'big').length}
                </Text>
                <Text style={[styles.cardLabel, { color: theme.waterSuccess }]}>
                  Mature Plants
                </Text>
              </View>

              <View
                style={[
                  styles.statsCard,
                  { backgroundColor: theme.pointsBackground },
                ]}
              >
                <TrendingUp
                  color={theme.waterAccent}
                  size={24}
                  style={styles.cardIcon}
                />
                <Text style={[styles.cardValue, { color: theme.waterAccent }]}>
                  +15%
                </Text>
                <Text style={[styles.cardLabel, { color: theme.waterAccent }]}>
                  vs Last Week
                </Text>
              </View>

              <View
                style={[
                  styles.statsCard,
                  { backgroundColor: theme.pointsBackground },
                ]}
              >
                <Calendar
                  color={theme.waterWarning}
                  size={24}
                  style={styles.cardIcon}
                />
                <Text style={[styles.cardValue, { color: theme.waterWarning }]}>
                  {plants.length}
                </Text>
                <Text style={[styles.cardLabel, { color: theme.waterWarning }]}>
                  Plants Grown
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatMetric({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", color }}>{value}</Text>
      <Text style={{ fontSize: 12, color }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
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
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statsCard: {
    width: "48%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardIcon: {
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardLabel: {
    fontSize: 12,
  },
});
