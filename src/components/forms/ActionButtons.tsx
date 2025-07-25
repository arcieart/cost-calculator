import React from "react";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, Loader2 } from "lucide-react";

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
    <div className="flex gap-3">
      <Button onClick={onSave} disabled={isLoading} className="flex-1">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save
          </>
        )}
      </Button>

      <Button onClick={onReset} variant="outline" className="flex-1">
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>
    </div>
  );
}
