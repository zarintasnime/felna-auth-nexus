"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { GeoDivision, GeoDistrict, GeoUpazila } from "@/lib/data/bangladesh-geo";

export default function RegisterPage() {
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

  // Cascading Geo Data
  const [divisions, setDivisions] = useState<GeoDivision[]>([]);
  const [districts, setDistricts] = useState<GeoDistrict[]>([]);
  const [upazilas, setUpazilas] = useState<GeoUpazila[]>([]);
  const [loadingGeo, setLoadingGeo] = useState(false);

  // OTP State
  const [otp, setOtp] = useState("");
  const [normalizedPhone, setNormalizedPhone] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Status & Error Messages
  const [formError, setFormError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // ---------------------------------------------------------------------------
  // Geo Cascading Fetch
  // ---------------------------------------------------------------------------

  // 1. Fetch all Divisions on mount
  useEffect(() => {
    async function fetchDivisions() {
      try {
        setLoadingGeo(true);
        const res = await fetch("/api/geo/divisions");
        const json = await res.json();
        if (json.success) {
          setDivisions(json.data);
        }
      } catch (err) {
        console.error("Failed to load divisions", err);
      } finally {
        setLoadingGeo(false);
      }
    }
    fetchDivisions();
  }, []);

  // 2. Fetch Districts when Division changes
  useEffect(() => {
    if (!divisionId) {
      setDistricts([]);
      setDistrictId("");
      setUpazilas([]);
      setUpazilaId("");
      return;
    }

    async function fetchDistricts() {
      try {
        setLoadingGeo(true);
        const res = await fetch(`/api/geo/districts?divisionId=${encodeURIComponent(divisionId)}`);
        const json = await res.json();
        if (json.success) {
          setDistricts(json.data);
          setDistrictId("");
          setUpazilas([]);
          setUpazilaId("");
        }
      } catch (err) {
        console.error("Failed to load districts", err);
      } finally {
        setLoadingGeo(false);
      }
    }
    fetchDistricts();
  }, [divisionId]);

  // 3. Fetch Upazilas when District changes
  useEffect(() => {
    if (!districtId) {
      setUpazilas([]);
      setUpazilaId("");
      return;
    }

    async function fetchUpazilas() {
      try {
        setLoadingGeo(true);
        const res = await fetch(`/api/geo/upazilas?districtId=${encodeURIComponent(districtId)}`);
        const json = await res.json();
        if (json.success) {
          setUpazilas(json.data);
          setUpazilaId("");
        }
      } catch (err) {
        console.error("Failed to load upazilas", err);
      } finally {
        setLoadingGeo(false);
      }
    }
    fetchUpazilas();
  }, [districtId]);

  // ---------------------------------------------------------------------------
  // Cooldown Countdown Timer
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Form Submission
  // ---------------------------------------------------------------------------
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

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
          name,
          phone,
          email: email || undefined,
          divisionId,
          districtId,
          upazilaId,
          address,
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
      setCooldown(60);
      setCanResend(false);
    } catch (err) {
      console.error(err);
      setFormError("An unexpected network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ---------------------------------------------------------------------------
  // OTP Verification
  // ---------------------------------------------------------------------------
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setOtpError(null);

    if (otp.length !== 6) {
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
          otp,
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

  // ---------------------------------------------------------------------------
  // Resend OTP
  // ---------------------------------------------------------------------------
  async function handleResendOtp() {
    if (!canResend || isResending) return;
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

      setCooldown(60);
      setCanResend(false);
      setRemainingAttempts(null);
    } catch (err) {
      console.error(err);
      setOtpError("Failed to resend verification code. Please check your connection.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-8 py-6 text-white text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl mb-3 border border-blue-500/30">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Felma.com</h1>
          <p className="text-slate-400 text-sm mt-1">
            Secure User Registration & Dashboard System
          </p>
        </div>

        {/* Step 1: Registration Form */}
        {step === "form" && (
          <form onSubmit={handleRegister} className="p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-semibold text-slate-800">Create an Account</h2>
              <p className="text-sm text-slate-500 mt-1">
                Enter your details to register and verify your mobile number.
              </p>
            </div>

            {formError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahim Ahmed"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Phone & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Phone <span className="text-red-500">*</span>
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
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahim@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Bangladesh Geo Cascading Dropdowns */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Geographic Location (Bangladesh)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Division */}
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Division *</label>
                    <select
                      required
                      value={divisionId}
                      onChange={(e) => setDivisionId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Select Division</option>
                      {divisions.map((div) => (
                        <option key={div.id} value={div.id}>
                          {div.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">District *</label>
                    <select
                      required
                      disabled={!divisionId || loadingGeo}
                      value={districtId}
                      onChange={(e) => setDistrictId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:bg-slate-100"
                    >
                      <option value="">
                        {!divisionId ? "Select Division First" : "Select District"}
                      </option>
                      {districts.map((dist) => (
                        <option key={dist.id} value={dist.id}>
                          {dist.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Upazila / Thana */}
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Thana / Upazila *</label>
                    <select
                      required
                      disabled={!districtId || loadingGeo}
                      value={upazilaId}
                      onChange={(e) => setUpazilaId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:bg-slate-100"
                    >
                      <option value="">
                        {!districtId ? "Select District First" : "Select Thana / Upazila"}
                      </option>
                      {upazilas.map((upz) => (
                        <option key={upz.id} value={upz.id}>
                          {upz.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Permanent Address */}
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Permanent Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Street, Village, Ward"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 chars, 1 uppercase, 1 num"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Registration...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>

            <div className="text-center text-sm text-slate-500 pt-2 border-t border-slate-100">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification Screen */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-1">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Verify Your Mobile Number</h2>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                We sent a 6-digit verification code to{" "}
                <span className="font-semibold text-slate-800">{normalizedPhone}</span>.
              </p>
            </div>

            {otpError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                <div className="flex-1">
                  <span>{otpError}</span>
                  {typeof remainingAttempts === "number" && remainingAttempts > 0 && (
                    <div className="mt-1 font-semibold text-red-800">
                      Remaining attempts: {remainingAttempts}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 6-digit Code Input */}
            <div>
              <label className="block text-center text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Enter 6-Digit OTP Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isVerifying || otp.length !== 6}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <span>Verify & Activate Account</span>
              )}
            </button>

            {/* Cooldown & Resend Button */}
            <div className="flex flex-col items-center justify-center gap-2 pt-2 border-t border-slate-100 text-sm text-slate-500">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="inline-flex items-center gap-1.5 text-blue-600 font-medium hover:underline disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
                  <span>Resend Verification Code</span>
                </button>
              ) : (
                <span className="text-slate-400 text-xs">
                  Resend available in <span className="font-semibold text-slate-600">{cooldown}s</span>
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setFormError(null);
                  setOtpError(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-600 underline mt-1"
              >
                Change registration details
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success Screen */}
        {step === "success" && (
          <div className="p-8 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Account Verified & Active!</h2>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Your mobile phone has been successfully verified. Your account is now active and ready
                to use.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1.5 text-slate-600">
              <div>
                <span className="font-semibold text-slate-700">Name:</span> {name}
              </div>
              <div>
                <span className="font-semibold text-slate-700">Phone:</span> {normalizedPhone}
              </div>
              <div>
                <span className="font-semibold text-slate-700">Status:</span>{" "}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-800">
                  ACTIVE
                </span>
              </div>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition"
            >
              Proceed to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
