"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
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
  Clock,
  ShieldCheck,
} from "lucide-react";
import BangladeshAddressSelector from "@/components/geo/BangladeshAddressSelector";
import OtpVerificationSection from "./OtpVerificationSection";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  // Step state: "form" | "otp" | "success"
  const [step, setStep] = useState<"form" | "otp" | "success">("form");

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [upazilaId, setUpazilaId] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP State
  const [otp, setOtp] = useState("");
  const [normalizedPhone, setNormalizedPhone] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [cooldown, setCooldown] = useState(120); // 2 minutes (120 seconds)
  const [canResend, setCanResend] = useState(false);

  // Status & Error Messages
  const [formError, setFormError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Format seconds into MM:SS (e.g. 02:00)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Cooldown timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && cooldown > 0) {
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
  }, [step, cooldown]);

  // Form Submission
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    // Validation checks
    if (!name || name.trim().length < 3) {
      setFormError("Full name must be at least 3 characters long.");
      return;
    }

    if (!email || !email.trim()) {
      setFormError("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError("Please provide a valid email address.");
      return;
    }

    if (!divisionId) {
      setFormError("Please select your division.");
      return;
    }

    if (!districtId) {
      setFormError("Please select your district.");
      return;
    }

    if (!upazilaId) {
      setFormError("Please select your thana or upazila.");
      return;
    }

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          divisionId,
          districtId,
          upazilaId,
          address: address.trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setFormError(data.error || "Registration failed. Please check your information.");
        return;
      }

      setNormalizedPhone(data.phone || phone);
      setStep("otp");
      setCooldown(120);
      setCanResend(false);
      setOtp("");
    } catch (err) {
      console.error(err);
      setFormError("An unexpected network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // OTP Verification
  async function handleVerifyOtp(submittedCode?: string) {
    const codeToVerify = (typeof submittedCode === "string" ? submittedCode : otp).trim();
    setOtpError(null);

    if (cooldown === 0) {
      setOtpError("OTP Expired. Please request a new code.");
      return;
    }

    if (codeToVerify.length !== 6) {
      setOtpError("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setIsVerifying(true);
      const res = await fetch("/api/auth/verify-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizedPhone,
          otp: codeToVerify,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setOtpError(data.error || "Invalid verification code.");
        if (typeof data.remainingAttempts === "number") {
          setRemainingAttempts(data.remainingAttempts);
        }
        return;
      }

      setStep("success");
    } catch (err) {
      console.error(err);
      setOtpError("Unable to verify code due to a network error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }

  // Resend OTP
  async function handleResendOtp() {
    if (isResending) return;
    setOtpError(null);

    try {
      setIsResending(true);
      const res = await fetch("/api/auth/resend-registration-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setOtpError(data.error || "Unable to resend verification code.");
        if (data.waitSeconds) {
          setCooldown(data.waitSeconds);
          setCanResend(false);
        }
        return;
      }

      const nextCooldown = typeof data.waitSeconds === "number" ? data.waitSeconds : 120;
      setCooldown(nextCooldown);
      setCanResend(false);
      setOtp("");
      setRemainingAttempts(null);
    } catch (err) {
      console.error(err);
      setOtpError("Failed to resend verification code. Please check your connection.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* =================================================================== */}
      {/* Step 1: Registration Form with Relaxed & Spacious UX */}
      {/* =================================================================== */}
      {step === "form" && (
        <form onSubmit={handleRegister} className="space-y-6 animate-in fade-in duration-200">
          {formError && (
            <div className="p-4 bg-[#fbeae8] border border-[#e8b5af] rounded-2xl flex items-start gap-3 text-[#7a271a] text-xs sm:text-sm shadow-xs">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#7a271a]" />
              <span className="font-medium">{formError}</span>
            </div>
          )}

          {/* Section 1: Personal Details */}
          <div className="space-y-4">
            <div className="border-b border-[#e5ded4] pb-2">
              <h2 className="text-xs sm:text-sm font-bold text-stone-800 uppercase tracking-wider">
                Personal Information
              </h2>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-[#991b1b]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariqul Islam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-xs sm:text-sm text-stone-800 placeholder:text-stone-500/70 focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] focus:bg-[#fcfbf9] transition"
                />
              </div>
            </div>

            {/* Phone & Email (2-Column Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Mobile Phone <span className="text-[#991b1b]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-xs sm:text-sm text-stone-800 placeholder:text-stone-500/70 focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] focus:bg-[#fcfbf9] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-[#991b1b]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-xs sm:text-sm text-stone-800 placeholder:text-stone-500/70 focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] focus:bg-[#fcfbf9] transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Modular Bangladesh Geographic Selector */}
          <BangladeshAddressSelector
            divisionId={divisionId}
            onDivisionChange={(newDiv) => setDivisionId(newDiv)}
            districtId={districtId}
            onDistrictChange={(newDist) => setDistrictId(newDist)}
            upazilaId={upazilaId}
            onUpazilaChange={(newUpz) => setUpazilaId(newUpz)}
            address={address}
            onAddressChange={(newAddr) => setAddress(newAddr)}
            disabled={isSubmitting}
            required={true}
          />

          {/* Section 3: Password & Security */}
          <div className="space-y-4">
            <div className="border-b border-[#e5ded4] pb-2">
              <h2 className="text-xs sm:text-sm font-bold text-stone-800 uppercase tracking-wider">
                Security
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Password <span className="text-[#991b1b]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-xs sm:text-sm text-stone-800 placeholder:text-stone-500/70 focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] focus:bg-[#fcfbf9] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-700 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Confirm Password <span className="text-[#991b1b]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-xs sm:text-sm text-stone-800 placeholder:text-stone-500/70 focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] focus:bg-[#fcfbf9] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-700 focus:outline-none cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 sm:py-4 px-6 bg-[#4a3b32] hover:bg-[#3d3028] text-[#fcfbf9] font-bold text-sm sm:text-base rounded-xl shadow-md shadow-[#4a3b32]/25 focus:outline-none focus:ring-2 focus:ring-[#4a3b32] focus:ring-offset-2 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-[#fcfbf9]" />
                  <span>Processing Registration...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Verify</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="text-center text-xs sm:text-sm text-stone-600 pt-3 border-t border-[#e5ded4]">
            Already registered?{" "}
            {onSwitchToLogin ? (
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-[#4a3b32] font-bold hover:underline cursor-pointer"
              >
                Sign in to your account
              </button>
            ) : (
              <Link href="/login" className="text-[#4a3b32] font-bold hover:underline">
                Sign in to your account
              </Link>
            )}
          </div>
        </form>
      )}

      {/* =================================================================== */}
      {/* Step 2: Modular OTP Verification Screen (Single Resend Button, Best UX) */}
      {/* =================================================================== */}
      {step === "otp" && (
        <OtpVerificationSection
          phone={phone}
          normalizedPhone={normalizedPhone}
          cooldown={cooldown}
          isVerifying={isVerifying}
          isResending={isResending}
          otpError={otpError}
          remainingAttempts={remainingAttempts}
          onVerify={(code) => handleVerifyOtp(code)}
          onResend={handleResendOtp}
          onChangePhone={() => {
            setStep("form");
            setFormError(null);
            setOtpError(null);
            setOtp("");
          }}
          onOtpChange={(code) => {
            setOtp(code);
            if (otpError) setOtpError(null);
          }}
          title="Verify Mobile Number"
          submitButtonText="Verify & Activate Account"
          verifyingButtonText="Activating Account..."
        />
      )}

      {/* =================================================================== */}
      {/* Step 3: Success Screen */}
      {/* =================================================================== */}
      {step === "success" && (
        <div className="text-center space-y-6 py-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#edf5ee] text-[#215428] rounded-full shadow-xs border border-[#b8dcbc]">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-800">Account Activated!</h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
              Your mobile phone and credentials have been verified successfully. Your account is now
              active.
            </p>
          </div>

          <div className="p-4 bg-[#f5efe6] border border-[#d4ccc0] rounded-2xl text-left text-xs sm:text-sm space-y-2 text-stone-700">
            <div className="flex justify-between">
              <span className="font-semibold text-stone-800">Full Name:</span>
              <span>{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-stone-800">Mobile Phone:</span>
              <span>{normalizedPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-stone-800">Email Address:</span>
              <span>{email}</span>
            </div>
          </div>

          {onSwitchToLogin ? (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="w-full py-3.5 sm:py-4 px-6 bg-[#4a3b32] hover:bg-[#3d3028] text-[#fcfbf9] text-sm sm:text-base font-bold rounded-xl shadow-md shadow-[#4a3b32]/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href="/login"
              className="w-full py-3.5 sm:py-4 px-6 bg-[#4a3b32] hover:bg-[#3d3028] text-[#fcfbf9] text-sm sm:text-base font-bold rounded-xl shadow-md shadow-[#4a3b32]/25 transition flex items-center justify-center gap-2"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
