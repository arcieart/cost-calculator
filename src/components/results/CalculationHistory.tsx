import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCost } from "../../types/product";
import { formatCurrency } from "../../lib/formatters";
import { Timestamp } from "firebase/firestore";

interface CalculationHistoryProps {
  history: ProductCost[];
  onLoadFromHistory: (item: ProductCost) => void;
}

export function CalculationHistory({
  history,
  onLoadFromHistory,
}: CalculationHistoryProps) {
  return (
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
                onClick={() => onLoadFromHistory(item)}
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
  );
}
