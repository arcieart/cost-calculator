"use client";

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import ExportOptions from "./ExportOptions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  Settings,
  TrendingUp,
  History,
  Package,
  Briefcase,
} from "lucide-react";

// Layout components
import { AppLayout, MainContent } from "./layout/AppLayout";
import { Header } from "./layout/Header";

// Form components
import { ProductInfoForm } from "./forms/ProductInfoForm";
import { MaterialCostsForm } from "./forms/MaterialCostsForm";
import { TimeMachineCostsForm } from "./forms/TimeMachineCostsForm";
import { LaborCostsForm } from "./forms/LaborCostsForm";
import { AccessoriesForm } from "./forms/AccessoriesForm";
import { BusinessCostsForm } from "./forms/BusinessCostsForm";
import { WholesaleOptionsForm } from "./forms/WholesaleOptionsForm";
import { ActionButtons } from "./forms/ActionButtons";

// Result components
import { CostBreakdown } from "./results/CostBreakdown";
import { CalculationHistory } from "./results/CalculationHistory";

// Custom hooks
import { useProductForm } from "../hooks/useProductForm";
import { useCalculations } from "../hooks/useCalculations";
import { useCalculationHistory } from "../hooks/useCalculationHistory";
import { useDarkMode } from "../hooks/useDarkMode";

export default function CostCalculator() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();

  // Form state management
  const {
    formData,
    handleInputChange,
    handleAccessoryChange,
    loadFromHistory,
    resetForm,
  } = useProductForm();

  // Calculations
  const calculations = useCalculations(formData);

  // History management
  const {
    history,
    loading: historyLoading,
    saveCalculation: saveToHistory,
  } = useCalculationHistory();

  const handleSaveCalculation = async () => {
    try {
      await saveToHistory(formData, calculations);
      alert("Calculation saved successfully!");
    } catch (error) {
      alert(
        `Error saving calculation: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <AppLayout>
      {/* Header */}
      <Header
        userEmail={user?.email}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onLogout={logout}
      />

      <MainContent>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Input Forms */}
          <div className="xl:col-span-2 space-y-6">
            {/* Product Information Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-primary" />
                <h2 className="text-lg font-semibold">Product Information</h2>
              </div>
              <ProductInfoForm
                productName={formData.productName}
                onProductNameChange={(value) =>
                  handleInputChange("productName", value)
                }
              />
            </div>

            {/* Cost Components Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-primary" />
                <h2 className="text-lg font-semibold">Cost Components</h2>
              </div>

              {/* Material Costs */}
              <MaterialCostsForm
                filamentType={formData.filamentType}
                materialCostPerKg={formData.materialCostPerKg}
                materialWeightUsed={formData.materialWeightUsed}
                packagingCost={formData.packagingCost}
                onFilamentTypeChange={(value) =>
                  handleInputChange("filamentType", value)
                }
                onMaterialCostChange={(value) =>
                  handleInputChange("materialCostPerKg", value)
                }
                onMaterialWeightChange={(value) =>
                  handleInputChange("materialWeightUsed", value)
                }
                onPackagingCostChange={(value) =>
                  handleInputChange("packagingCost", value)
                }
              />

              {/* Time & Machine Costs */}
              <TimeMachineCostsForm
                printTimeMinutes={formData.printTimeMinutes}
                machineHourlyRate={formData.machineHourlyRate}
                electricityCostPerHour={formData.electricityCostPerHour}
                setupTimeMinutes={formData.setupTimeMinutes}
                onPrintTimeChange={(value) =>
                  handleInputChange("printTimeMinutes", value)
                }
                onMachineRateChange={(value) =>
                  handleInputChange("machineHourlyRate", value)
                }
                onElectricityCostChange={(value) =>
                  handleInputChange("electricityCostPerHour", value)
                }
                onSetupTimeChange={(value) =>
                  handleInputChange("setupTimeMinutes", value)
                }
              />

              {/* Labor Costs */}
              <LaborCostsForm
                designTimeMinutes={formData.designTimeMinutes}
                postProcessingTimeMinutes={formData.postProcessingTimeMinutes}
                hourlyLaborRate={formData.hourlyLaborRate}
                onDesignTimeChange={(value) =>
                  handleInputChange("designTimeMinutes", value)
                }
                onPostProcessingTimeChange={(value) =>
                  handleInputChange("postProcessingTimeMinutes", value)
                }
                onHourlyLaborRateChange={(value) =>
                  handleInputChange("hourlyLaborRate", value)
                }
              />

              {/* Accessories */}
              <AccessoriesForm
                accessories={formData.accessories}
                onAccessoryChange={handleAccessoryChange}
              />
            </div>

            {/* Business Strategy Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-primary" />
                <h2 className="text-lg font-semibold">Business Strategy</h2>
              </div>

              {/* Business Costs */}
              <BusinessCostsForm
                overheadPercentage={formData.overheadPercentage}
                failureWasteRate={formData.failureWasteRate}
                desiredProfitMargin={formData.desiredProfitMargin}
                onOverheadPercentageChange={(value) =>
                  handleInputChange("overheadPercentage", value)
                }
                onFailureWasteRateChange={(value) =>
                  handleInputChange("failureWasteRate", value)
                }
                onDesiredProfitMarginChange={(value) =>
                  handleInputChange("desiredProfitMargin", value)
                }
              />

              {/* Wholesale Options */}
              <WholesaleOptionsForm
                isWholesale={formData.isWholesale || false}
                quantity={formData.quantity || 1}
                onIsWholesaleChange={(value) =>
                  handleInputChange("isWholesale", value)
                }
                onQuantityChange={(value) =>
                  handleInputChange("quantity", value)
                }
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4">
              <ActionButtons
                onSave={handleSaveCalculation}
                onReset={resetForm}
                isLoading={historyLoading}
              />
            </div>
          </div>

          {/* Right Column - Results and History */}
          <div className="space-y-5 sticky top-20 max-h-max overflow-y-auto">
            {/* Results Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h2 className="text-lg font-semibold">Pricing Results</h2>
              </div>

              {/* Cost Breakdown */}
              <CostBreakdown
                calculations={calculations}
                isWholesale={formData.isWholesale || false}
                quantity={formData.quantity || 1}
              />

              {/* Export Options */}
              {formData.productName && (
                <Card className="border-dashed border-primary/20 bg-primary/5">
                  <CardContent className="pt-4">
                    <ExportOptions
                      productName={formData.productName}
                      calculations={calculations}
                      formData={formData}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* History Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <History className="h-4 w-4 text-primary" />
                <h2 className="text-lg font-semibold">Calculation History</h2>
              </div>
              <CalculationHistory
                history={history}
                onLoadFromHistory={loadFromHistory}
              />
            </div>
          </div>
        </div>
      </MainContent>
    </AppLayout>
  );
}
