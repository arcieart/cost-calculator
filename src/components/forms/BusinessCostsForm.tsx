import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BusinessCostsFormProps {
  overheadPercentage: number;
  failureWasteRate: number;
  desiredProfitMargin: number;
  onOverheadPercentageChange: (value: number) => void;
  onFailureWasteRateChange: (value: number) => void;
  onDesiredProfitMarginChange: (value: number) => void;
}

export function BusinessCostsForm({
  overheadPercentage,
  failureWasteRate,
  desiredProfitMargin,
  onOverheadPercentageChange,
  onFailureWasteRateChange,
  onDesiredProfitMarginChange,
}: BusinessCostsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="overheadPercentage">Overhead Percentage (%)</Label>
            <Input
              id="overheadPercentage"
              type="number"
              step="0.1"
              value={overheadPercentage}
              onChange={(e) =>
                onOverheadPercentageChange(Number(e.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="failureWasteRate">Failure/Waste Rate (%)</Label>
            <Input
              id="failureWasteRate"
              type="number"
              step="0.1"
              value={failureWasteRate}
              onChange={(e) => onFailureWasteRateChange(Number(e.target.value))}
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
              value={desiredProfitMargin}
              onChange={(e) =>
                onDesiredProfitMarginChange(Number(e.target.value))
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
