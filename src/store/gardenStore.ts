import type { GardenSpace, Crop, Harvest, GardenUser } from '@/types/garden';

export const sampleSpaces: GardenSpace[] = [
  { id: '1', name: 'Main Veggie Patch', description: 'Primary vegetable garden', size: '20x30 ft', type: 'plot', createdAt: '2025-03-01' },
  { id: '2', name: 'Herb Corner', description: 'Kitchen herbs and aromatics', size: '8x8 ft', type: 'raised-bed', createdAt: '2025-03-15' },
  { id: '3', name: 'Greenhouse A', description: 'Tropical and warm-season crops', size: '12x20 ft', type: 'greenhouse', createdAt: '2025-02-10' },
];

export const sampleCrops: Crop[] = [
  { id: '1', name: 'Tomato', variety: 'Roma', spaceId: '1', plantedDate: '2025-04-01', expectedHarvest: '2025-07-15', status: 'growing', notes: 'Growing well, needs staking', qrData: 'CROP-001-TOMATO-ROMA' },
  { id: '2', name: 'Basil', variety: 'Sweet Genovese', spaceId: '2', plantedDate: '2025-04-10', expectedHarvest: '2025-06-01', status: 'ready', notes: 'Ready for first harvest', qrData: 'CROP-002-BASIL-GENOVESE' },
  { id: '3', name: 'Pepper', variety: 'Bell Red', spaceId: '3', plantedDate: '2025-03-20', expectedHarvest: '2025-07-01', status: 'growing', notes: 'Flowering started', qrData: 'CROP-003-PEPPER-BELL' },
  { id: '4', name: 'Lettuce', variety: 'Butterhead', spaceId: '1', plantedDate: '2025-05-01', expectedHarvest: '2025-06-15', status: 'planted', notes: 'Just transplanted', qrData: 'CROP-004-LETTUCE-BUTTER' },
  { id: '5', name: 'Cucumber', variety: 'English', spaceId: '3', plantedDate: '2025-04-05', expectedHarvest: '2025-06-20', status: 'harvested', notes: 'Great yield this season', qrData: 'CROP-005-CUCUMBER-ENGLISH' },
];

export const sampleHarvests: Harvest[] = [
  { id: '1', cropId: '5', cropName: 'Cucumber', spaceName: 'Greenhouse A', quantity: 12, unit: 'lbs', harvestDate: '2025-06-18', quality: 'excellent', notes: 'Best batch yet' },
  { id: '2', cropId: '2', cropName: 'Basil', spaceName: 'Herb Corner', quantity: 2, unit: 'lbs', harvestDate: '2025-06-10', quality: 'good', notes: 'Fragrant and fresh' },
  { id: '3', cropId: '1', cropName: 'Tomato', spaceName: 'Main Veggie Patch', quantity: 8, unit: 'lbs', harvestDate: '2025-06-25', quality: 'excellent', notes: 'Ripe and juicy' },
];

export const sampleUsers: GardenUser[] = [
  { id: '1', name: 'Alex Green', email: 'alex@garden.com', role: 'owner', joinedDate: '2025-01-01', avatar: 'AG' },
  { id: '2', name: 'Sam Bloom', email: 'sam@garden.com', role: 'manager', joinedDate: '2025-02-15', avatar: 'SB' },
  { id: '3', name: 'Jordan Leaf', email: 'jordan@garden.com', role: 'gardener', joinedDate: '2025-03-01', avatar: 'JL' },
];
