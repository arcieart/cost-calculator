import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { Label } from "@/components/ui/label";

interface ProductInfoFormProps {
  productName: string;
  onProductNameChange: (value: string) => void;
}

export function ProductInfoForm({
  productName,
  onProductNameChange,
}: ProductInfoFormProps) {
  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-card to-card/80">
      <CardHeader className="">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <span>Product Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
            Give your product a descriptive name that will help you identify it
            in your calculation history.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
