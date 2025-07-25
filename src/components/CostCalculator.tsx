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

interface ProductCost {
  id?: string;
  productName: string;
  // Material costs
  filamentType: string;
  materialCostPerKg: number;
  materialWeightUsed: number;
  supportMaterialWeight: number;
  packagingCost: number;
  // Time & machine costs
  printTimeHours: number;
  printTimeMinutes: number;
  machineHourlyRate: number;
  electricityCostPerHour: number;
  setupTimeMinutes: number;
  // Labor costs
  designTimeHours: number;
  postProcessingTimeMinutes: number;
  hourlyLaborRate: number;
  // Business costs
  overheadPercentage: number;
  failureWasteRate: number;
  desiredProfitMargin: number;
  // Calculated values
  totalCost?: number;
  sellingPrice?: number;
  profitAmount?: number;
  createdAt?: Date | Timestamp;
}

const FILAMENT_TYPES = ["PLA", "ABS", "PETG", "TPU"];

export default function CostCalculator() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState<ProductCost>({
    productName: "",
    filamentType: "PLA",
    materialCostPerKg: 2000,
    materialWeightUsed: 50,
    supportMaterialWeight: 0,
    packagingCost: 50,
    printTimeHours: 2,
    printTimeMinutes: 30,
    machineHourlyRate: 100,
    electricityCostPerHour: 25,
    setupTimeMinutes: 15,
    designTimeHours: 0,
    postProcessingTimeMinutes: 30,
    hourlyLaborRate: 300,
    overheadPercentage: 15,
    failureWasteRate: 8,
    desiredProfitMargin: 40,
  });

  const [calculations, setCalculations] = useState({
    materialCost: 0,
    machineCost: 0,
    laborCost: 0,
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
    // Material cost calculation
    const materialCost =
      ((formData.materialWeightUsed + formData.supportMaterialWeight) / 1000) *
      formData.materialCostPerKg;

    // Machine cost calculation
    const totalPrintTimeHours =
      formData.printTimeHours + formData.printTimeMinutes / 60;
    const machineCost = totalPrintTimeHours * formData.machineHourlyRate;
    const electricityCost =
      totalPrintTimeHours * formData.electricityCostPerHour;

    // Labor cost calculation
    const setupTimeHours = formData.setupTimeMinutes / 60;
    const postProcessingTimeHours = formData.postProcessingTimeMinutes / 60;
    const totalLaborTimeHours =
      formData.designTimeHours + setupTimeHours + postProcessingTimeHours;
    const laborCost = totalLaborTimeHours * formData.hourlyLaborRate;

    // Base cost
    const baseCost =
      materialCost +
      machineCost +
      electricityCost +
      laborCost +
      formData.packagingCost;

    // Overhead and waste
    const overheadCost = baseCost * (formData.overheadPercentage / 100);
    const wasteAllowance = baseCost * (formData.failureWasteRate / 100);

    // Total cost
    const totalCost = baseCost + overheadCost + wasteAllowance;

    // Selling price with profit margin
    const sellingPrice = totalCost / (1 - formData.desiredProfitMargin / 100);
    const profitAmount = sellingPrice - totalCost;

    setCalculations({
      materialCost,
      machineCost: machineCost + electricityCost,
      laborCost,
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
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveCalculation = async () => {
    if (!formData.productName.trim()) {
      alert("Please enter a product name");
      return;
    }

    setLoading(true);
    try {
      const productData = {
        ...formData,
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
    });
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      filamentType: "PLA",
      materialCostPerKg: 2000,
      materialWeightUsed: 50,
      supportMaterialWeight: 0,
      packagingCost: 50,
      printTimeHours: 2,
      printTimeMinutes: 30,
      machineHourlyRate: 100,
      electricityCostPerHour: 25,
      setupTimeMinutes: 15,
      designTimeHours: 0,
      postProcessingTimeMinutes: 30,
      hourlyLaborRate: 300,
      overheadPercentage: 15,
      failureWasteRate: 8,
      desiredProfitMargin: 40,
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
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </span>
              <button onClick={logout} className="btn-secondary px-4 py-2">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Information */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Product Information
              </h2>
              <div>
                <label className="label">Product Name</label>
                <input
                  type="text"
                  className="input mt-1"
                  placeholder="Enter product name"
                  value={formData.productName}
                  onChange={(e) =>
                    handleInputChange("productName", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Material Costs */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Material Costs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Filament/Resin Type</label>
                  <select
                    className="input mt-1"
                    value={formData.filamentType}
                    onChange={(e) =>
                      handleInputChange("filamentType", e.target.value)
                    }
                  >
                    {FILAMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Material Cost per KG (₹)</label>
                  <input
                    type="number"
                    className="input mt-1"
                    value={formData.materialCostPerKg}
                    onChange={(e) =>
                      handleInputChange(
                        "materialCostPerKg",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <label className="label">Material Weight Used (grams)</label>
                  <input
                    type="number"
                    className="input mt-1"
                    value={formData.materialWeightUsed}
                    onChange={(e) =>
                      handleInputChange(
                        "materialWeightUsed",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <label className="label">
                    Support Material Weight (grams)
                  </label>
                  <input
                    type="number"
                    className="input mt-1"
                    value={formData.supportMaterialWeight}
                    onChange={(e) =>
                      handleInputChange(
                        "supportMaterialWeight",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <label className="label">Packaging Cost (₹)</label>
                  <input
                    type="number"
                    className="input mt-1"
                    value={formData.packagingCost}
                    onChange={(e) =>
                      handleInputChange("packagingCost", Number(e.target.value))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Time & Machine Costs */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Time & Machine Costs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Print Time (Hours)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input mt-1"
                    value={formData.printTimeHours}
                    onChange={(e) =>
                      handleInputChange(
                        "printTimeHours",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <label className="label">Print Time (Minutes)</label>
                  <input
                    type="number"
                    className="input mt-1"
                    value={formData.printTimeMinutes}
                    onChange={(e) =>
                      handleInputChange(
                        "printTimeMinutes",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <label className="label">Machine Hourly Rate (₹/hour)</label>
                  <input
                    type="number"
                    className="input mt-1"
                    value={formData.machineHourlyRate}
                    onChange={(e) =>
                      handleInputChange(
                        "machineHourlyRate",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <label className="label">
                    Electricity Cost per Hour (₹/hour)
                  </label>
                  <input
                    type="number"
                    className="input mt-1"
                    value={formData.electricityCostPerHour}
                    onChange={(e) =>
                      handleInputChange(
                        "electricityCostPerHour",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <label className="label">
                    Setup/Preparation Time (minutes)
                  </label>
                  <input
                    type="number"
                    className="input mt-1"
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
            </div>

            {/* Labor Costs */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Labor Costs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Design Time (hours)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input mt-1"
                    value={formData.designTimeHours}
                    onChange={(e) =>
                      handleInputChange(
                        "designTimeHours",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <label className="label">
                    Post-Processing Time (minutes)
                  </label>
                  <input
                    type="number"
                    className="input mt-1"
                    value={formData.postProcessingTimeMinutes}
                    onChange={(e) =>
                      handleInputChange(
                        "postProcessingTimeMinutes",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <label className="label">Hourly Labor Rate (₹/hour)</label>
                  <input
                    type="number"
                    className="input mt-1"
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
            </div>

            {/* Business Costs */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Business Costs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Overhead Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input mt-1"
                    value={formData.overheadPercentage}
                    onChange={(e) =>
                      handleInputChange(
                        "overheadPercentage",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <label className="label">Failure/Waste Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input mt-1"
                    value={formData.failureWasteRate}
                    onChange={(e) =>
                      handleInputChange(
                        "failureWasteRate",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <label className="label">Desired Profit Margin (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input mt-1"
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
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={saveCalculation}
                disabled={loading}
                className="btn-success px-6 py-2"
              >
                {loading ? "Saving..." : "Save Calculation"}
              </button>
              <button onClick={resetForm} className="btn-secondary px-6 py-2">
                Reset Form
              </button>
            </div>
          </div>

          {/* Right Column - Results and History */}
          <div className="space-y-6">
            {/* Cost Breakdown */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Cost Breakdown
              </h2>
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
                    Total Cost:
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {formatCurrency(calculations.totalCost)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-green-600 dark:text-green-400">
                    Selling Price:
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    {formatCurrency(calculations.sellingPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-green-600 dark:text-green-400">
                    Profit:
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    {formatCurrency(calculations.profitAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Export Options */}
            {formData.productName && (
              <div className="card">
                <ExportOptions
                  productName={formData.productName}
                  calculations={calculations}
                  formData={formData}
                />
              </div>
            )}

            {/* History */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Calculation History
              </h2>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
