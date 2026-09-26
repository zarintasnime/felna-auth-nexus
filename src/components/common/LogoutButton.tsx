"use client";

import React, { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
  variant?: "navbar" | "compact" | "destructive" | "default";
  showIcon?: boolean;
  label?: string;
  redirectTo?: string;
}

export default function LogoutButton({
  className = "",
  variant = "default",
  showIcon = true,
  label = "Sign Out",
  redirectTo = "/login?logout=success",
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      });

      // Clear any client state or redirect
      window.location.href = redirectTo;
    } catch (err) {
      console.error("Logout failed:", err);
      // Fallback navigation
      window.location.href = redirectTo;
    }
  }

  // Variant styles
  const variantStyles = {
    navbar:
      "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/40 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800/40",
    compact:
      "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition",
    destructive:
      "inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition disabled:opacity-50",
    default:
      "inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-red-900/40 hover:text-red-300 border border-slate-700 hover:border-red-700/50 rounded-lg transition disabled:opacity-50",
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`${variantStyles[variant]} ${className}`}
      title="Sign Out of your account"
    >
      {isLoggingOut ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
          <span>Signing Out...</span>
        </>
      ) : (
        <>
          {showIcon && <LogOut className="w-3.5 h-3.5" />}
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
