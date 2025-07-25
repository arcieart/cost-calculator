import { ProductCost, CalculationResults } from "../types/product";
import { getVolumeDiscount, getBatchEfficiencyFactor, WHOLESALE_CONFIG } from "../config/wholesale";

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
  
  // Apply batch efficiency for wholesale orders
  const batchEfficiencyFactor = isWholesale ? getBatchEfficiencyFactor(quantity) : 1;
  
  const setupTimeHours = (formData.setupTimeMinutes / 60) * batchEfficiencyFactor;
  const designTimeHours = formData.designTimeMinutes / 60;
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
  const quantity = formData.quantity || 1;
  const isWholesale = formData.isWholesale;
  
  // Apply bulk packaging discount for large wholesale orders
  if (isWholesale && quantity >= WHOLESALE_CONFIG.BULK_PACKAGING_MIN_QUANTITY) {
    return formData.packagingCost * (1 - WHOLESALE_CONFIG.BULK_PACKAGING_DISCOUNT);
  }
  
  return formData.packagingCost;
}

export function calculateBaseCost(formData: ProductCost): number {
  const materialCost = calculateMaterialCost(formData);
  const machineCost = calculateMachineCost(formData);
  const laborCost = calculateLaborCost(formData);
  const accessoriesCost = calculateAccessoriesCost(formData);
  const packagingCost = calculatePackagingCost(formData);
  
  return materialCost + machineCost + laborCost + accessoriesCost + packagingCost;
}

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
  
  const volumeDiscount = getVolumeDiscount(quantity);
  return Math.max(
    WHOLESALE_CONFIG.MINIMUM_PROFIT_MARGIN,
    formData.desiredProfitMargin * (1 - volumeDiscount)
  );
}

export function calculateSellingPrice(totalCost: number, profitMargin: number): number {
  return totalCost / (1 - profitMargin / 100);
}

export function calculateCosts(formData: ProductCost): CalculationResults {
  const materialCost = calculateMaterialCost(formData);
  const machineCost = calculateMachineCost(formData);
  const laborCost = calculateLaborCost(formData);
  const accessoriesCost = calculateAccessoriesCost(formData);
  const baseCost = calculateBaseCost(formData);
  
  const overheadCost = calculateOverheadCost(baseCost, formData.overheadPercentage);
  const wasteAllowance = calculateWasteAllowance(baseCost, formData.failureWasteRate);
  
  const totalCost = baseCost + overheadCost + wasteAllowance;
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