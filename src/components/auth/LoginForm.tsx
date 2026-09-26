"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  KeyRound,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle,
  ArrowRight,
  RefreshCw,
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

  // Mode: "password" | "otp"
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");

  // OTP Step: "phone" | "otp" | "success"
  const [otpStep, setOtpStep] = useState<"phone" | "otp" | "success">("phone");

  // Password Inputs
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [password, setPassword] = useState(initialPassword);
  const [showPassword, setShowPassword] = useState(false);

  // OTP Inputs
  const [phone, setPhone] = useState("");
  const [normalizedPhone, setNormalizedPhone] = useState("");
  const [otp, setOtp] = useState("");

  // OTP Cooldown & Attempt Tracking
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  // Feedback State
  const [error, setError] = useState<string | null>(null);
  const [logoutNotice, setLogoutNotice] = useState<string | null>(
    loggedOutParam ? "You have been signed out successfully." : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync initial identifier/password if updated externally
  useEffect(() => {
    if (initialIdentifier) setIdentifier(initialIdentifier);
    if (initialPassword) setPassword(initialPassword);
  }, [initialIdentifier, initialPassword]);

  // 60-Second Cooldown Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (authMethod === "otp" && otpStep === "otp" && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [authMethod, otpStep, cooldown]);

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

  // ---------------------------------------------------------------------------
  // OTP Step 1: Request Login Code
  // ---------------------------------------------------------------------------
  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLogoutNotice(null);

    if (!phone.trim()) {
      setError("Please enter your mobile phone number.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to send verification code. Please check your phone number.");
        if (data.waitSeconds) {
          setCooldown(data.waitSeconds);
          setCanResend(false);
        }
        return;
      }

      setNormalizedPhone(data.phone || phone);
      setOtpStep("otp");
      setCooldown(60);
      setCanResend(false);
    } catch (err) {
      console.error(err);
      setError("An unexpected network error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // OTP Step 2: Verify Login Code
  // ---------------------------------------------------------------------------
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/verify-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizedPhone,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid verification code.");
        if (typeof data.remainingAttempts === "number") {
          setRemainingAttempts(data.remainingAttempts);
        }
        return;
      }

      setIsSuccess(true);
      const destination = fromRedirect || "/dashboard";
      setTimeout(() => {
        window.location.href = destination;
      }, 700);
    } catch (err) {
      console.error(err);
      setError("A network error occurred while verifying the code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Resend OTP Handler
  // ---------------------------------------------------------------------------
  async function handleResendOtp() {
    if (!canResend || isResending) return;
    setError(null);

    try {
      setIsResending(true);
      const res = await fetch("/api/auth/login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Unable to resend verification code.");
        if (data.waitSeconds) {
          setCooldown(data.waitSeconds);
          setCanResend(false);
        }
        return;
      }

      setCooldown(60);
      setCanResend(false);
      setRemainingAttempts(null);
    } catch (err) {
      console.error(err);
      setError("Failed to resend code due to a connection error.");
    } finally {
      setIsResending(false);
    }
  }

  // Success Transition Screen
  if (isSuccess) {
    return (
      <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 text-green-600 rounded-full mb-1 shadow-sm">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Signed In Successfully</h2>
          <p className="text-sm text-slate-500 mt-1">Preparing your dashboard...</p>
        </div>
        <div className="pt-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Sub-method switcher: Password vs Mobile OTP */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setAuthMethod("password");
            setError(null);
          }}
          className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            authMethod === "password"
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Password</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMethod("otp");
            setOtpStep("phone");
            setError(null);
          }}
          className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            authMethod === "otp"
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Mobile Phone OTP</span>
        </button>
      </div>

      {/* Logout Notice Banner */}
      {logoutNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{logoutNotice}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1">
            <span>{error}</span>
            {typeof remainingAttempts === "number" && remainingAttempts > 0 && (
              <div className="mt-1 font-semibold text-red-800">
                Remaining attempts: {remainingAttempts}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* Option 1: Password Form */}
      {/* ===================================================================== */}
      {authMethod === "password" && (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email or Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@felna.com or 017XXXXXXXX"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Felna</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* ===================================================================== */}
      {/* Option 2: Mobile Phone + OTP Form */}
      {/* ===================================================================== */}
      {authMethod === "otp" && (
        <>
          {otpStep === "phone" && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  We will send a 6-digit verification code to this phone number.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Login Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {otpStep === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs text-slate-500">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-semibold text-slate-800">{normalizedPhone}</span>
                </p>
              </div>

              <div>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••••"
                  className="w-full text-center text-2xl tracking-[0.4em] font-mono py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <span>Verify & Sign In</span>
                )}
              </button>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep("phone");
                    setOtp("");
                    setError(null);
                  }}
                  className="text-slate-500 hover:text-slate-800 underline"
                >
                  Change phone
                </button>

                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isResending ? "animate-spin" : ""}`} />
                    <span>Resend Code</span>
                  </button>
                ) : (
                  <span className="text-slate-400">
                    Resend in <span className="font-semibold text-slate-600">{cooldown}s</span>
                  </span>
                )}
              </div>
            </form>
          )}
        </>
      )}

      {/* Switch to Register link */}
      <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
        New to Felna?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-blue-600 font-semibold hover:underline"
        >
          Create an account
        </button>
      </div>
    </div>
  );
}
