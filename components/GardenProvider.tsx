import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWater } from './WaterProvider';

export type PlantStage = 'seed' | 'sprout' | 'small' | 'big' | 'dead';

export type Plant = {
  id: string;
  name: string;
  stage: PlantStage;
  plantedAt: string;
  lastWatered: string;
  health: number; 
  growthProgress: number; 
  type: 'test' | 'basic' | 'rare' | 'epic';
  isAlive: boolean;
  reward: {
    type: 'droplets' | 'items';
    amount: number;
  };
};

export type GardenItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'fertilizer' | 'water_boost' | 'plant_pot' | 'seed';
  effect: string;
  icon: string;
};

export type GardenContextType = {
  plants: Plant[];
  gardenItems: GardenItem[];
  addPlant: (plantType: Plant['type']) => void;
  waterPlant: (plantId: string) => void;
  useItem: (itemId: string, plantId?: string) => void;
  buyItem: (itemId: string) => boolean;
  getPlantGrowthTime: (plantType: Plant['type']) => number;
  getPlantStageInfo: (stage: PlantStage) => { name: string; description: string; icon: string };
};

const GardenContext = createContext<GardenContextType | null>(null);

const GARDEN_ITEMS: GardenItem[] = [
  {
    id: 'test_seed',
    name: 'Test Seed',
    description: 'A fast-growing test seed for development',
    price: 10,
    type: 'seed',
    effect: 'Grows a test plant in 1 hour',
    icon: '🧪',
  },
  {
    id: 'basic_seed',
    name: 'Basic Seed',
    description: 'A simple seed that grows into a beautiful plant',
    price: 50,
    type: 'seed',
    effect: 'Grows a basic plant',
    icon: '🌱',
  },
  {
    id: 'rare_seed',
    name: 'Rare Seed',
    description: 'A rare seed with unique properties',
    price: 200,
    type: 'seed',
    effect: 'Grows a rare plant',
    icon: '🌸',
  },
  {
    id: 'epic_seed',
    name: 'Epic Seed',
    description: 'An epic seed that grows magnificent plants',
    price: 500,
    type: 'seed',
    effect: 'Grows an epic plant',
    icon: '🌺',
  },
  {
    id: 'fertilizer',
    name: 'Fertilizer',
    description: 'Boosts plant growth and health',
    price: 100,
    type: 'fertilizer',
    effect: '+20% growth speed, +10 health',
    icon: '🌿',
  },
  {
    id: 'water_boost',
    name: 'Water Boost',
    description: 'Provides extra hydration for plants',
    price: 75,
    type: 'water_boost',
    effect: '+30 health, +15% growth',
    icon: '💧',
  },
  {
    id: 'plant_pot',
    name: 'Decorative Pot',
    description: 'A beautiful pot for your plants',
    price: 150,
    type: 'plant_pot',
    effect: 'Decorative item',
    icon: '🏺',
  },
];

const PLANT_NAMES = {
  test: ['Test Plant', 'Debug Flower', 'Dev Sprout'],
  basic: ['Daisy', 'Sunflower', 'Tulip', 'Rose', 'Lily'],
  rare: ['Orchid', 'Lotus', 'Cherry Blossom', 'Lavender', 'Iris'],
  epic: ['Golden Rose', 'Crystal Lily', 'Rainbow Orchid', 'Starlight Bloom', 'Mystic Lotus'],
};

const PLANT_REWARDS = {
  test: {
    type: 'droplets' as const,
    amount: 100,
  },
  basic: {
    type: 'droplets' as const,
    amount: 50,
  },
  rare: {
    type: 'droplets' as const,
    amount: 150,
  },
  epic: {
    type: 'droplets' as const,
    amount: 300,
  },
};

