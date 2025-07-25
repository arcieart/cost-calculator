import { useState, useEffect } from "react";
import { ProductCost, CalculationResults, DEFAULT_CALCULATIONS } from "../types/product";
import { calculateCosts } from "../lib/calculations";

export function useCalculations(formData: ProductCost) {
  const [calculations, setCalculations] = useState<CalculationResults>(DEFAULT_CALCULATIONS);

  useEffect(() => {
    const newCalculations = calculateCosts(formData);
    setCalculations(newCalculations);
  }, [formData]);

  return calculations;
} 