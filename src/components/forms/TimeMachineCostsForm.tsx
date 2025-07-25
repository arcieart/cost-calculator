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
    <Card>
      <CardHeader>
        <CardTitle>Time & Machine Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="printTimeMinutes">Print Time (Minutes)</Label>
            <Input
              id="printTimeMinutes"
              type="number"
              value={printTimeMinutes}
              onChange={(e) => onPrintTimeChange(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="machineHourlyRate">
              Machine Hourly Rate (₹/hour)
            </Label>
            <Input
              id="machineHourlyRate"
              type="number"
              value={machineHourlyRate}
              onChange={(e) => onMachineRateChange(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="electricityCostPerHour">
              Electricity Cost per Hour (₹/hour)
            </Label>
            <Input
              id="electricityCostPerHour"
              type="number"
              value={electricityCostPerHour}
              onChange={(e) => onElectricityCostChange(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="setupTimeMinutes">
              Setup/Preparation Time (minutes)
            </Label>
            <Input
              id="setupTimeMinutes"
              type="number"
              value={setupTimeMinutes}
              onChange={(e) => onSetupTimeChange(Number(e.target.value))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
