import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Item = { timestamp: string; amount: number };

type WaterContextType = {
  items: Item[];
  addWater: (amount: number) => void;
  dailyIntake: number;
  dropletPoints: number;
  addPoints: (points: number) => void;
  spendPoints: (points: number) => boolean;
};

const WaterContext = createContext<WaterContextType | null>(null);

export const WaterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [dropletPoints, setDropletPoints] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('waterItems');
      const storedPoints = await AsyncStorage.getItem('dropletPoints');
      if (storedItems) setItems(JSON.parse(storedItems));
      if (storedPoints) setDropletPoints(parseInt(storedPoints, 10));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async (newItems: Item[], newPoints: number) => {
    try {
      await AsyncStorage.setItem('waterItems', JSON.stringify(newItems));
      await AsyncStorage.setItem('dropletPoints', newPoints.toString());
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addWater = (amount: number) => {
    const newItem: Item = { timestamp: new Date().toISOString(), amount };
    const newItems = [...items, newItem];
    const newPoints = dropletPoints + Math.floor(amount / 100);
    setItems(newItems);
    setDropletPoints(newPoints);
    saveData(newItems, newPoints);
  };

  const addPoints = (points: number) => {
    const newPoints = dropletPoints + points;
    setDropletPoints(newPoints);
    saveData(items, newPoints);
  };

  const spendPoints = (points: number): boolean => {
    if (dropletPoints >= points) {
      const newPoints = dropletPoints - points;
      setDropletPoints(newPoints);
      saveData(items, newPoints);
      return true;
    }
    return false;
  };

  const today = new Date().toDateString();
  const dailyIntake = items
    .filter(item => new Date(item.timestamp).toDateString() === today)
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <WaterContext.Provider value={{ items, addWater, dailyIntake, dropletPoints, addPoints, spendPoints }}>
      {children}
    </WaterContext.Provider>
  );
};

export const useWater = () => {
  const context = useContext(WaterContext);
  if (!context) {
    throw new Error('useWater must be used within a WaterProvider');
  }
  return context;
};