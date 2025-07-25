import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Tag } from "lucide-react";

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
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Package className="h-5 w-5 text-primary" />
          <span>Product Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Label
            htmlFor="productName"
            className="text-sm font-medium flex items-center space-x-2"
          >
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span>Product Name</span>
          </Label>
          <div className="relative">
            <Input
              id="productName"
              type="text"
              placeholder="Enter product name (e.g., Custom Phone Case, Miniature Figure)"
              value={productName}
              onChange={(e) => onProductNameChange(e.target.value)}
              className="pl-10 h-12 text-base"
            />
            <Tag className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
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
