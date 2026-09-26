"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { GeoDivision, GeoDistrict, GeoUpazila } from "@/lib/data/bangladesh-geo";

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

  // 1. Fetch Divisions on mount
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

  // 4. Cooldown timer for OTP
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

    // Strict Email Requirement Validation
    if (!email || !email.trim()) {
      setFormError("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError("Please provide a valid email address.");
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
          name,
          phone,
          email: email.trim(),
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

  // OTP Verification
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

  // Resend OTP
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
    <div className="space-y-5">
      {/* =================================================================== */}
      {/* Step 1: Registration Form */}
      {/* =================================================================== */}
      {step === "form" && (
        <form onSubmit={handleRegister} className="space-y-4">
          {formError && (
            <div className="p-3 bg-[#fbeae8] border border-[#e8b5af] rounded-xl flex items-start gap-2.5 text-[#7a271a] text-xs shadow-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#7a271a]" />
              <span>{formError}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Full Name <span className="text-[#991b1b]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] focus:bg-[#fcfbf9] transition"
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Mobile Phone <span className="text-[#991b1b]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] focus:bg-[#fcfbf9] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Email <span className="text-[#991b1b]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] focus:bg-[#fcfbf9] transition"
                />
              </div>
            </div>
          </div>

          {/* Bangladesh Geo Cascading Dropdowns */}
          <div className="bg-[#f5efe6] p-3.5 rounded-xl border border-[#d4ccc0] space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#4a3b32]" />
              <span>Location in Bangladesh</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-stone-600 mb-1">Division *</label>
                <select
                  required
                  value={divisionId}
                  onChange={(e) => setDivisionId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#ebe5da] border border-[#d4ccc0] rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32]"
                >
                  <option value="">Select Division</option>
                  {divisions.map((div) => (
                    <option key={div.id} value={div.id}>
                      {div.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 mb-1">District *</label>
                <select
                  required
                  disabled={!divisionId || loadingGeo}
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#ebe5da] border border-[#d4ccc0] rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] disabled:opacity-50 disabled:bg-[#e4ddd2]"
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

              <div>
                <label className="block text-[11px] text-stone-600 mb-1">Thana / Upazila *</label>
                <select
                  required
                  disabled={!districtId || loadingGeo}
                  value={upazilaId}
                  onChange={(e) => setUpazilaId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#ebe5da] border border-[#d4ccc0] rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] disabled:opacity-50 disabled:bg-[#e4ddd2]"
                >
                  <option value="">
                    {!districtId ? "Select District First" : "Select Thana"}
                  </option>
                  {upazilas.map((upz) => (
                    <option key={upz.id} value={upz.id}>
                      {upz.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-stone-600 mb-1">Permanent Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House/Road, Area, Ward"
                className="w-full px-2.5 py-1.5 bg-[#ebe5da] border border-[#d4ccc0] rounded-lg text-xs text-stone-800 placeholder:text-stone-500/70 focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32]"
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
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
                  placeholder="....."
                  className="w-full pl-10 pr-9 py-2 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-xs text-stone-800 placeholder:text-base placeholder:font-bold placeholder:tracking-widest placeholder:text-stone-500/80 focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] focus:bg-[#fcfbf9] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-500 hover:text-stone-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
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
                  placeholder="....."
                  className="w-full pl-10 pr-9 py-2 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-xs text-stone-800 placeholder:text-base placeholder:font-bold placeholder:tracking-widest placeholder:text-stone-500/80 focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] focus:bg-[#fcfbf9] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-500 hover:text-stone-700 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Deep Dark Brown Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-[#4a3b32] hover:bg-[#3d3028] text-[#fcfbf9] font-semibold rounded-xl shadow-sm shadow-[#4a3b32]/25 focus:outline-none focus:ring-2 focus:ring-[#4a3b32] focus:ring-offset-2 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#fcfbf9]" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          <div className="text-center text-xs text-stone-600 pt-2 border-t border-[#e5ded4]">
            Already have an account?{" "}
            {onSwitchToLogin ? (
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-[#4a3b32] font-semibold hover:underline"
              >
                Sign in
              </button>
            ) : (
              <Link href="/login" className="text-[#4a3b32] font-semibold hover:underline">
                Sign in
              </Link>
            )}
          </div>
        </form>
      )}

      {/* =================================================================== */}
      {/* Step 2: OTP Verification Screen */}
      {/* =================================================================== */}
      {step === "otp" && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold text-stone-800">Verify Mobile Number</h3>
            <p className="text-xs text-stone-600">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-stone-800">{normalizedPhone}</span>
            </p>
          </div>

          {otpError && (
            <div className="p-3 bg-[#fbeae8] border border-[#e8b5af] rounded-xl flex items-start gap-2 text-[#7a271a] text-xs shadow-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#7a271a]" />
              <div className="flex-1">
                <span>{otpError}</span>
                {typeof remainingAttempts === "number" && remainingAttempts > 0 && (
                  <div className="mt-2 p-1.5 bg-[#fef8e7] border border-[#ecd99d] rounded-lg font-semibold text-[#6d5008] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-[#6d5008]" />
                    <span>Remaining attempts: {remainingAttempts}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              className="w-full text-center text-2xl tracking-[0.4em] font-mono py-2.5 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] focus:bg-[#fcfbf9] transition text-stone-800"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying || otp.length !== 6}
            className="w-full py-3 px-4 bg-[#4a3b32] hover:bg-[#3d3028] text-[#fcfbf9] font-semibold rounded-xl shadow-sm shadow-[#4a3b32]/25 focus:outline-none focus:ring-2 focus:ring-[#4a3b32] transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#fcfbf9]" />
                <span>Activating Account...</span>
              </>
            ) : (
              <span>Verify & Activate Account</span>
            )}
          </button>

          <div className="flex items-center justify-between pt-2 border-t border-[#e5ded4] text-xs text-stone-600">
            <button
              type="button"
              onClick={() => {
                setStep("form");
                setFormError(null);
                setOtpError(null);
              }}
              className="text-stone-600 hover:text-stone-800 underline"
            >
              Edit details
            </button>

            {canResend ? (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="inline-flex items-center gap-1 text-[#4a3b32] font-semibold hover:underline disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isResending ? "animate-spin" : ""}`} />
                <span>Resend Code</span>
              </button>
            ) : (
              <span className="text-stone-500">
                Resend in <span className="font-semibold text-stone-700">{cooldown}s</span>
              </span>
            )}
          </div>
        </form>
      )}

      {/* =================================================================== */}
      {/* Step 3: Success Screen */}
      {/* =================================================================== */}
      {step === "success" && (
        <div className="text-center space-y-4 py-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#edf5ee] text-[#215428] rounded-full shadow-xs border border-[#b8dcbc]">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-800">Account Verified & Active!</h3>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              Welcome to Felna. Your mobile phone and email have been verified and your account is active.
            </p>
          </div>

          <div className="p-3.5 bg-[#f5efe6] border border-[#d4ccc0] rounded-xl text-left text-xs space-y-1 text-stone-700">
            <div>
              <span className="font-semibold text-stone-800">Name:</span> {name}
            </div>
            <div>
              <span className="font-semibold text-stone-800">Phone:</span> {normalizedPhone}
            </div>
            <div>
              <span className="font-semibold text-stone-800">Email:</span> {email}
            </div>
          </div>

          {onSwitchToLogin ? (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="w-full py-2.5 px-4 bg-[#4a3b32] hover:bg-[#3d3028] text-[#fcfbf9] text-xs font-semibold rounded-xl shadow-sm shadow-[#4a3b32]/25 transition flex items-center justify-center gap-2"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href="/login"
              className="w-full py-2.5 px-4 bg-[#4a3b32] hover:bg-[#3d3028] text-[#fcfbf9] text-xs font-semibold rounded-xl shadow-sm shadow-[#4a3b32]/25 transition flex items-center justify-center gap-2"
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
