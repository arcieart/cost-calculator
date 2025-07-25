import { useState, useEffect, useCallback } from "react";
import { ProductCost, CalculationResults } from "../types/product";
import { saveCalculation, loadCalculationHistory, deleteCalculation, SaveCalculationParams } from "../services/firestore";
import { useAuth } from "../contexts/AuthContext";
import { validateProductForm } from "../lib/validators";

export function useCalculationHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ProductCost[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!user) return;
    
    try {
      const historyData = await loadCalculationHistory();
      setHistory(historyData);
    } catch (error) {
      console.error("Error loading history:", error);
      throw error;
    }
  }, [user]);

  const saveNewCalculation = useCallback(async (
    productData: ProductCost,
    calculations: CalculationResults
  ) => {
    if (!user) {
      throw new Error("User must be authenticated to save calculations");
    }

    // Validate form data
    const validationErrors = validateProductForm(productData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors[0].message}`);
    }

    setLoading(true);
    try {
      const params: SaveCalculationParams = {
        productData,
        calculations: {
          totalCost: calculations.totalCost,
          sellingPrice: calculations.sellingPrice,
          profitAmount: calculations.profitAmount,
        },
      };

      await saveCalculation(params);
      await loadHistory();
      return true;
    } catch (error) {
      console.error("Error saving calculation:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, loadHistory]);

  const deleteCalculationItem = useCallback(async (id: string) => {
    if (!user) {
      throw new Error("User must be authenticated to delete calculations");
    }

    setLoading(true);
    try {
      await deleteCalculation(id);
      await loadHistory();
      return true;
    } catch (error) {
      console.error("Error deleting calculation:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, loadHistory]);

  // Load history when user changes
  useEffect(() => {
    if (user) {
      loadHistory();
    } else {
      setHistory([]);
    }
  }, [user, loadHistory]);

  return {
    history,
    loading,
    saveCalculation: saveNewCalculation,
    deleteCalculation: deleteCalculationItem,
    refreshHistory: loadHistory,
  };
} 