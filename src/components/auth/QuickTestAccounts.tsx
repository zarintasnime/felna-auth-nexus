"use client";

import React, { useState } from "react";
import { ShieldAlert, UserCheck, Zap, Loader2, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";

// =============================================================================
// [TEMPORARY TEST FEATURE - EASY TO REMOVE / DISABLE]
// To completely remove this widget when OTP SMS balance is ready:
// 1. Simply delete this file or remove `<QuickTestAccounts />` from UnifiedAuthPage.tsx
// 2. Or flip ENABLE_QUICK_TEST_ACCOUNTS to false
// =============================================================================
export const ENABLE_QUICK_TEST_ACCOUNTS = false;

interface QuickTestAccountsProps {
  onFillCredentials?: (identifier: string, pass: string) => void;
  className?: string;
}

export default function QuickTestAccounts({
  onFillCredentials,
  className = "",
}: QuickTestAccountsProps) {
  const router = useRouter();
  const [activeLoggingRole, setActiveLoggingRole] = useState<"admin" | "user" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!ENABLE_QUICK_TEST_ACCOUNTS) {
    return null;
  }

  // 1-Click Instant Login Executor
  async function handleDirectLogin(identifier: string, pass: string, roleType: "admin" | "user") {
    try {
      setActiveLoggingRole(roleType);
      setErrorMsg(null);

      const res = await fetch("/api/auth/login-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password: pass }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to log in with test credentials.");
        return;
      }

      // Success: redirect cleanly to destination
      const redirectUrl =
        data.redirectUrl || (roleType === "admin" ? "/admin/dashboard" : "/dashboard");
      window.location.href = redirectUrl;
    } catch (err) {
      console.error("Direct login failed", err);
      setErrorMsg("An unexpected error occurred during direct login.");
    } finally {
      setActiveLoggingRole(null);
    }
  }

  return (
    <div
      className={`rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-amber-100/40 p-4 shadow-sm text-slate-800 transition-all ${className}`}
    >
      {/* Top Banner Header */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-amber-200/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs shadow-xs">
            <Zap className="w-3.5 h-3.5 fill-white" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <span>Quick Test Access</span>
              <span className="text-[10px] font-semibold lowercase bg-amber-200/70 text-amber-900 px-1.5 py-0.2 rounded-full">
                temporary
              </span>
            </h4>
            <p className="text-[11px] text-amber-800/80">
              One-click testing while SMS OTP balance is pending
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-amber-700 hover:text-amber-900 text-xs flex items-center gap-1 p-1 rounded hover:bg-amber-200/40 transition"
          title={isCollapsed ? "Expand test credentials" : "Collapse test credentials"}
        >
          {isCollapsed ? (
            <>
              <span className="text-[11px] font-medium hidden sm:inline">Show</span>
              <ChevronDown className="w-4 h-4" />
            </>
          ) : (
            <>
              <span className="text-[11px] font-medium hidden sm:inline">Hide</span>
              <ChevronUp className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="mt-2.5 p-2 bg-red-100/90 border border-red-200 rounded-lg text-xs text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Test Accounts Cards */}
      {!isCollapsed && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* 1. Super Admin Card */}
          <div className="p-3 bg-white/95 rounded-xl border border-amber-200/90 shadow-2xs hover:border-amber-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-red-700 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                  Super Admin
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                  Admin
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-700 truncate">
                admin@felma.com
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Pass: AdminPassword123</div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 mt-3 pt-2 border-t border-slate-100">
              {onFillCredentials && (
                <button
                  type="button"
                  onClick={() => onFillCredentials("admin@felma.com", "AdminPassword123")}
                  className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded-lg transition"
                >
                  Fill Form
                </button>
              )}
              <button
                type="button"
                disabled={activeLoggingRole !== null}
                onClick={() => handleDirectLogin("admin@felma.com", "AdminPassword123", "admin")}
                className={`py-1.5 px-2 bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold rounded-lg shadow-2xs transition flex items-center justify-center gap-1 disabled:opacity-50 ${
                  !onFillCredentials ? "col-span-2" : ""
                }`}
              >
                {activeLoggingRole === "admin" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-3 h-3 fill-white" />
                    <span>1-Click In</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. Normal Regular User Card */}
          <div className="p-3 bg-white/95 rounded-xl border border-amber-200/90 shadow-2xs hover:border-amber-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  Normal User
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                  User
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-700 truncate">
                rahim@felma.com
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Pass: UserPassword123</div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 mt-3 pt-2 border-t border-slate-100">
              {onFillCredentials && (
                <button
                  type="button"
                  onClick={() => onFillCredentials("rahim@felma.com", "UserPassword123")}
                  className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded-lg transition"
                >
                  Fill Form
                </button>
              )}
              <button
                type="button"
                disabled={activeLoggingRole !== null}
                onClick={() => handleDirectLogin("rahim@felma.com", "UserPassword123", "user")}
                className={`py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-lg shadow-2xs transition flex items-center justify-center gap-1 disabled:opacity-50 ${
                  !onFillCredentials ? "col-span-2" : ""
                }`}
              >
                {activeLoggingRole === "user" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-3 h-3 fill-white" />
                    <span>1-Click In</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
