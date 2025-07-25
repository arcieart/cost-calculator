import { useState, useCallback } from "react";
import { ProductCost, DEFAULT_FORM_DATA } from "../types/product";
import { AccessoryType } from "../types/accessories";
import { DEFAULT_ACCESSORIES } from "../config/accessories";

export function useProductForm() {
  const [formData, setFormData] = useState<ProductCost>({
    ...DEFAULT_FORM_DATA,
    accessories: { ...DEFAULT_ACCESSORIES },
  });

  const handleInputChange = useCallback((
    field: keyof ProductCost,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleAccessoryChange = useCallback((
    accessoryType: AccessoryType,
    field: "enabled" | "quantity" | "unitCost",
    value: boolean | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      accessories: {
        ...prev.accessories,
        [accessoryType]: {
          ...prev.accessories[accessoryType],
          [field]: value,
        },
      },
    }));
  }, []);

  const loadFromHistory = useCallback((item: ProductCost) => {
    setFormData({
      ...item,
      productName: `${item.productName} (Copy)`,
      accessories: item.accessories || { ...DEFAULT_ACCESSORIES },
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      ...DEFAULT_FORM_DATA,
      accessories: { ...DEFAULT_ACCESSORIES },
    });
  }, []);

  return {
    formData,
    handleInputChange,
    handleAccessoryChange,
    loadFromHistory,
    resetForm,
  };
} 