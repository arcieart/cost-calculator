"use client";

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
  onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Simple Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">3D Print Cost Calculator</h1>
          <p className="text-muted-foreground">Pricing made simple</p>
        </div>

        {/* Auth Card */}
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl">
              {isLogin ? "Sign In" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Sign in to access your pricing calculations"
                : "Get started with pricing"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={
                        isLogin ? "current-password" : "new-password"
                      }
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-muted-foreground">
                      At least 6 characters
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>
                      {isLogin ? "Signing in..." : "Creating account..."}
                    </span>
                  </div>
                ) : (
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  className="text-sm"
                >
                  {isLogin
                    ? "Need an account? Sign up"
                    : "Already have an account? Sign in"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Simple Benefits */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Save calculations • Export quotes • Professional pricing</p>
        </div>
      </div>
    </div>
  );
}
