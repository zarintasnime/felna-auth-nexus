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
    <div className="min-h-screen bg-[#f4f0e6] text-stone-800 flex flex-col justify-between py-10 px-4 sm:px-6 selection:bg-[#4a3b32] selection:text-[#fcfbf9]">
      {/* Top Bar with Return to Home */}
      <div
        className={`w-full mx-auto flex items-center justify-between mb-4 transition-all duration-300 ${
          activeTab === "register" ? "max-w-2xl" : "max-w-lg"
        }`}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#4a3b32] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <span className="text-[11px] text-stone-500 font-medium">Felna Portal</span>
      </div>

      {/* Main Unified Credentials Card - Vintage Parchment Styling */}
      <div
        className={`w-full mx-auto bg-[#fcfbf9] rounded-2xl shadow-[0_10px_35px_rgba(74,59,50,0.08)] border border-[#d4ccc0] overflow-hidden transition-all duration-300 ${
          activeTab === "register" ? "max-w-2xl" : "max-w-lg"
        }`}
      >
        {/* Brand Card Header */}
        <div className="bg-[#fcfbf9] px-6 pt-7 pb-4 text-center border-b border-[#e5ded4]">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#ebe5da] text-[#4a3b32] rounded-2xl mb-2.5 border border-[#d4ccc0] shadow-xs">
            <ShieldCheck className="w-6 h-6 text-[#4a3b32]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-stone-800">Felna Portal</h1>
          <p className="text-stone-600 text-xs mt-0.5">
            Role-Based Authentication & Verification System
          </p>

          {/* Segmented Toggle Control (Vintage Pill Switcher) */}
          <div className="mt-5 p-1 bg-[#ebe5da] rounded-xl border border-[#d4ccc0] grid grid-cols-2 gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleTabChange("login")}
              className={`py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === "login"
                  ? "bg-[#4a3b32] text-[#fcfbf9] shadow-sm font-bold"
                  : "bg-transparent text-[#4a3b32] hover:text-stone-900 font-medium"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("register")}
              className={`py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === "register"
                  ? "bg-[#4a3b32] text-[#fcfbf9] shadow-sm font-bold"
                  : "bg-transparent text-[#4a3b32] hover:text-stone-900 font-medium"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-[#fcfbf9]">
          {activeTab === "login" ? (
            <LoginForm onSwitchToRegister={() => handleTabChange("register")} />
          ) : (
            <RegisterForm onSwitchToLogin={() => handleTabChange("login")} />
          )}
        </div>
      </div>

      {/* Footer info */}
      <footer
        className={`w-full mx-auto text-center mt-6 transition-all duration-300 ${
          activeTab === "register" ? "max-w-2xl" : "max-w-lg"
        }`}
      >
        <p className="text-[11px] text-stone-500">
          Felna Secure Authentication &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
