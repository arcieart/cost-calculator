import React from "react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onSave: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export function ActionButtons({
  onSave,
  onReset,
  isLoading,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={onSave} disabled={isLoading} className="px-6 py-2">
        {isLoading ? "Saving..." : "Save Calculation"}
      </Button>
      <Button onClick={onReset} variant="outline" className="px-6 py-2">
        Reset Form
      </Button>
    </div>
  );
}
