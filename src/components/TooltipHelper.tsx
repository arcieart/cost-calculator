"use client";

import React, { useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 w-64 p-2 mt-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-md shadow-lg -translate-x-1/2 left-1/2">
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45 -top-1 left-1/2 transform -translate-x-1/2" />
        </div>
      )}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
}

export function FormField({ label, tooltip, children }: FormFieldProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label className="label">{label}</label>
        {tooltip && (
          <Tooltip content={tooltip}>
            <span className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ❓
            </span>
          </Tooltip>
        )}
      </div>
      {children}
    </div>
  );
}
