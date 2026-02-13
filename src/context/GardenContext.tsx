import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { GardenSpace, Crop, Harvest, GardenUser } from '@/types/garden';
import { sampleSpaces, sampleCrops, sampleHarvests, sampleUsers } from '@/store/gardenStore';

interface GardenContextType {
  spaces: GardenSpace[];
  crops: Crop[];
  harvests: Harvest[];
  users: GardenUser[];
  addSpace: (space: GardenSpace) => void;
  addCrop: (crop: Crop) => void;
  addHarvest: (harvest: Harvest) => void;
  addUser: (user: GardenUser) => void;
  removeSpace: (id: string) => void;
  removeCrop: (id: string) => void;
  removeUser: (id: string) => void;
  getCropByQr: (qrData: string) => Crop | undefined;
}

const GardenContext = createContext<GardenContextType | undefined>(undefined);

export const GardenProvider = ({ children }: { children: ReactNode }) => {
  const [spaces, setSpaces] = useState<GardenSpace[]>(sampleSpaces);
  const [crops, setCrops] = useState<Crop[]>(sampleCrops);
  const [harvests, setHarvests] = useState<Harvest[]>(sampleHarvests);
  const [users, setUsers] = useState<GardenUser[]>(sampleUsers);

  const addSpace = (space: GardenSpace) => setSpaces(prev => [...prev, space]);
  const addCrop = (crop: Crop) => setCrops(prev => [...prev, crop]);
  const addHarvest = (harvest: Harvest) => setHarvests(prev => [...prev, harvest]);
  const addUser = (user: GardenUser) => setUsers(prev => [...prev, user]);
  const removeSpace = (id: string) => setSpaces(prev => prev.filter(s => s.id !== id));
  const removeCrop = (id: string) => setCrops(prev => prev.filter(c => c.id !== id));
  const removeUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));
  const getCropByQr = (qrData: string) => crops.find(c => c.qrData === qrData);

  return (
    <GardenContext.Provider value={{ spaces, crops, harvests, users, addSpace, addCrop, addHarvest, addUser, removeSpace, removeCrop, removeUser, getCropByQr }}>
      {children}
    </GardenContext.Provider>
  );
};

export const useGarden = () => {
  const context = useContext(GardenContext);
  if (!context) throw new Error('useGarden must be used within a GardenProvider');
  return context;
};
