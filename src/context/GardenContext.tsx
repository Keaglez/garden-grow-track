import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { GardenSpace, Crop, Harvest, GardenUser, ShopItem, ShopStatus } from '@/types/garden';
import { sampleSpaces, sampleCrops, sampleHarvests, sampleUsers, sampleShopItems } from '@/store/gardenStore';

interface GardenContextType {
  spaces: GardenSpace[];
  crops: Crop[];
  harvests: Harvest[];
  users: GardenUser[];
  shopItems: ShopItem[];
  addSpace: (space: GardenSpace) => void;
  addCrop: (crop: Crop) => void;
  addHarvest: (harvest: Harvest) => void;
  addUser: (user: GardenUser) => void;
  addShopItem: (item: ShopItem) => void;
  removeSpace: (id: string) => void;
  removeCrop: (id: string) => void;
  removeUser: (id: string) => void;
  removeShopItem: (id: string) => void;
  updateShopItemStatus: (id: string, status: ShopStatus, salePercent?: number) => void;
  getCropByQr: (qrData: string) => Crop | undefined;
}

const GardenContext = createContext<GardenContextType | undefined>(undefined);

export const GardenProvider = ({ children }: { children: ReactNode }) => {
  const [spaces, setSpaces] = useState<GardenSpace[]>(sampleSpaces);
  const [crops, setCrops] = useState<Crop[]>(sampleCrops);
  const [harvests, setHarvests] = useState<Harvest[]>(sampleHarvests);
  const [users, setUsers] = useState<GardenUser[]>(sampleUsers);
  const [shopItems, setShopItems] = useState<ShopItem[]>(sampleShopItems);

  const addSpace = (space: GardenSpace) => setSpaces(prev => [...prev, space]);
  const addCrop = (crop: Crop) => setCrops(prev => [...prev, crop]);
  const addHarvest = (harvest: Harvest) => setHarvests(prev => [...prev, harvest]);
  const addUser = (user: GardenUser) => setUsers(prev => [...prev, user]);
  const addShopItem = (item: ShopItem) => setShopItems(prev => [...prev, item]);
  const removeSpace = (id: string) => setSpaces(prev => prev.filter(s => s.id !== id));
  const removeCrop = (id: string) => setCrops(prev => prev.filter(c => c.id !== id));
  const removeUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));
  const removeShopItem = (id: string) => setShopItems(prev => prev.filter(i => i.id !== id));
  const updateShopItemStatus = (id: string, status: ShopStatus, salePercent?: number) =>
    setShopItems(prev => prev.map(i => i.id === id ? { ...i, status, salePercent: status === 'sale' ? salePercent : undefined } : i));
  const getCropByQr = (qrData: string) => crops.find(c => c.qrData === qrData);

  return (
    <GardenContext.Provider value={{ spaces, crops, harvests, users, shopItems, addSpace, addCrop, addHarvest, addUser, addShopItem, removeSpace, removeCrop, removeUser, removeShopItem, updateShopItemStatus, getCropByQr }}>
      {children}
    </GardenContext.Provider>
  );
};

export const useGarden = () => {
  const context = useContext(GardenContext);
  if (!context) throw new Error('useGarden must be used within a GardenProvider');
  return context;
};
