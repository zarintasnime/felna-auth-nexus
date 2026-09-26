"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowLeft, LogIn, UserPlus } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface UnifiedAuthPageProps {
  initialTab?: "login" | "register";
}

export default function UnifiedAuthPage({ initialTab = "login" }: UnifiedAuthPageProps) {
  const searchParams = useSearchParams();
  const queryTab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<"login" | "register">(
    queryTab === "register" || initialTab === "register" ? "register" : "login"
  );

  // Sync tab with URL parameter if present
  useEffect(() => {
    if (queryTab === "register") {
      setActiveTab("register");
    } else if (queryTab === "login") {
      setActiveTab("login");
    }
  }, [queryTab]);

  function handleTabChange(tab: "login" | "register") {
    setActiveTab(tab);
    // Update URL query string smoothly without reload
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("tab", tab);
    window.history.replaceState({}, "", newUrl.toString());
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between py-8 px-4 sm:px-6">
      {/* Top Bar with Return to Home */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <span className="text-[11px] text-slate-400 font-medium">Felna Portal</span>
      </div>

      {/* Main Unified Credentials Card */}
      <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Brand Card Header */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 px-6 py-6 text-white text-center border-b border-slate-800">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/20 text-blue-400 rounded-2xl mb-2.5 border border-blue-500/30 shadow-inner">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Felna Portal</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Role-Based Authentication & Verification System
          </p>

          {/* Master Tab Selector (Sign In vs Create Account) */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-slate-800/90 rounded-2xl border border-slate-700/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleTabChange("login")}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "login"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("register")}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "register"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5">
          {/* Active Tab Content */}
          {activeTab === "login" ? (
            <LoginForm
              onSwitchToRegister={() => handleTabChange("register")}
            />
          ) : (
            <RegisterForm onSwitchToLogin={() => handleTabChange("login")} />
          )}
        </div>
      </div>

      {/* Footer info */}
      <footer className="max-w-md w-full mx-auto text-center mt-6">
        <p className="text-[11px] text-slate-400">
          Felna Secure Authentication &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
