export interface Accessory {
  type: AccessoryType;
  quantity: number;
  unitCost: number;
  enabled: boolean;
}

export type AccessoryType = 'keychain' | 'magnet' | 'bolt';

export interface AccessoryConfig {
  type: AccessoryType;
  name: string;
  defaultCost: number;
  description: string;
}

export interface AccessoriesState {
  [key: string]: Accessory;
} 