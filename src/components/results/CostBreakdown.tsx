import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalculationResults, ProductCost } from "../../types/product";
import { formatCurrency } from "../../lib/formatters";
import { getVolumeDiscount, WHOLESALE_CONFIG } from "../../config/wholesale";
import { calculateCosts } from "../../lib/calculations";
import { Calculator, IndianRupee, TrendingUp } from "lucide-react";

interface CostBreakdownProps {
  calculations: CalculationResults;
  isWholesale: boolean;
  quantity: number;
  // Add formData to calculate retail price correctly
  formData: ProductCost;
  originalProfitMargin?: number;
}

export function CostBreakdown({
  calculations,
  isWholesale,
  quantity,
  formData,
  originalProfitMargin,
}: CostBreakdownProps) {
  const costItems = [
    {
      label: "Material Cost",
      value: calculations.materialCost,
    },
    {
      label: "Machine Cost",
      value: calculations.machineCost,
    },
    {
      label: "Labor Cost",
      value: calculations.laborCost,
    },
    {
      label: "Accessories Cost",
      value: calculations.accessoriesCost,
    },
    {
      label: "Overhead",
      value: calculations.overheadCost,
    },
    {
      label: "Waste Allowance",
      value: calculations.wasteAllowance,
    },
  ];

  // Calculate retail price for comparison when showing wholesale
  const getRetailPrice = () => {
    if (!isWholesale) return null;

    // Create retail version of formData and calculate proper retail price
    const retailFormData: ProductCost = {
      ...formData,
      isWholesale: false,
      quantity: 1,
    };

    const retailCalculations = calculateCosts(retailFormData);
    return retailCalculations.sellingPrice;
  };

  const retailPrice = getRetailPrice();
  const totalDiscountPercentage = retailPrice
    ? ((retailPrice - calculations.sellingPrice) / retailPrice) * 100
    : 0;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="h-4 w-4 text-primary" />
            <span className="text-lg">Cost Breakdown</span>
          </div>
          {isWholesale && <Badge variant="secondary">{quantity} units</Badge>}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cost Components */}
        <div className="space-y-2">
          {costItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
            >
              <span className="text-sm text-muted-foreground">
                {item.label}
              </span>
              <span className="font-medium">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="space-y-3 pt-2">
          {/* Total Cost */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center space-x-2">
              <IndianRupee className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {isWholesale ? "Cost per Unit" : "Total Cost"}
              </span>
            </div>
            <span className="text-lg font-semibold text-primary">
              {formatCurrency(calculations.totalCost)}
            </span>
          </div>

          {/* Profit */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="font-medium text-emerald-700 dark:text-emerald-400">
                {isWholesale ? "Profit per Unit" : "Profit"}
              </span>
            </div>
            <span className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
              {formatCurrency(calculations.profitAmount)}
            </span>
          </div>

          {/* Selling Price */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <span className="font-medium text-green-700 dark:text-green-400">
              {isWholesale ? "Wholesale Price per Unit" : "Final Selling Price"}
            </span>
            <span className="text-lg font-semibold text-green-700 dark:text-green-400">
              {formatCurrency(calculations.sellingPrice)}
            </span>
          </div>
        </div>

        {/* Wholesale Summary */}
        {isWholesale && (
          <>
            <div className="border-t border-border pt-3"></div>
            <div className="space-y-3">
              <h3 className="font-medium">Wholesale Summary</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    Total Order Value
                  </div>
                  <div className="font-semibold">
                    {formatCurrency(calculations.sellingPrice * quantity)}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    Total Profit
                  </div>
                  <div className="font-semibold">
                    {formatCurrency(calculations.profitAmount * quantity)}
                  </div>
                </div>
              </div>

              {/* Total Discount Information */}
              {retailPrice && totalDiscountPercentage > 0 && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Total Wholesale Discount
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 dark:bg-blue-800"
                    >
                      {totalDiscountPercentage.toFixed(1)}% off
                    </Badge>
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                    <div>Retail Price: {formatCurrency(retailPrice)}</div>
                    <div>
                      You Save:{" "}
                      {formatCurrency(retailPrice - calculations.sellingPrice)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
