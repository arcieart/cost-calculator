import { AccessoryConfig, AccessoryType, Accessory } from '../types/accessories';

export const ACCESSORY_CONFIGS: Record<AccessoryType, AccessoryConfig> = {
  keychain: {
    type: 'keychain',
    name: 'Keychain',
    defaultCost: 5,
    description: 'Small keychain attachment'
  },
  magnet: {
    type: 'magnet',
    name: 'Magnet',
    defaultCost: 8,
    description: 'Magnetic attachment'
  },
  bolt: {
    type: 'bolt',
    name: 'Bolt',
    defaultCost: 5,
    description: 'Bolt hardware attachment'
  }
};

export const DEFAULT_ACCESSORIES: Record<AccessoryType, Accessory> = {
  keychain: {
    type: 'keychain',
    quantity: 1,
    unitCost: ACCESSORY_CONFIGS.keychain.defaultCost,
    enabled: false
  },
  magnet: {
    type: 'magnet',
    quantity: 1,
    unitCost: ACCESSORY_CONFIGS.magnet.defaultCost,
    enabled: false
  },
  bolt: {
    type: 'bolt',
    quantity: 1,
    unitCost: ACCESSORY_CONFIGS.bolt.defaultCost,
    enabled: false
  }
};

export const ACCESSORY_TYPES: AccessoryType[] = ['keychain', 'magnet', 'bolt']; 