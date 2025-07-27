export interface VolumeDiscountTier {
  minQuantity: number;
  maxQuantity?: number;
  discountPercentage: number;
  description: string;
}

export interface BatchEfficiencyTier {
  minQuantity: number;
  maxQuantity?: number;
  efficiencyFactor: number; // Multiplier for setup/labor costs (lower = more efficient)
  description: string;
}



// Volume discount configuration - affects profit margin
export const VOLUME_DISCOUNT_TIERS: VolumeDiscountTier[] = [
  {
    minQuantity: 50,
    maxQuantity: 199,
    discountPercentage: 0.3, // 30% discount for 50-199 units
    description: "Medium wholesale (50-199 units)"
  },
  {
    minQuantity: 10,
    maxQuantity: 49,
    discountPercentage: 0.2, // 20% discount for 10-49 units
    description: "Small wholesale (10-49 units)"
  }
];

// Batch efficiency configuration - affects setup and labor costs per unit
export const BATCH_EFFICIENCY_TIERS: BatchEfficiencyTier[] = [
  {
    minQuantity: 50,
    maxQuantity: 99,
    efficiencyFactor: 0.4, // 60% reduction
    description: "Medium batch efficiency (50-99 units)"
  },
  {
    minQuantity: 10,
    maxQuantity: 49,
    efficiencyFactor: 0.6, // 40% reduction
    description: "Small batch efficiency (10-49 units)"
  }
];



// Calculate volume discount based on quantity
export const getVolumeDiscount = (quantity: number): number => {
  for (const tier of VOLUME_DISCOUNT_TIERS) {
    if (quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity)) {
      return tier.discountPercentage;
    }
  }
  return 0; // No discount for less than minimum quantity
};

// Calculate batch efficiency factor for setup and labor costs
export const getBatchEfficiencyFactor = (quantity: number): number => {
  for (const tier of BATCH_EFFICIENCY_TIERS) {
    if (quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity)) {
      return tier.efficiencyFactor;
    }
  }
  return 1; // No efficiency gain for small quantities
};



// Get applicable discount description for display
export const getVolumeDiscountDescription = (quantity: number): string | null => {
  for (const tier of VOLUME_DISCOUNT_TIERS) {
    if (quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity)) {
      return tier.description;
    }
  }
  return null;
};



// Constants for wholesale pricing
export const WHOLESALE_CONFIG = {
  MIN_WHOLESALE_QUANTITY: 10,
  MINIMUM_PROFIT_MARGIN: 15, // Minimum profit margin percentage for wholesale
  // BULK_PACKAGING_DISCOUNT: 0.4, // 40% reduction for bulk packaging
  // BULK_PACKAGING_MIN_QUANTITY: 10,
} as const; 