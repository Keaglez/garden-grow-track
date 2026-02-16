export interface GardenSpace {
  id: string;
  name: string;
  description: string;
  size: string;
  type: 'raised-bed' | 'greenhouse' | 'plot' | 'container' | 'indoor';
  createdAt: string;
}

export interface Crop {
  id: string;
  name: string;
  variety: string;
  spaceId: string;
  plantedDate: string;
  expectedHarvest: string;
  status: 'planted' | 'growing' | 'ready' | 'harvested';
  notes: string;
  qrData: string;
  imageUrl?: string;
}

export interface Harvest {
  id: string;
  cropId: string;
  cropName: string;
  spaceName: string;
  quantity: number;
  unit: string;
  harvestDate: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  notes: string;
}

export interface GardenUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'gardener' | 'viewer';
  joinedDate: string;
  avatar: string;
}

export type ShopCategory = 'produce' | 'seedlings' | 'inputs';
export type ShopStatus = 'in-stock' | 'sale' | 'out-of-stock';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ShopCategory;
  price: number;
  currency: string;
  status: ShopStatus;
  salePercent?: number;
  imageUrl?: string;
  createdAt: string;
}
