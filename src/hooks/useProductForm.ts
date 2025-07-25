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
    setFormData((prev) => {
      // Ensure the accessory has all default values before updating
      const existingAccessory = prev.accessories[accessoryType];
      const defaultAccessory = DEFAULT_ACCESSORIES[accessoryType];
      const completeAccessory = {
        ...defaultAccessory,
        ...existingAccessory,
      };

      return {
        ...prev,
        accessories: {
          ...prev.accessories,
          [accessoryType]: {
            ...completeAccessory,
            [field]: value,
          },
        },
      };
    });
  }, []);

  const loadFromHistory = useCallback((item: ProductCost) => {
    // Merge each accessory with its defaults to ensure completeness
    const mergedAccessories = { ...DEFAULT_ACCESSORIES };
    
    if (item.accessories) {
      Object.entries(item.accessories).forEach(([type, accessory]) => {
        if (accessory && type in DEFAULT_ACCESSORIES) {
          mergedAccessories[type as AccessoryType] = {
            ...DEFAULT_ACCESSORIES[type as AccessoryType],
            ...accessory,
          };
        }
      });
    }

    setFormData({
      ...item,
      productName: `${item.productName} (Copy)`,
      accessories: mergedAccessories,
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