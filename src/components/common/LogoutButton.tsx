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
      await fetch("/api/auth/logout", {
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
      "inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-stone-700 hover:text-[#7a271a] bg-[#ebe5da] hover:bg-[#fbeae8] rounded-xl transition-colors border border-[#d4ccc0] hover:border-[#e8b5af]",
    compact:
      "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition",
    destructive:
      "inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition disabled:opacity-50",
    default:
      "inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl transition shadow-2xs disabled:opacity-50",
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
          <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
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
