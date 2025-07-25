import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeMachineCostsFormProps {
  printTimeMinutes: number;
  machineHourlyRate: number;
  electricityCostPerHour: number;
  setupTimeMinutes: number;
  onPrintTimeChange: (value: number) => void;
  onMachineRateChange: (value: number) => void;
  onElectricityCostChange: (value: number) => void;
  onSetupTimeChange: (value: number) => void;
}

export function TimeMachineCostsForm({
  printTimeMinutes,
  machineHourlyRate,
  electricityCostPerHour,
  setupTimeMinutes,
  onPrintTimeChange,
  onMachineRateChange,
  onElectricityCostChange,
  onSetupTimeChange,
}: TimeMachineCostsFormProps) {
  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-card to-card/80">
      <CardHeader className="">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <span>Time & Machine Costs</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="printTimeMinutes"
              className="text-sm font-medium flex items-center space-x-2"
            >
              <span>Print Time (minutes)</span>
            </Label>
            <div className="relative">
              <Input
                id="printTimeMinutes"
                type="number"
                value={printTimeMinutes}
                onChange={(e) => onPrintTimeChange(Number(e.target.value))}
                className="pl-8 h-11"
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="setupTimeMinutes"
              className="text-sm font-medium flex items-center space-x-2"
            >
              <span>Setup Time (minutes)</span>
            </Label>
            <div className="relative">
              <Input
                id="setupTimeMinutes"
                type="number"
                value={setupTimeMinutes}
                onChange={(e) => onSetupTimeChange(Number(e.target.value))}
                className="pl-8 h-11"
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="machineHourlyRate"
              className="text-sm font-medium flex items-center space-x-2"
            >
              <span>Machine Hourly Rate (₹)</span>
            </Label>
            <div className="relative">
              <Input
                id="machineHourlyRate"
                type="number"
                value={machineHourlyRate}
                onChange={(e) => onMachineRateChange(Number(e.target.value))}
                className="pl-8 h-11"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="electricityCostPerHour"
              className="text-sm font-medium flex items-center space-x-2"
            >
              <span>Electricity Cost per Hour (₹)</span>
            </Label>
            <div className="relative">
              <Input
                id="electricityCostPerHour"
                type="number"
                value={electricityCostPerHour}
                onChange={(e) =>
                  onElectricityCostChange(Number(e.target.value))
                }
                className="pl-8 h-11"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
