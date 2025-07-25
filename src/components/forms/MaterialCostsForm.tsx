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
import { Package, DollarSign, Weight, Box } from "lucide-react";

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
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Package className="h-5 w-5 text-primary" />
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
              <Package className="h-4 w-4 text-muted-foreground" />
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
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>Material Cost per KG (₹)</span>
            </Label>
            <div className="relative">
              <Input
                id="materialCostPerKg"
                type="number"
                value={materialCostPerKg}
                onChange={(e) => onMaterialCostChange(Number(e.target.value))}
                className="pl-8 h-11"
                placeholder="0.00"
              />
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="materialWeightUsed"
              className="text-sm font-medium flex items-center space-x-2"
            >
              <Weight className="h-4 w-4 text-muted-foreground" />
              <span>Material Weight Used (grams)</span>
            </Label>
            <div className="relative">
              <Input
                id="materialWeightUsed"
                type="number"
                value={materialWeightUsed}
                onChange={(e) => onMaterialWeightChange(Number(e.target.value))}
                className="pl-8 h-11"
                placeholder="0"
              />
              <Weight className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="packagingCost"
              className="text-sm font-medium flex items-center space-x-2"
            >
              <Box className="h-4 w-4 text-muted-foreground" />
              <span>Packaging Cost (₹)</span>
            </Label>
            <div className="relative">
              <Input
                id="packagingCost"
                type="number"
                value={packagingCost}
                onChange={(e) => onPackagingCostChange(Number(e.target.value))}
                className="pl-8 h-11"
                placeholder="0.00"
              />
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
