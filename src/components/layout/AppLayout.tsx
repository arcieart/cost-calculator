import React from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
      {children}
    </div>
  );
}

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      <div className="max-w-6xl mx-auto">{children}</div>
    </main>
  );
}
