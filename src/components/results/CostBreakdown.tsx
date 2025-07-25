import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculationResults } from "../../types/product";
import { formatCurrency } from "../../lib/formatters";
import { getVolumeDiscount, WHOLESALE_CONFIG } from "../../config/wholesale";

interface CostBreakdownProps {
  calculations: CalculationResults;
  isWholesale: boolean;
  quantity: number;
}

export function CostBreakdown({
  calculations,
  isWholesale,
  quantity,
}: CostBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Cost Breakdown {isWholesale && `(${quantity} units)`}
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
            <span className="text-gray-600 dark:text-gray-400">Overhead:</span>
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
              {isWholesale ? "Cost per Unit:" : "Total Cost:"}
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              {formatCurrency(calculations.totalCost)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-green-600 dark:text-green-400">
              {isWholesale ? "Wholesale Price per Unit:" : "Selling Price:"}
            </span>
            <span className="text-green-600 dark:text-green-400">
              {formatCurrency(calculations.sellingPrice)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-green-600 dark:text-green-400">
              {isWholesale ? "Profit per Unit:" : "Profit:"}
            </span>
            <span className="text-green-600 dark:text-green-400">
              {formatCurrency(calculations.profitAmount)}
            </span>
          </div>
          {isWholesale && (
            <>
              <hr className="border-gray-200 dark:border-gray-600" />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-purple-600 dark:text-purple-400">
                  Total Order Value:
                </span>
                <span className="text-purple-600 dark:text-purple-400">
                  {formatCurrency(calculations.sellingPrice * quantity)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-purple-600 dark:text-purple-400">
                  Total Profit:
                </span>
                <span className="text-purple-600 dark:text-purple-400">
                  {formatCurrency(calculations.profitAmount * quantity)}
                </span>
              </div>
              {quantity >= WHOLESALE_CONFIG.MIN_WHOLESALE_QUANTITY && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900 rounded">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Volume Discount Applied:{" "}
                    {Math.round(getVolumeDiscount(quantity) * 100)}%
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
