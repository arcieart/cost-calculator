"use client";

import React from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import AuthForm from "../components/AuthForm";
import CostCalculator from "../components/CostCalculator";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Calculator, Loader2 } from "lucide-react";

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-accent/10">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-xl">
              <Calculator className="h-12 w-12 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
              <span className="text-base font-medium text-foreground">
                Loading Calculator...
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Preparing your pricing tools
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <CostCalculator />;
}

export default function Home() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