export const GardenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [gardenItems, setGardenItems] = useState<GardenItem[]>(GARDEN_ITEMS);
  const { items, addWater, dailyIntake, dropletPoints } = useWater();

  useEffect(() => {
    loadGardenData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updatePlantGrowth();
    }, 60000); 

    return () => clearInterval(interval);
  }, [plants]);

  const loadGardenData = async () => {
    try {
      const storedPlants = await AsyncStorage.getItem('gardenPlants');
      if (storedPlants) setPlants(JSON.parse(storedPlants));
    } catch (error) {
      console.error('Error loading garden data:', error);
    }
  };

  const saveGardenData = async (newPlants: Plant[]) => {
    try {
      await AsyncStorage.setItem('gardenPlants', JSON.stringify(newPlants));
    } catch (error) {
      console.error('Error saving garden data:', error);
    }
  };

  const getPlantGrowthTime = (plantType: Plant['type']): number => {
    switch (plantType) {
      case 'test': return 1/24/60; 
      case 'basic': return 3; 
      case 'rare': return 4;
      case 'epic': return 5; 
      default: return 3;
    }
  };

  const getPlantStageInfo = (stage: PlantStage) => {
    switch (stage) {
      case 'seed':
        return { name: 'Seed', description: 'A tiny seed waiting to sprout', icon: '🌱' };
      case 'sprout':
        return { name: 'Sprout', description: 'A small sprout breaking through', icon: '🌱' };
      case 'small':
        return { name: 'Small Plant', description: 'A growing young plant', icon: '🌿' };
      case 'big':
        return { name: 'Mature Plant', description: 'A fully grown beautiful plant', icon: '🌸' };
      case 'dead':
        return { name: 'Dead Plant', description: 'This plant has withered away', icon: '🥀' };
      default:
        return { name: 'Unknown', description: 'Unknown stage', icon: '❓' };
    }
  };

  const updatePlantGrowth = () => {
    const now = new Date();
    const updatedPlants = plants.map(plant => {
      if (!plant.isAlive) return plant;

      const plantedAt = new Date(plant.plantedAt);
      const lastWatered = new Date(plant.lastWatered);
      const hoursSinceWatered = (now.getTime() - lastWatered.getTime()) / (1000 * 60 * 60);
      
      let newHealth = plant.health;
      if (hoursSinceWatered > 24) {
        newHealth = Math.max(0, plant.health - (hoursSinceWatered - 24) * 2);
      }

      if (newHealth <= 0) {
        return { ...plant, health: 0, isAlive: false, stage: 'dead' as PlantStage };
      }

      const growthTime = getPlantGrowthTime(plant.type);
      let timeSincePlanted;
      
      if (plant.type === 'test') {
        timeSincePlanted = (now.getTime() - plantedAt.getTime()) / (1000 * 60);
      } else {
        timeSincePlanted = (now.getTime() - plantedAt.getTime()) / (1000 * 60 * 60 * 24);
      }
      
      const growthProgress = Math.min(100, (timeSincePlanted / growthTime) * 100);

      let newStage = plant.stage;
      if (growthProgress >= 25 && plant.stage === 'seed') {
        newStage = 'sprout';
      } else if (growthProgress >= 50 && plant.stage === 'sprout') {
        newStage = 'small';
      } else if (growthProgress >= 100 && plant.stage === 'small') {
        newStage = 'big';
        const reward = getPlantReward(plant.type);
        // rn only reward droplets
        if (reward.type === 'droplets') {
          addWater(reward.amount);
        }
      }

      return {
        ...plant,
        health: newHealth,
        growthProgress,
        stage: newStage,
      };
    });

    setPlants(updatedPlants);
    saveGardenData(updatedPlants);
  };

  const addPlant = (plantType: Plant['type']) => {
    const plantNames = PLANT_NAMES[plantType];
    const randomName = plantNames[Math.floor(Math.random() * plantNames.length)];
    
    const newPlant: Plant = {
      id: Date.now().toString(),
      name: randomName,
      stage: 'seed',
      plantedAt: new Date().toISOString(),
      lastWatered: new Date().toISOString(),
      health: 100,
      growthProgress: 0,
      type: plantType,
      isAlive: true,
      reward: getPlantReward(plantType),
    };

    const newPlants = [...plants, newPlant];
    setPlants(newPlants);
    saveGardenData(newPlants);
  };

  const waterPlant = (plantId: string) => {
    const updatedPlants = plants.map(plant => {
      if (plant.id === plantId && plant.isAlive) {
        return {
          ...plant,
          lastWatered: new Date().toISOString(),
          health: Math.min(100, plant.health + 20),
        };
      }
      return plant;
    });

    setPlants(updatedPlants);
    saveGardenData(updatedPlants);
  };

  const useItem = (itemId: string, plantId?: string) => {
    const item = gardenItems.find(i => i.id === itemId);
    if (!item) return;

    if (item.type === 'fertilizer' && plantId) {
      const updatedPlants = plants.map(plant => {
        if (plant.id === plantId && plant.isAlive) {
          return {
            ...plant,
            health: Math.min(100, plant.health + 10),
            growthProgress: Math.min(100, plant.growthProgress + 20),
          };
        }
        return plant;
      });
      setPlants(updatedPlants);
      saveGardenData(updatedPlants);
    } else if (item.type === 'water_boost' && plantId) {
      const updatedPlants = plants.map(plant => {
        if (plant.id === plantId && plant.isAlive) {
          return {
            ...plant,
            health: Math.min(100, plant.health + 30),
            growthProgress: Math.min(100, plant.growthProgress + 15),
            lastWatered: new Date().toISOString(),
          };
        }
        return plant;
      });
      setPlants(updatedPlants);
      saveGardenData(updatedPlants);
    }
  };

  const buyItem = (itemId: string) => {
    const item = gardenItems.find(i => i.id === itemId);
    if (!item) return false;
    
    if (item.type === 'seed') {
      let plantType: Plant['type'] = 'basic';
      if (itemId.includes('test')) plantType = 'test';
      else if (itemId.includes('basic')) plantType = 'basic';
      else if (itemId.includes('rare')) plantType = 'rare';
      else if (itemId.includes('epic')) plantType = 'epic';
      
      addPlant(plantType);
      return true;
    }
    return false;
  };

  const getPlantReward = (plantType: Plant['type']) => {
    return PLANT_REWARDS[plantType];
  };

  return (
    <GardenContext.Provider value={{
      plants,
      gardenItems,
      addPlant,
      waterPlant,
      useItem,
      buyItem,
      getPlantGrowthTime,
      getPlantStageInfo,
    }}>
      {children}
    </GardenContext.Provider>
  );
};

export const useGarden = () => {
  const context = useContext(GardenContext);
  if (!context) {
    throw new Error('useGarden must be used within a GardenProvider');
  }
  return context;
};
