import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    <Card>
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            type="text"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => onProductNameChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
