import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { WHOLESALE_CONFIG } from "../../config/wholesale";

interface ProductInfoFormProps {
  productName: string;
  isWholesale: boolean;
  quantity: number;
  onProductNameChange: (value: string) => void;
  onIsWholesaleChange: (value: boolean) => void;
  onQuantityChange: (value: number) => void;
}

export function ProductInfoForm({
  productName,
  isWholesale,
  quantity,
  onProductNameChange,
  onIsWholesaleChange,
  onQuantityChange,
}: ProductInfoFormProps) {
  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-card to-card/80">
      <CardHeader className="">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <span>Product Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3">
            <Label
              htmlFor="productName"
              className="text-sm font-medium flex items-center space-x-2"
            >
              <span>Product Name</span>
            </Label>
            <div className="relative">
              <FormInput
                id="productName"
                type="text"
                placeholder="Enter product name (e.g., Custom Phone Case, Miniature Figure)"
                value={productName}
                onChange={(e) => onProductNameChange(e.target.value)}
                variant="lg"
                className="text-base"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Give your product a descriptive name that will help you identify
              it in your calculation history.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isWholesale" className="text-sm font-medium">
                  Order Type
                </Label>
                <p className="text-xs text-muted-foreground">
                  Toggle between retail and wholesale pricing
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Retail</span>
                <Switch
                  id="isWholesale"
                  checked={isWholesale}
                  onCheckedChange={onIsWholesaleChange}
                />
                <span className="text-sm text-muted-foreground">Wholesale</span>
              </div>
            </div>

            {isWholesale && (
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => onQuantityChange(Number(e.target.value))}
                  placeholder="Enter order quantity"
                />
                <p className="text-xs text-muted-foreground">
                  Volume discounts apply for orders of{" "}
                  {WHOLESALE_CONFIG.MIN_WHOLESALE_QUANTITY}+ units
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
