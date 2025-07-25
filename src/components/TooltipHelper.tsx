"use client";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export default function TooltipHelper({ content, children }: TooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help">{children}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-64">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface FormFieldProps {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
}

export function FormField({ label, tooltip, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label>{label}</Label>
        {tooltip && (
          <TooltipHelper content={tooltip}>
            <span className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ❓
            </span>
          </TooltipHelper>
        )}
      </div>
      {children}
    </div>
  );
}
