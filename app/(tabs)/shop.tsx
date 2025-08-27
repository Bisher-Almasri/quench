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
import { useGarden } from "../../components/GardenProvider";
import { useTheme } from "../../components/ThemeProvider";
import { useWater } from "../../components/WaterProvider";
import { getTheme } from "../../constants/Colors";

const { width } = Dimensions.get("window");

export default function Shop() {
  const theme = useTheme();
  const { gardenItems, buyItem } = useGarden();
  const { dropletPoints, spendPoints } = useWater();
  const scheme = useColorScheme();
  const colors = getTheme(scheme);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Items', icon: <Lucide.ShoppingBag size={20} /> },
    { id: 'seed', name: 'Seeds', icon: <Lucide.Sprout size={20} /> },
    { id: 'fertilizer', name: 'Fertilizers', icon: <Lucide.Flower2 size={20} /> },
    { id: 'water_boost', name: 'Water Boost', icon: <Lucide.Droplets size={20} /> },
    { id: 'plant_pot', name: 'Decorations', icon: <Lucide.Palette size={20} /> },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? gardenItems 
    : gardenItems.filter(item => item.type === selectedCategory);

  const handleBuyItem = (itemId: string) => {
    const item = gardenItems.find(i => i.id === itemId);
    if (!item) return;
    
    if (dropletPoints >= item.price) {
      const success = spendPoints(item.price);
      if (success) {
        const buySuccess = buyItem(itemId);
        if (buySuccess) {
          Alert.alert("Purchase Successful", `You bought ${item.name}!`);
        }
      }
    } else {
      Alert.alert("Insufficient Points", `You need ${item.price} points to buy ${item.name}.`);
    }
  };

  const renderCategoryButton = ({ item: category }: { item: any }) => (
    <Pressable
      style={[
        styles.categoryButton,
        {
          backgroundColor: selectedCategory === category.id 
            ? colors.waterPrimary 
            : colors.appBackground,
          borderColor: colors.borderLight,
        },
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      {React.cloneElement(category.icon, { 
        color: selectedCategory === category.id ? 'white' : colors.foreground 
      })}
      <Text
        style={[
          styles.categoryName,
          {
            color: selectedCategory === category.id 
              ? 'white' 
              : colors.foreground,
          },
        ]}
      >
        {category.name}
      </Text>
    </Pressable>
  );

  const renderShopItem = ({ item }: { item: any }) => (
    <View
      style={[
        styles.shopItem,
        {
          backgroundColor: colors.appBackground,
          borderColor: colors.borderLight,
        },
      ]}
    >
      <View style={styles.itemHeader}>
        <View style={styles.itemIconContainer}>
          <Lucide.Package size={32} color={colors.waterPrimary} />
        </View>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: colors.foreground }]}>
            {item.name}
          </Text>
          <Text style={[styles.itemDescription, { color: colors.mutedForeground }]}>
            {item.description}
          </Text>
        </View>
      </View>

      <View style={styles.itemDetails}>
        <View style={styles.effectContainer}>
          <Lucide.Zap color={colors.waterWarning} size={16} />
          <Text style={[styles.effectText, { color: colors.waterWarning }]}>
            {item.effect}
          </Text>
        </View>

        <View style={styles.priceContainer}>
          <Lucide.Droplets color={colors.waterPrimary} size={16} />
          <Text style={[styles.priceText, { color: colors.waterPrimary }]}>
            {item.price} points
          </Text>
        </View>
      </View>

      <Pressable
        style={[
          styles.buyButton,
          {
            backgroundColor: dropletPoints >= item.price 
              ? colors.waterPrimary 
              : colors.inactive,
          },
        ]}
        onPress={() => handleBuyItem(item.id)}
        disabled={dropletPoints < item.price}
      >
        <Lucide.ShoppingCart color="white" size={16} />
        <Text style={styles.buyButtonText}>
          {dropletPoints >= item.price ? 'Buy Now' : 'Not Enough Points'}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.appBackground }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.appBackground }}
        contentContainerStyle={{ paddingTop: 20 }}
      >
              <View style={styles.header}>
        <Text style={[styles.title, { color: colors.waterPrimary }]}>
          Shop
        </Text>
        <View
          style={[
            styles.pointsBox,
            { backgroundColor: colors.pointsBackground },
          ]}
        >
          <Lucide.Droplets color={colors.waterPrimary} size={20} />
          <Text style={{ color: colors.foreground, fontSize: 14 }}>
            {dropletPoints} points
          </Text>
        </View>
      </View>

        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategoryButton}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
        <View style={styles.itemsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.headlineForeground }]}>
            {selectedCategory === 'all' ? 'All Items' : 
             categories.find(c => c.id === selectedCategory)?.name}
          </Text>
          
          {filteredItems.length === 0 ? (
            <View style={styles.emptyShop}>
              <Lucide.PackageX size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No items in this category
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredItems}
              renderItem={renderShopItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.itemsList}
            />
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={[styles.infoCard, { backgroundColor: colors.pointsBackground }]}>
            <Lucide.Info color={colors.waterPrimary} size={20} />
            <Text style={[styles.infoTitle, { color: colors.headlineForeground }]}>
              How to earn points
            </Text>
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              • Drink water (+1 point per 100ml){'\n'}
              {/* • Water your plants (+5 points per plant){'\n'} */}
              • Complete daily goals (+10 points) (Not released yet){'\n'}
              • Grow a Plant (Depends on the type of plant)
            </Text>
          </View>
        </View>
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
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
  },
  itemsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  itemsList: {
    gap: 16,
  },
  shopItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  itemHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  itemIconContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  effectContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  effectText: {
    fontSize: 12,
    fontWeight: "500",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "600",
  },
  buyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  buyButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyShop: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
  },
  infoSection: {
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
