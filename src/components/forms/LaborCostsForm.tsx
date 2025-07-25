import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LaborCostsFormProps {
  designTimeMinutes: number;
  postProcessingTimeMinutes: number;
  hourlyLaborRate: number;
  onDesignTimeChange: (value: number) => void;
  onPostProcessingTimeChange: (value: number) => void;
  onHourlyLaborRateChange: (value: number) => void;
}

export function LaborCostsForm({
  designTimeMinutes,
  postProcessingTimeMinutes,
  hourlyLaborRate,
  onDesignTimeChange,
  onPostProcessingTimeChange,
  onHourlyLaborRateChange,
}: LaborCostsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Labor Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="designTimeMinutes">Design Time (minutes)</Label>
            <Input
              id="designTimeMinutes"
              type="number"
              value={designTimeMinutes}
              onChange={(e) => onDesignTimeChange(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postProcessingTimeMinutes">
              Post-Processing Time (minutes)
            </Label>
            <Input
              id="postProcessingTimeMinutes"
              type="number"
              value={postProcessingTimeMinutes}
              onChange={(e) =>
                onPostProcessingTimeChange(Number(e.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hourlyLaborRate">Hourly Labor Rate (₹/hour)</Label>
            <Input
              id="hourlyLaborRate"
              type="number"
              value={hourlyLaborRate}
              onChange={(e) => onHourlyLaborRateChange(Number(e.target.value))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
