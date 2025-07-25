import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductCost } from "../../types/product";
import { formatCurrency } from "../../lib/formatters";
import { exportHistoryToExcel } from "../../lib/excelExport";
import { Timestamp } from "firebase/firestore";

interface CalculationHistoryProps {
  history: ProductCost[];
  onLoadFromHistory: (item: ProductCost) => void;
  onDeleteItem: (id: string) => Promise<boolean>;
  loading?: boolean;
}

export function CalculationHistory({
  history,
  onLoadFromHistory,
  onDeleteItem,
  loading = false,
}: CalculationHistoryProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onLoadFromHistory

    if (deleteConfirm === id) {
      // User clicked delete again, confirm deletion
      try {
        await onDeleteItem(id);
        setDeleteConfirm(null);
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item. Please try again.");
      }
    } else {
      // First click, show confirmation
      setDeleteConfirm(id);
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => {
        setDeleteConfirm(null);
      }, 3000);
    }
  };

  const handleExport = () => {
    if (history.length === 0) {
      alert("No history to export.");
      return;
    }
    exportHistoryToExcel(history);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Calculation History</CardTitle>
        {history.length > 0 && (
          <Button
            onClick={handleExport}
            size="sm"
            variant="outline"
            disabled={loading}
          >
            Export Excel
          </Button>
        )}
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
                className="p-3 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative group"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => onLoadFromHistory(item)}
                >
                  <div className="font-medium text-sm truncate pr-20">
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

                {/* Delete button */}
                <Button
                  size="sm"
                  variant={deleteConfirm === item.id ? "destructive" : "ghost"}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                  onClick={(e) => handleDelete(item.id || "", e)}
                  disabled={loading}
                  title={
                    deleteConfirm === item.id
                      ? "Click again to confirm delete"
                      : "Delete this item"
                  }
                >
                  {deleteConfirm === item.id ? "✓" : "×"}
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
