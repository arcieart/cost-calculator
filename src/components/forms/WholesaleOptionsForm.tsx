import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WHOLESALE_CONFIG } from "../../config/wholesale";

interface WholesaleOptionsFormProps {
  isWholesale: boolean;
  quantity: number;
  onIsWholesaleChange: (value: boolean) => void;
  onQuantityChange: (value: number) => void;
}

export function WholesaleOptionsForm({
  isWholesale,
  quantity,
  onIsWholesaleChange,
  onQuantityChange,
}: WholesaleOptionsFormProps) {
  return (
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
              checked={isWholesale}
              onChange={(e) => onIsWholesaleChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <Label
              htmlFor="isWholesale"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              This is a wholesale order
            </Label>
          </div>
          {isWholesale && (
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => onQuantityChange(Number(e.target.value))}
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
  );
}
