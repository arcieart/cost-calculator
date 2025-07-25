import { Timestamp } from "firebase/firestore";
import { AccessoriesState } from "./accessories";

export interface ProductCost {
  id?: string;
  productName: string;
  // Material costs
  filamentType: string;
  materialCostPerKg: number;
  materialWeightUsed: number;
  packagingCost: number;
  // Time & machine costs
  printTimeMinutes: number;
  machineHourlyRate: number;
  electricityCostPerHour: number;
  setupTimeMinutes: number;
  // Labor costs
  designTimeMinutes: number;
  postProcessingTimeMinutes: number;
  hourlyLaborRate: number;
  // Accessories
  accessories: AccessoriesState;
  // Business costs
  overheadPercentage: number;
  failureWasteRate: number;
  desiredProfitMargin: number;
  // Wholesale specific fields
  quantity?: number;
  isWholesale?: boolean;
  // Calculated values
  totalCost?: number;
  sellingPrice?: number;
  profitAmount?: number;
  createdAt?: Date | Timestamp;
}

export interface CalculationResults {
  materialCost: number;
  machineCost: number;
  laborCost: number;
  accessoriesCost: number;
  baseCost: number;
  overheadCost: number;
  wasteAllowance: number;
  totalCost: number;
  sellingPrice: number;
  profitAmount: number;
}

export const FILAMENT_TYPES = ["PLA", "ABS", "PETG", "TPU"] as const;
export type FilamentType = typeof FILAMENT_TYPES[number];

export const DEFAULT_FORM_DATA: ProductCost = {
  productName: "",
  filamentType: "PLA",
  materialCostPerKg: 1000,
  materialWeightUsed: 10,
  packagingCost: 50,
  printTimeMinutes: 150,
  machineHourlyRate: 50,
  electricityCostPerHour: 10,
  setupTimeMinutes: 10,
  designTimeMinutes: 5,
  postProcessingTimeMinutes: 5,
  hourlyLaborRate: 100,
  accessories: {},
  overheadPercentage: 5,
  failureWasteRate: 8,
  desiredProfitMargin: 40,
  quantity: 1,
  isWholesale: false,
};

export const DEFAULT_CALCULATIONS: CalculationResults = {
  materialCost: 0,
  machineCost: 0,
  laborCost: 0,
  accessoriesCost: 0,
  baseCost: 0,
  overheadCost: 0,
  wasteAllowance: 0,
  totalCost: 0,
  sellingPrice: 0,
  profitAmount: 0,
}; 