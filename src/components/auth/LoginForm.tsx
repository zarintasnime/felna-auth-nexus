"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  initialIdentifier?: string;
  initialPassword?: string;
}

export default function LoginForm({
  onSwitchToRegister,
  initialIdentifier = "",
  initialPassword = "",
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromRedirect = searchParams.get("from");
  const loggedOutParam = searchParams.get("logout");

  // Inputs
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [password, setPassword] = useState(initialPassword);
  const [showPassword, setShowPassword] = useState(false);

  // Feedback State
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [logoutNotice, setLogoutNotice] = useState<string | null>(
    loggedOutParam ? "You have been signed out successfully." : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync initial identifier/password if updated externally
  useEffect(() => {
    if (initialIdentifier) setIdentifier(initialIdentifier);
    if (initialPassword) setPassword(initialPassword);
  }, [initialIdentifier, initialPassword]);

  // ---------------------------------------------------------------------------
  // Password Login Handler
  // ---------------------------------------------------------------------------
  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLogoutNotice(null);

    if (!identifier.trim() || !password) {
      setError("Please enter your email/phone and password.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/login-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid login credentials. Please try again.");
        return;
      }

      setIsSuccess(true);
      const destination = fromRedirect || data.redirectUrl || "/dashboard";
      setTimeout(() => {
        window.location.href = destination;
      }, 700);
    } catch (err) {
      console.error(err);
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Success Transition Screen
  if (isSuccess) {
    return (
      <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#edf5ee] text-[#215428] rounded-full mb-1 shadow-xs border border-[#b8dcbc]">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-stone-800">Signed In Successfully</h2>
          <p className="text-sm text-stone-600 mt-1">Preparing your dashboard...</p>
        </div>
        <div className="pt-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#4a3b32] mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Logout Notice Banner */}
      {logoutNotice && (
        <div className="p-3 bg-[#edf5ee] border border-[#b8dcbc] rounded-xl flex items-center gap-2.5 text-[#215428] text-xs shadow-xs">
          <CheckCircle className="w-4 h-4 text-[#215428] flex-shrink-0" />
          <span>{logoutNotice}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 bg-[#fbeae8] border border-[#e8b5af] rounded-xl flex items-start gap-2.5 text-[#7a271a] text-xs shadow-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#7a271a]" />
          <div className="flex-1">
            <span>{error}</span>
            {typeof remainingAttempts === "number" && remainingAttempts > 0 && (
              <div className="mt-2 p-1.5 bg-[#fef8e7] border border-[#ecd99d] rounded-lg font-semibold text-[#6d5008] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#6d5008]" />
                <span>Remaining attempts: {remainingAttempts}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Standard Direct Credentials Form */}
      <form onSubmit={handlePasswordLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Email or Mobile Number <span className="text-[#991b1b]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] focus:bg-[#fcfbf9] transition"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Password
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="....."
              className="w-full pl-10 pr-10 py-2.5 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-sm text-stone-800 placeholder:text-base placeholder:font-bold placeholder:tracking-widest placeholder:text-stone-500/80 focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] focus:bg-[#fcfbf9] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-700 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-[#4a3b32] hover:bg-[#3d3028] text-[#fcfbf9] font-semibold rounded-xl shadow-sm shadow-[#4a3b32]/25 focus:outline-none focus:ring-2 focus:ring-[#4a3b32] focus:ring-offset-2 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#fcfbf9]" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In to Felna</span>
              <ArrowRight className="w-4 h-4 text-[#fcfbf9]" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register link */}
      <div className="text-center text-xs text-stone-600 pt-3 border-t border-[#e5ded4]">
        New to Felna?{" "}
        {onSwitchToRegister ? (
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-[#4a3b32] font-semibold hover:underline"
          >
            Create an account
          </button>
        ) : (
          <Link href="/register" className="text-[#4a3b32] font-semibold hover:underline">
            Create an account
          </Link>
        )}
      </div>
    </div>
  );
}
