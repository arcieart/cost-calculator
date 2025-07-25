import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FILAMENT_TYPES } from "../../types/product";

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
    <Card className="border-0 shadow-md bg-gradient-to-br from-card to-card/80">
      <CardHeader className="">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <span>Material Costs</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="filamentType"
              className="text-sm font-medium flex items-center space-x-2"
            >
              <span>Filament Type</span>
            </Label>
            <Select value={filamentType} onValueChange={onFilamentTypeChange}>
              <SelectTrigger id="filamentType" className="h-11">
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

          <div className="space-y-3">
            <Label
              htmlFor="materialCostPerKg"
              className="text-sm font-medium flex items-center space-x-2"
            >
              <span>Material Cost per KG (₹)</span>
            </Label>
            <div className="relative">
              <FormInput
                id="materialCostPerKg"
                type="number"
                value={materialCostPerKg}
                onChange={(e) => onMaterialCostChange(Number(e.target.value))}
                variant="lg"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="materialWeightUsed"
              className="text-sm font-medium flex items-center space-x-2"
            >
              <span>Material Weight Used (grams)</span>
            </Label>
            <div className="relative">
              <FormInput
                id="materialWeightUsed"
                type="number"
                value={materialWeightUsed}
                onChange={(e) => onMaterialWeightChange(Number(e.target.value))}
                variant="lg"
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="packagingCost"
              className="text-sm font-medium flex items-center space-x-2"
            >
              <span>Packaging Cost (₹)</span>
            </Label>
            <div className="relative">
              <FormInput
                id="packagingCost"
                type="number"
                value={packagingCost}
                onChange={(e) => onPackagingCostChange(Number(e.target.value))}
                variant="lg"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
