import * as Lucide from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGarden } from "@/components/GardenProvider";
import { PlantSVGComponent } from "@/components/PlantSVGs";
import { useTheme } from "@/components/ThemeProvider";
import { useWater } from "@/components/WaterProvider";
import { getTheme } from "../../constants/Colors";
const { width } = Dimensions.get("window");

export default function Garden() {
  const theme = useTheme();
  const { plants, waterPlant, addPlant, getPlantStageInfo, getPlantGrowthTime } = useGarden();
  const { dropletPoints, spendPoints, addPoints } = useWater();
  const scheme = useColorScheme();
  const colors = getTheme(scheme);

  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);

  const handleWaterPlant = (plantId: string) => {
    const waterCost = 5; 
    
    if (dropletPoints >= waterCost) {
      const success = spendPoints(waterCost);
      if (success) {
        waterPlant(plantId);
        Alert.alert("Success", `Plant watered! Cost: ${waterCost} points`);
      }
    } else {
      Alert.alert("Insufficient Points", `You need ${waterCost} points to water this plant.`);
    }
  };

  const handlePlantSeed = (type: 'test' | 'basic' | 'rare' | 'epic') => {
    const costs = { test: 10, basic: 50, rare: 200, epic: 500 };
    const cost = costs[type];
    
    if (dropletPoints >= cost) {
      const success = spendPoints(cost);
      if (success) {
        addPlant(type);
        Alert.alert("Success", `${type.charAt(0).toUpperCase() + type.slice(1)} seed planted!`);
      }
    } else {
      Alert.alert("Insufficient Points", `You need ${cost} points to plant a ${type} seed.`);
    }
  };

  const renderPlantCard = ({ item: plant }: { item: any }) => {
    const stageInfo = getPlantStageInfo(plant.stage);
    const hoursSinceWatered = plant.isAlive ? 
      (new Date().getTime() - new Date(plant.lastWatered).getTime()) / (1000 * 60 * 60) : 0;
    
    const needsWater = hoursSinceWatered > 12;
    const isSelected = selectedPlant === plant.id;

    return (
      <Pressable
        style={[
          styles.plantCard,
          {
            borderColor: isSelected ? colors.waterPrimary : colors.borderLight,
            backgroundColor: colors.appBackground,
            opacity: plant.isAlive ? 1 : 0.6,
          },
        ]}
        onPress={() => setSelectedPlant(plant.id)}
      >
        <View style={styles.plantHeader}>
          <Text style={[styles.plantName, { color: colors.foreground }]}>
            {plant.name}
          </Text>
          <Text style={[styles.plantType, { color: colors.mutedForeground }]}>
            {plant.type.charAt(0).toUpperCase() + plant.type.slice(1)}
          </Text>
        </View>

        <View style={styles.plantIcon}>
          <PlantSVGComponent 
            stage={plant.stage} 
            type={plant.type} 
            size={48} 
          />
        </View>

        <Text style={[styles.stageName, { color: colors.headlineForeground }]}>
          {stageInfo.name}
        </Text>

        <View style={styles.plantStats}>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              Health:
            </Text>
            <View style={styles.healthBar}>
              <View
                style={[
                  styles.healthFill,
                  {
                    width: `${plant.health}%`,
                    backgroundColor: plant.health > 50 ? colors.waterSuccess : 
                                   plant.health > 20 ? colors.waterWarning : colors.waterDanger,
                  },
                ]}
              />
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {plant.health}%
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              Growth:
            </Text>
            <View style={styles.growthBar}>
              <View
                style={[
                  styles.growthFill,
                  { width: `${plant.growthProgress}%`, backgroundColor: colors.waterPrimary },
                ]}
              />
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {Math.round(plant.growthProgress)}%
            </Text>
          </View>
        </View>

        {plant.isAlive && (
          <View style={styles.plantActions}>
            {needsWater && (
              <View style={styles.warningBadge}>
                <Lucide.Droplets color={colors.waterDanger} size={12} />
                <Text style={[styles.warningText, { color: colors.waterDanger }]}>
                  Needs Water!
                </Text>
              </View>
            )}
            
            <Pressable
              style={[
                styles.waterButton,
                {
                  backgroundColor: needsWater ? colors.waterDanger : colors.waterPrimary,
                },
              ]}
              onPress={() => handleWaterPlant(plant.id)}
            >
              <Lucide.Droplets color="white" size={16} />
              <Text style={styles.waterButtonText}>Water</Text>
            </Pressable>
          </View>
        )}

        {!plant.isAlive && (
          <View style={styles.deadPlant}>
            <Text style={[styles.deadText, { color: colors.waterDanger }]}>
              Plant has died
            </Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.appBackground }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.appBackground }}
        contentContainerStyle={{ paddingTop: 20 }}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.waterPrimary }]}>
            Garden
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
        {plants.length === 0 ? (
          <View style={styles.emptyGarden}>
            <Text style={[styles.emptyTitle, { color: colors.headlineForeground }]}>
              Your garden is empty
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
              Plant some seeds to get started!
            </Text>
            <View style={styles.seedOptions}>
              <Pressable
                style={[styles.seedButton, { backgroundColor: colors.waterDanger }]}
                onPress={() => handlePlantSeed('test')}
              >
                <Text style={styles.seedButtonText}>🧪 Test Seed (10 pts)</Text>
              </Pressable>
              <Pressable
                style={[styles.seedButton, { backgroundColor: colors.waterPrimary }]}
                onPress={() => handlePlantSeed('basic')}
              >
                <Text style={styles.seedButtonText}>🌱 Basic Seed (50 pts)</Text>
              </Pressable>
              <Pressable
                style={[styles.seedButton, { backgroundColor: colors.waterAccent }]}
                onPress={() => handlePlantSeed('rare')}
              >
                <Text style={styles.seedButtonText}>🌸 Rare Seed (200 pts)</Text>
              </Pressable>
              <Pressable
                style={[styles.seedButton, { backgroundColor: colors.waterSecondary }]}
                onPress={() => handlePlantSeed('epic')}
              >
                <Text style={styles.seedButtonText}>🌺 Epic Seed (500 pts)</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.gardenStats}>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: colors.waterPrimary }]}>
                  {plants.length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                  Total Plants
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: colors.waterSuccess }]}>
                  {plants.filter(p => p.isAlive).length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                  Alive
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: colors.waterWarning }]}>
                  {plants.filter(p => p.stage === 'big').length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                  Mature
                </Text>
              </View>
            </View>

            <View style={styles.plantsContainer}>
              <Text style={[styles.sectionTitle, { color: colors.headlineForeground }]}>
                Your Plants
              </Text>
              <FlatList
                data={plants}
                renderItem={renderPlantCard}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.plantRow}
                scrollEnabled={false}
                contentContainerStyle={styles.plantsList}
              />
            </View>

            {/*             <View style={styles.addPlantSection}>
              <Text style={[styles.sectionTitle, { color: colors.headlineForeground }]}>
                Plant New Seeds
              </Text>
              <View style={styles.seedOptions}>
                <Pressable
                  style={[styles.seedButton, { backgroundColor: colors.waterDanger }]}
                  onPress={() => handlePlantSeed('test')}
                >
                  <Text style={styles.seedButtonText}>🧪 Test Seed (10 pts)</Text>
                </Pressable>
                <Pressable
                  style={[styles.seedButton, { backgroundColor: colors.waterPrimary }]}
                  onPress={() => handlePlantSeed('basic')}
                >
                  <Text style={styles.seedButtonText}>🌱 Basic Seed (50 pts)</Text>
                </Pressable>
                <Pressable
                  style={[styles.seedButton, { backgroundColor: colors.waterAccent }]}
                  onPress={() => handlePlantSeed('rare')}
                >
                  <Text style={styles.seedButtonText}>🌸 Rare Seed (200 pts)</Text>
                </Pressable>
                <Pressable
                  style={[styles.seedButton, { backgroundColor: colors.waterSecondary }]}
                  onPress={() => handlePlantSeed('epic')}
                >
                  <Text style={styles.seedButtonText}>🌺 Epic Seed (500 pts)</Text>
                </Pressable>
              </View>
            </View> */}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
  emptyGarden: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  gardenStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  plantsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  plantsList: {
    paddingBottom: 20,
  },
  plantRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  plantCard: {
    width: width / 2 - 24,
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  plantHeader: {
    alignItems: "center",
    marginBottom: 12,
  },
  plantName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  plantType: {
    fontSize: 12,
  },
  plantIcon: {
    marginBottom: 8,
  },
  plantEmoji: {
    fontSize: 32,
  },
  stageName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
  },
  plantStats: {
    width: "100%",
    marginBottom: 12,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  healthBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  healthFill: {
    height: "100%",
    borderRadius: 3,
  },
  growthBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  growthFill: {
    height: "100%",
    borderRadius: 3,
  },
  statValue: {
    fontSize: 12,
    width: 30,
    textAlign: "right",
  },
  plantActions: {
    width: "100%",
    alignItems: "center",
  },
  warningBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 4,
  },
  waterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  waterButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  deadPlant: {
    alignItems: "center",
  },
  deadText: {
    fontSize: 12,
    fontWeight: "600",
  },
  addPlantSection: {
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  seedOptions: {
    gap: 12,
  },
  seedButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  seedButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
