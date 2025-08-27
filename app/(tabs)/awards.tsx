import React from "react";
import {
  View,
  Text,
  // ScrollView,
  StyleSheet,
  useColorScheme,
  FlatList,
  Dimensions,
} from "react-native";
import * as Lucide from "lucide-react-native";
import { useWater } from "@/components/WaterProvider";
import { getTheme } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  requiredPoints: number;
};

const achievements: Achievement[] = [
  {
    id: "novice",
    name: "Novice Hydrator",
    description: "Reach 100 points",
    icon: Lucide.Trophy,
    requiredPoints: 100,
  },
  {
    id: "adept",
    name: "Adept Quencher",
    description: "Reach 500 points",
    icon: Lucide.Medal,
    requiredPoints: 500,
  },
  {
    id: "master",
    name: "Master of Waters",
    description: "Reach 1000 points",
    icon: Lucide.Star,
    requiredPoints: 1000,
  },
  {
    id: "legend",
    name: "Hydration Legend",
    description: "Reach 2000 points",
    icon: Lucide.Crown,
    requiredPoints: 2000,
  },
  {
    id: "gardener",
    name: "Green Thumb",
    description: "Plant your first seed",
    icon: Lucide.Sprout,
    requiredPoints: 50,
  },
  {
    id: "botanist",
    name: "Botanist",
    description: "Grow 5 plants to maturity",
    icon: Lucide.TreePine,
    requiredPoints: 250,
  },
  {
    id: "horticulturist",
    name: "Horticulturist",
    description: "Maintain a garden for 7 days",
    icon: Lucide.Flower2,
    requiredPoints: 500,
  },
];

export default function Awards() {
  const scheme = useColorScheme();
  const theme = getTheme(scheme);
  const { dropletPoints } = useWater();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.appBackground }}>
      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 40,
        }}
        ListHeaderComponent={
          <View style={{ marginBottom: 20 }}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.waterPrimary }]}>
                Awards
              </Text>
              <View
                style={[
                  styles.pointsBox,
                  { backgroundColor: theme.pointsBackground },
                ]}
              >
                <Lucide.Droplets color={theme.waterPrimary} size={20} />
                <Text style={{ color: theme.foreground, fontSize: 14 }}>
                  {dropletPoints} points
                </Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const isUnlocked = dropletPoints >= item.requiredPoints;
          return (
            <AchievementCard
              achievement={item}
              isUnlocked={isUnlocked}
              theme={theme}
              Icon={item.icon}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

function AchievementCard({
  achievement,
  isUnlocked,
  theme,
  Icon,
}: {
  achievement: Achievement;
  isUnlocked: boolean;
  theme: any;
  Icon: React.ComponentType<any>;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          borderColor: isUnlocked ? theme.waterPrimary : theme.inactive,
          backgroundColor: theme.appBackground,
          opacity: isUnlocked ? 1 : 0.7,
        },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: isUnlocked
              ? theme.waterPrimary + "20"
              : theme.inactive + "20",
          },
        ]}
      >
        <Icon
          size={28}
          color={isUnlocked ? theme.waterPrimary : theme.inactive}
        />
      </View>

      <Text style={[styles.cardTitle, { color: theme.foreground }]}>
        {achievement.name}
      </Text>
      <Text
        style={[styles.cardDesc, { color: theme.mutedForeground }]}
        numberOfLines={2}
      >
        {achievement.description}
      </Text>

      <View
        style={[
          styles.statusTag,
          {
            backgroundColor: isUnlocked
              ? theme.waterSuccess + "20"
              : theme.inactive + "20",
          },
        ]}
      >
        <Text
          style={{
            color: isUnlocked ? theme.waterSuccess : theme.inactive,
            fontSize: 12,
            fontWeight: "600",
          }}
        >
          {isUnlocked ? "Unlocked" : "Locked"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  pointsBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
  },
  card: {
    width: width / 2 - 30,
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
});
