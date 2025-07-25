import { ProductCost } from "../types/product";

export interface ValidationError {
  field: string;
  message: string;
}

export function validateProductName(productName: string): ValidationError | null {
  if (!productName.trim()) {
    return { field: "productName", message: "Product name is required" };
  }
  if (productName.length > 100) {
    return { field: "productName", message: "Product name must be less than 100 characters" };
  }
  return null;
}

export function validateMaterialWeight(weight: number): ValidationError | null {
  if (weight <= 0) {
    return { field: "materialWeightUsed", message: "Material weight must be greater than 0" };
  }
  if (weight > 10000) {
    return { field: "materialWeightUsed", message: "Material weight seems unusually high" };
  }
  return null;
}

export function validatePrintTime(minutes: number): ValidationError | null {
  if (minutes <= 0) {
    return { field: "printTimeMinutes", message: "Print time must be greater than 0" };
  }
  if (minutes > 10080) { // 1 week
    return { field: "printTimeMinutes", message: "Print time seems unusually long" };
  }
  return null;
}

export function validatePercentage(value: number, fieldName: string, maxValue: number = 100): ValidationError | null {
  if (value < 0) {
    return { field: fieldName, message: `${fieldName} cannot be negative` };
  }
  if (value > maxValue) {
    return { field: fieldName, message: `${fieldName} cannot exceed ${maxValue}%` };
  }
  return null;
}

export function validateQuantity(quantity: number): ValidationError | null {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { field: "quantity", message: "Quantity must be a positive integer" };
  }
  if (quantity > 10000) {
    return { field: "quantity", message: "Quantity seems unusually high" };
  }
  return null;
}

export function validateProductForm(formData: ProductCost): ValidationError[] {
  const errors: ValidationError[] = [];
  
  const productNameError = validateProductName(formData.productName);
  if (productNameError) errors.push(productNameError);
  
  const materialWeightError = validateMaterialWeight(formData.materialWeightUsed);
  if (materialWeightError) errors.push(materialWeightError);
  
  const printTimeError = validatePrintTime(formData.printTimeMinutes);
  if (printTimeError) errors.push(printTimeError);
  
  const overheadError = validatePercentage(formData.overheadPercentage, "overheadPercentage");
  if (overheadError) errors.push(overheadError);
  
  const wasteError = validatePercentage(formData.failureWasteRate, "failureWasteRate");
  if (wasteError) errors.push(wasteError);
  
  const profitError = validatePercentage(formData.desiredProfitMargin, "desiredProfitMargin", 200);
  if (profitError) errors.push(profitError);
  
  if (formData.isWholesale && formData.quantity) {
    const quantityError = validateQuantity(formData.quantity);
    if (quantityError) errors.push(quantityError);
  }
  
  return errors;
} 