import React from "react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  userEmail?: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

export function Header({
  userEmail,
  darkMode,
  onToggleDarkMode,
  onLogout,
}: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            3D Printing Cost Calculator
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              onClick={onToggleDarkMode}
              variant="ghost"
              size="icon"
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {darkMode ? "☀️" : "🌙"}
            </Button>
            {userEmail && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {userEmail}
              </span>
            )}
            <Button onClick={onLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
