import { ProductCost, CalculationResults } from "../types/product";
import { getBatchEfficiencyFactor, getVolumeDiscount, WHOLESALE_CONFIG } from "../config/wholesale";

// ===== INDIVIDUAL COST COMPONENTS =====

export function calculateMaterialCost(formData: ProductCost): number {
  return (formData.materialWeightUsed / 1000) * formData.materialCostPerKg;
}

export function calculateMachineCost(formData: ProductCost): number {
  const totalPrintTimeHours = formData.printTimeMinutes / 60;
  const machineCost = totalPrintTimeHours * formData.machineHourlyRate;
  const electricityCost = totalPrintTimeHours * formData.electricityCostPerHour;
  return machineCost + electricityCost;
}

export function calculateLaborCost(formData: ProductCost): number {
  const quantity = formData.quantity || 1;
  const isWholesale = formData.isWholesale;
  
  // Apply batch efficiency for wholesale orders (setup/processing only)
  const batchEfficiencyFactor = isWholesale ? getBatchEfficiencyFactor(quantity) : 1;
  
  const setupTimeHours = (formData.setupTimeMinutes / 60) * batchEfficiencyFactor;
  const designTimeHours = formData.designTimeMinutes / 60; // Design time doesn't benefit from batching
  const postProcessingTimeHours = (formData.postProcessingTimeMinutes / 60) * batchEfficiencyFactor;
  
  const totalLaborTimeHours = designTimeHours + setupTimeHours + postProcessingTimeHours;
  return totalLaborTimeHours * formData.hourlyLaborRate;
}

export function calculateAccessoriesCost(formData: ProductCost): number {
  return Object.values(formData.accessories).reduce((total, accessory) => {
    if (accessory.enabled) {
      return total + accessory.quantity * accessory.unitCost;
    }
    return total;
  }, 0);
}

export function calculatePackagingCost(formData: ProductCost): number {
  // Future: Could add bulk packaging discounts here
  return formData.packagingCost;
}

// ===== BUSINESS COST ADJUSTMENTS =====

export function calculateOverheadCost(baseCost: number, overheadPercentage: number): number {
  return baseCost * (overheadPercentage / 100);
}

export function calculateWasteAllowance(baseCost: number, wasteRate: number): number {
  return baseCost * (wasteRate / 100);
}

export function calculateEffectiveProfitMargin(formData: ProductCost): number {
  const quantity = formData.quantity || 1;
  const isWholesale = formData.isWholesale;
  
  if (!isWholesale) {
    return formData.desiredProfitMargin;
  }
  
  // Apply volume discount to profit margin for wholesale orders
  const volumeDiscount = getVolumeDiscount(quantity);
  return Math.max(
    WHOLESALE_CONFIG.MINIMUM_PROFIT_MARGIN,
    formData.desiredProfitMargin * (1 - volumeDiscount)
  );
}

export function calculateSellingPrice(totalCost: number, profitMargin: number): number {
  return totalCost / (1 - profitMargin / 100);
}

// ===== MAIN CALCULATION FUNCTION =====

export function calculateCosts(formData: ProductCost): CalculationResults {
  // Step 1: Calculate individual cost components
  const materialCost = calculateMaterialCost(formData);
  const machineCost = calculateMachineCost(formData);
  const laborCost = calculateLaborCost(formData);
  const accessoriesCost = calculateAccessoriesCost(formData);
  const packagingCost = calculatePackagingCost(formData);
  
  // Step 2: Calculate base cost (sum of all direct costs)
  const baseCost = materialCost + machineCost + laborCost + accessoriesCost + packagingCost;
  
  // Step 3: Add business cost adjustments
  const overheadCost = calculateOverheadCost(baseCost, formData.overheadPercentage);
  const wasteAllowance = calculateWasteAllowance(baseCost, formData.failureWasteRate);
  
  // Step 4: Calculate total cost
  const totalCost = baseCost + overheadCost + wasteAllowance;
  
  // Step 5: Apply wholesale discounts and calculate final price
  const effectiveProfitMargin = calculateEffectiveProfitMargin(formData);
  const sellingPrice = calculateSellingPrice(totalCost, effectiveProfitMargin);
  const profitAmount = sellingPrice - totalCost;
  
  return {
    materialCost,
    machineCost,
    laborCost,
    accessoriesCost,
    baseCost,
    overheadCost,
    wasteAllowance,
    totalCost,
    sellingPrice,
    profitAmount,
  };
} 