import React from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>
  );
}

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </div>
  );
}
