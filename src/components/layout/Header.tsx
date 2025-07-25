import React from "react";
import { Button } from "@/components/ui/button";
import { Calculator, Moon, Sun, LogOut } from "lucide-react";

interface HeaderProps {
  userEmail?: string | null;
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <Calculator className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-semibold">
                3D Print Cost Calculator
              </h1>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              onClick={onToggleDarkMode}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Info */}
            {userEmail && (
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {userEmail.split("@")[0]}
              </span>
            )}

            {/* Logout Button */}
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="h-8"
            >
              <LogOut className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
