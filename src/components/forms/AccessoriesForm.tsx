import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { AccessoriesState, AccessoryType } from "../../types/accessories";
import { ACCESSORY_CONFIGS, ACCESSORY_TYPES } from "../../config/accessories";

interface AccessoriesFormProps {
  accessories: AccessoriesState;
  onAccessoryChange: (
    accessoryType: AccessoryType,
    field: "enabled" | "quantity" | "unitCost",
    value: boolean | number
  ) => void;
}

export function AccessoriesForm({
  accessories,
  onAccessoryChange,
}: AccessoriesFormProps) {
  const getSelectedAccessories = () => {
    return ACCESSORY_TYPES.filter((type) => accessories[type]?.enabled);
  };

  const getSelectedAccessoriesCount = () => {
    return getSelectedAccessories().length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accessories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Accessories Dropdown Selector */}
          <div className="space-y-2">
            <Label>Select Accessories</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {getSelectedAccessoriesCount() === 0 ? (
                    "Select accessories..."
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{getSelectedAccessoriesCount()} selected</span>
                      <div className="flex gap-1">
                        {getSelectedAccessories()
                          .slice(0, 2)
                          .map((type) => (
                            <Badge
                              key={type}
                              variant="secondary"
                              className="text-xs"
                            >
                              {ACCESSORY_CONFIGS[type].name}
                            </Badge>
                          ))}
                        {getSelectedAccessoriesCount() > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{getSelectedAccessoriesCount() - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Choose Accessories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ACCESSORY_TYPES.map((accessoryType) => {
                  const accessory = accessories[accessoryType];
                  const config = ACCESSORY_CONFIGS[accessoryType];

                  return (
                    <DropdownMenuCheckboxItem
                      key={accessoryType}
                      checked={accessory?.enabled || false}
                      onCheckedChange={(checked) =>
                        onAccessoryChange(accessoryType, "enabled", checked)
                      }
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{config.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {config.description}
                        </span>
                      </div>
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Configuration for Selected Accessories */}
          {getSelectedAccessories().length > 0 && (
            <div className="space-y-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Configure Selected Accessories:
              </div>
              {getSelectedAccessories().map((accessoryType) => {
                const accessory = accessories[accessoryType];
                const config = ACCESSORY_CONFIGS[accessoryType];

                return (
                  <div
                    key={accessoryType}
                    className="border border-gray-200 dark:border-gray-600 rounded-md p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium">{config.name}</div>
                      <Badge variant="outline" className="text-xs">
                        ₹{accessory.unitCost * accessory.quantity}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${accessoryType}-quantity`}>
                          Quantity
                        </Label>
                        <Input
                          id={`${accessoryType}-quantity`}
                          type="number"
                          min="1"
                          value={accessory.quantity}
                          onChange={(e) =>
                            onAccessoryChange(
                              accessoryType,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${accessoryType}-cost`}>
                          Unit Cost (₹)
                        </Label>
                        <Input
                          id={`${accessoryType}-cost`}
                          type="number"
                          step="0.01"
                          value={accessory.unitCost}
                          onChange={(e) =>
                            onAccessoryChange(
                              accessoryType,
                              "unitCost",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
