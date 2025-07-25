"use client";

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import ExportOptions from "./ExportOptions";
import { Card, CardContent } from "@/components/ui/card";

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Information */}
            <ProductInfoForm
              productName={formData.productName}
              onProductNameChange={(value) =>
                handleInputChange("productName", value)
              }
            />

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
              onQuantityChange={(value) => handleInputChange("quantity", value)}
            />

            {/* Action Buttons */}
            <ActionButtons
              onSave={handleSaveCalculation}
              onReset={resetForm}
              isLoading={historyLoading}
            />
          </div>

          {/* Right Column - Results and History */}
          <div className="space-y-6">
            {/* Cost Breakdown */}
            <CostBreakdown
              calculations={calculations}
              isWholesale={formData.isWholesale || false}
              quantity={formData.quantity || 1}
            />

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
            <CalculationHistory
              history={history}
              onLoadFromHistory={loadFromHistory}
            />
          </div>
        </div>
      </MainContent>
    </AppLayout>
  );
}
