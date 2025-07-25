import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FILAMENT_TYPES, FilamentType } from "../../types/product";

interface MaterialCostsFormProps {
  filamentType: string;
  materialCostPerKg: number;
  materialWeightUsed: number;
  packagingCost: number;
  onFilamentTypeChange: (value: string) => void;
  onMaterialCostChange: (value: number) => void;
  onMaterialWeightChange: (value: number) => void;
  onPackagingCostChange: (value: number) => void;
}

export function MaterialCostsForm({
  filamentType,
  materialCostPerKg,
  materialWeightUsed,
  packagingCost,
  onFilamentTypeChange,
  onMaterialCostChange,
  onMaterialWeightChange,
  onPackagingCostChange,
}: MaterialCostsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Material Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filamentType">Filament Type</Label>
            <Select value={filamentType} onValueChange={onFilamentTypeChange}>
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
            <Label htmlFor="materialCostPerKg">Material Cost per KG (₹)</Label>
            <Input
              id="materialCostPerKg"
              type="number"
              value={materialCostPerKg}
              onChange={(e) => onMaterialCostChange(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="materialWeightUsed">
              Material Weight Used (grams)
            </Label>
            <Input
              id="materialWeightUsed"
              type="number"
              value={materialWeightUsed}
              onChange={(e) => onMaterialWeightChange(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="packagingCost">Packaging Cost (₹)</Label>
            <Input
              id="packagingCost"
              type="number"
              value={packagingCost}
              onChange={(e) => onPackagingCostChange(Number(e.target.value))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
