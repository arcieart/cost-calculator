"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import ExportOptions from "./ExportOptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { AccessoriesState, AccessoryType } from "../types/accessories";
import {
  DEFAULT_ACCESSORIES,
  ACCESSORY_CONFIGS,
  ACCESSORY_TYPES,
} from "../config/accessories";
import {
  getVolumeDiscount,
  getBatchEfficiencyFactor,
  WHOLESALE_CONFIG,
} from "../config/wholesale";

interface ProductCost {
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

const FILAMENT_TYPES = ["PLA", "ABS", "PETG", "TPU"];
const DEFAULT_FORM_DATA: ProductCost = {
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
  accessories: { ...DEFAULT_ACCESSORIES },
  overheadPercentage: 5,
  failureWasteRate: 8,
  desiredProfitMargin: 40,
  quantity: 1,
  isWholesale: false,
};

export default function CostCalculator() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState<ProductCost>(DEFAULT_FORM_DATA);

  const [calculations, setCalculations] = useState({
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
  });

  const [history, setHistory] = useState<ProductCost[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load calculation history
  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Calculate costs in real-time
  useEffect(() => {
    calculateCosts();
  }, [formData]);

  const loadHistory = async () => {
    try {
      const q = query(
        collection(db, "product-costs"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      const historyData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ProductCost[];

      setHistory(historyData);
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  const calculateCosts = () => {
    const quantity = formData.quantity || 1;
    const isWholesale = formData.isWholesale;

    // Material cost calculation
    const materialCost =
      (formData.materialWeightUsed / 1000) * formData.materialCostPerKg;

    // Machine cost calculation
    const totalPrintTimeHours = formData.printTimeMinutes / 60;
    const machineCost = totalPrintTimeHours * formData.machineHourlyRate;
    const electricityCost =
      totalPrintTimeHours * formData.electricityCostPerHour;

    // Labor cost calculation with batch efficiency
    const batchEfficiencyFactor = isWholesale
      ? getBatchEfficiencyFactor(quantity)
      : 1;
    const setupTimeHours =
      (formData.setupTimeMinutes / 60) * batchEfficiencyFactor;
    const designTimeHours = formData.designTimeMinutes / 60;
    const postProcessingTimeHours =
      (formData.postProcessingTimeMinutes / 60) * batchEfficiencyFactor;
    const totalLaborTimeHours =
      designTimeHours + setupTimeHours + postProcessingTimeHours;
    const laborCost = totalLaborTimeHours * formData.hourlyLaborRate;

    // Accessories cost calculation
    const accessoriesCost = Object.values(formData.accessories).reduce(
      (total, accessory) => {
        if (accessory.enabled) {
          return total + accessory.quantity * accessory.unitCost;
        }
        return total;
      },
      0
    );

    // Packaging cost with bulk efficiency
    const packagingCostPerUnit =
      isWholesale && quantity >= WHOLESALE_CONFIG.BULK_PACKAGING_MIN_QUANTITY
        ? formData.packagingCost *
          (1 - WHOLESALE_CONFIG.BULK_PACKAGING_DISCOUNT) // Bulk packaging discount
        : formData.packagingCost;

    // Base cost
    const baseCost =
      materialCost +
      machineCost +
      electricityCost +
      laborCost +
      accessoriesCost +
      packagingCostPerUnit;

    // Overhead and waste
    const overheadCost = baseCost * (formData.overheadPercentage / 100);
    const wasteAllowance = baseCost * (formData.failureWasteRate / 100);

    // Total cost per unit
    const totalCost = baseCost + overheadCost + wasteAllowance;

    // Adjust profit margin for wholesale
    let effectiveProfitMargin = formData.desiredProfitMargin;
    if (isWholesale) {
      const volumeDiscount = getVolumeDiscount(quantity);
      effectiveProfitMargin = Math.max(
        WHOLESALE_CONFIG.MINIMUM_PROFIT_MARGIN,
        formData.desiredProfitMargin * (1 - volumeDiscount)
      );
    }

    // Selling price with adjusted profit margin
    const sellingPrice = totalCost / (1 - effectiveProfitMargin / 100);
    const profitAmount = sellingPrice - totalCost;

    setCalculations({
      materialCost,
      machineCost: machineCost + electricityCost,
      laborCost,
      accessoriesCost,
      baseCost,
      overheadCost,
      wasteAllowance,
      totalCost,
      sellingPrice,
      profitAmount,
    });
  };

  const handleInputChange = (
    field: keyof ProductCost,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAccessoryChange = (
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
  };

  const getSelectedAccessories = () => {
    return ACCESSORY_TYPES.filter((type) => formData.accessories[type].enabled);
  };

  const getSelectedAccessoriesCount = () => {
    return getSelectedAccessories().length;
  };

  const saveCalculation = async () => {
    if (!formData.productName.trim()) {
      alert("Please enter a product name");
      return;
    }

    setLoading(true);
    try {
      // Filter accessories to only include selected ones
      const selectedAccessories: AccessoriesState = {};
      Object.entries(formData.accessories).forEach(([key, accessory]) => {
        if (accessory.enabled) {
          selectedAccessories[key as AccessoryType] = accessory;
        }
      });

      const productData = {
        ...formData,
        accessories: selectedAccessories,
        totalCost: calculations.totalCost,
        sellingPrice: calculations.sellingPrice,
        profitAmount: calculations.profitAmount,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "product-costs"), productData);
      await loadHistory();
      alert("Calculation saved successfully!");
    } catch (error) {
      console.error("Error saving calculation:", error);
      alert("Error saving calculation");
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item: ProductCost) => {
    setFormData({
      ...item,
      productName: `${item.productName} (Copy)`,
      accessories: item.accessories || { ...DEFAULT_ACCESSORIES },
    });
  };

  const resetForm = () => {
    setFormData({
      ...DEFAULT_FORM_DATA,
      accessories: { ...DEFAULT_ACCESSORIES },
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              3D Printing Cost Calculator
            </h1>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setDarkMode(!darkMode)}
                variant="ghost"
                size="icon"
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {darkMode ? "☀️" : "🌙"}
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </span>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    type="text"
                    placeholder="Enter product name"
                    value={formData.productName}
                    onChange={(e) =>
                      handleInputChange("productName", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Material Costs */}
            <Card>
              <CardHeader>
                <CardTitle>Material Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="filamentType">Filament Type</Label>
                    <Select
                      value={formData.filamentType}
                      onValueChange={(value) =>
                        handleInputChange("filamentType", value)
                      }
                    >
                      <SelectTrigger id="filamentType">
                        <SelectValue placeholder="Select filament type" />
                      </SelectTrigger>
                      <SelectContent>
                        {FILAMENT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="materialCostPerKg">
                      Material Cost per KG (₹)
                    </Label>
                    <Input
                      id="materialCostPerKg"
                      type="number"
                      value={formData.materialCostPerKg}
                      onChange={(e) =>
                        handleInputChange(
                          "materialCostPerKg",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="materialWeightUsed">
                      Material Weight Used (grams)
                    </Label>
                    <Input
                      id="materialWeightUsed"
                      type="number"
                      value={formData.materialWeightUsed}
                      onChange={(e) =>
                        handleInputChange(
                          "materialWeightUsed",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="packagingCost">Packaging Cost (₹)</Label>
                    <Input
                      id="packagingCost"
                      type="number"
                      value={formData.packagingCost}
                      onChange={(e) =>
                        handleInputChange(
                          "packagingCost",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time & Machine Costs */}
            <Card>
              <CardHeader>
                <CardTitle>Time & Machine Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="printTimeMinutes">
                      Print Time (Minutes)
                    </Label>
                    <Input
                      id="printTimeMinutes"
                      type="number"
                      value={formData.printTimeMinutes}
                      onChange={(e) =>
                        handleInputChange(
                          "printTimeMinutes",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="machineHourlyRate">
                      Machine Hourly Rate (₹/hour)
                    </Label>
                    <Input
                      id="machineHourlyRate"
                      type="number"
                      value={formData.machineHourlyRate}
                      onChange={(e) =>
                        handleInputChange(
                          "machineHourlyRate",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="electricityCostPerHour">
                      Electricity Cost per Hour (₹/hour)
                    </Label>
                    <Input
                      id="electricityCostPerHour"
                      type="number"
                      value={formData.electricityCostPerHour}
                      onChange={(e) =>
                        handleInputChange(
                          "electricityCostPerHour",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setupTimeMinutes">
                      Setup/Preparation Time (minutes)
                    </Label>
                    <Input
                      id="setupTimeMinutes"
                      type="number"
                      value={formData.setupTimeMinutes}
                      onChange={(e) =>
                        handleInputChange(
                          "setupTimeMinutes",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Labor Costs */}
            <Card>
              <CardHeader>
                <CardTitle>Labor Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="designTimeMinutes">
                      Design Time (minutes)
                    </Label>
                    <Input
                      id="designTimeMinutes"
                      type="number"
                      value={formData.designTimeMinutes}
                      onChange={(e) =>
                        handleInputChange(
                          "designTimeMinutes",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postProcessingTimeMinutes">
                      Post-Processing Time (minutes)
                    </Label>
                    <Input
                      id="postProcessingTimeMinutes"
                      type="number"
                      value={formData.postProcessingTimeMinutes}
                      onChange={(e) =>
                        handleInputChange(
                          "postProcessingTimeMinutes",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyLaborRate">
                      Hourly Labor Rate (₹/hour)
                    </Label>
                    <Input
                      id="hourlyLaborRate"
                      type="number"
                      value={formData.hourlyLaborRate}
                      onChange={(e) =>
                        handleInputChange(
                          "hourlyLaborRate",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accessories */}
            <Card>
              <CardHeader>
                <CardTitle>Accessories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Accessories Dropdown Selector */}
                  <div className="space-y-2">
                    <Label>Select Accessories</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {getSelectedAccessoriesCount() === 0 ? (
                            "Select accessories..."
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>
                                {getSelectedAccessoriesCount()} selected
                              </span>
                              <div className="flex gap-1">
                                {getSelectedAccessories()
                                  .slice(0, 2)
                                  .map((type) => (
                                    <Badge
                                      key={type}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {ACCESSORY_CONFIGS[type].name}
                                    </Badge>
                                  ))}
                                {getSelectedAccessoriesCount() > 2 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    +{getSelectedAccessoriesCount() - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>
                          Choose Accessories
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {ACCESSORY_TYPES.map((accessoryType) => {
                          const accessory = formData.accessories[accessoryType];
                          const config = ACCESSORY_CONFIGS[accessoryType];

                          return (
                            <DropdownMenuCheckboxItem
                              key={accessoryType}
                              checked={accessory.enabled}
                              onCheckedChange={(checked) =>
                                handleAccessoryChange(
                                  accessoryType,
                                  "enabled",
                                  checked
                                )
                              }
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {config.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {config.description}
                                </span>
                              </div>
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Configuration for Selected Accessories */}
                  {getSelectedAccessories().length > 0 && (
                    <div className="space-y-4">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Configure Selected Accessories:
                      </div>
                      {getSelectedAccessories().map((accessoryType) => {
                        const accessory = formData.accessories[accessoryType];
                        const config = ACCESSORY_CONFIGS[accessoryType];

                        return (
                          <div
                            key={accessoryType}
                            className="border border-gray-200 dark:border-gray-600 rounded-md p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="font-medium">{config.name}</div>
                              <Badge variant="outline" className="text-xs">
                                ₹{accessory.unitCost * accessory.quantity}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`${accessoryType}-quantity`}>
                                  Quantity
                                </Label>
                                <Input
                                  id={`${accessoryType}-quantity`}
                                  type="number"
                                  min="1"
                                  value={accessory.quantity}
                                  onChange={(e) =>
                                    handleAccessoryChange(
                                      accessoryType,
                                      "quantity",
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`${accessoryType}-cost`}>
                                  Unit Cost (₹)
                                </Label>
                                <Input
                                  id={`${accessoryType}-cost`}
                                  type="number"
                                  step="0.01"
                                  value={accessory.unitCost}
                                  onChange={(e) =>
                                    handleAccessoryChange(
                                      accessoryType,
                                      "unitCost",
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Business Costs */}
            <Card>
              <CardHeader>
                <CardTitle>Business Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="overheadPercentage">
                      Overhead Percentage (%)
                    </Label>
                    <Input
                      id="overheadPercentage"
                      type="number"
                      step="0.1"
                      value={formData.overheadPercentage}
                      onChange={(e) =>
                        handleInputChange(
                          "overheadPercentage",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="failureWasteRate">
                      Failure/Waste Rate (%)
                    </Label>
                    <Input
                      id="failureWasteRate"
                      type="number"
                      step="0.1"
                      value={formData.failureWasteRate}
                      onChange={(e) =>
                        handleInputChange(
                          "failureWasteRate",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desiredProfitMargin">
                      Desired Profit Margin (%)
                    </Label>
                    <Input
                      id="desiredProfitMargin"
                      type="number"
                      step="0.1"
                      value={formData.desiredProfitMargin}
                      onChange={(e) =>
                        handleInputChange(
                          "desiredProfitMargin",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wholesale Options */}
            <Card>
              <CardHeader>
                <CardTitle>Wholesale Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      id="isWholesale"
                      type="checkbox"
                      checked={formData.isWholesale}
                      onChange={(e) =>
                        handleInputChange("isWholesale", e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <Label
                      htmlFor="isWholesale"
                      className="text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      This is a wholesale order
                    </Label>
                  </div>
                  {formData.isWholesale && (
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) =>
                          handleInputChange("quantity", Number(e.target.value))
                        }
                        placeholder="Enter order quantity"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Volume discounts apply for orders of{" "}
                        {WHOLESALE_CONFIG.MIN_WHOLESALE_QUANTITY}+ units
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={saveCalculation}
                disabled={loading}
                className="px-6 py-2"
              >
                {loading ? "Saving..." : "Save Calculation"}
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="px-6 py-2"
              >
                Reset Form
              </Button>
            </div>
          </div>

          {/* Right Column - Results and History */}
          <div className="space-y-6">
            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Cost Breakdown{" "}
                  {formData.isWholesale && `(${formData.quantity} units)`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Material Cost:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(calculations.materialCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Machine Cost:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(calculations.machineCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Labor Cost:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(calculations.laborCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Accessories Cost:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(calculations.accessoriesCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Overhead:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(calculations.overheadCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Waste Allowance:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(calculations.wasteAllowance)}
                    </span>
                  </div>
                  <hr className="border-gray-200 dark:border-gray-600" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-blue-600 dark:text-blue-400">
                      {formData.isWholesale ? "Cost per Unit:" : "Total Cost:"}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {formatCurrency(calculations.totalCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-green-600 dark:text-green-400">
                      {formData.isWholesale
                        ? "Wholesale Price per Unit:"
                        : "Selling Price:"}
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                      {formatCurrency(calculations.sellingPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-green-600 dark:text-green-400">
                      {formData.isWholesale ? "Profit per Unit:" : "Profit:"}
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                      {formatCurrency(calculations.profitAmount)}
                    </span>
                  </div>
                  {formData.isWholesale && (
                    <>
                      <hr className="border-gray-200 dark:border-gray-600" />
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-purple-600 dark:text-purple-400">
                          Total Order Value:
                        </span>
                        <span className="text-purple-600 dark:text-purple-400">
                          {formatCurrency(
                            calculations.sellingPrice * (formData.quantity || 1)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-purple-600 dark:text-purple-400">
                          Total Profit:
                        </span>
                        <span className="text-purple-600 dark:text-purple-400">
                          {formatCurrency(
                            calculations.profitAmount * (formData.quantity || 1)
                          )}
                        </span>
                      </div>
                      {(formData.quantity || 1) >=
                        WHOLESALE_CONFIG.MIN_WHOLESALE_QUANTITY && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900 rounded">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            Volume Discount Applied:{" "}
                            {Math.round(
                              getVolumeDiscount(formData.quantity || 1) * 100
                            )}
                            %
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            {formData.productName && (
              <Card>
                <CardContent>
                  <ExportOptions
                    productName={formData.productName}
                    calculations={calculations}
                    formData={formData}
                  />
                </CardContent>
              </Card>
            )}

            {/* History */}
            <Card>
              <CardHeader>
                <CardTitle>Calculation History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No calculations saved yet.
                    </p>
                  ) : (
                    history.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        onClick={() => loadFromHistory(item)}
                      >
                        <div className="font-medium text-sm truncate">
                          {item.productName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Cost: {formatCurrency(item.totalCost || 0)} • Price:{" "}
                          {formatCurrency(item.sellingPrice || 0)}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {item.createdAt
                            ? (item.createdAt instanceof Timestamp
                                ? item.createdAt.toDate()
                                : item.createdAt
                              ).toLocaleDateString()
                            : "Unknown date"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
