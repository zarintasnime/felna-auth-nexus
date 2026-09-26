"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Phone,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
  Edit2,
} from "lucide-react";

export interface OtpVerificationSectionProps {
  phone: string;
  normalizedPhone: string;
  cooldown: number; // In seconds
  isVerifying: boolean;
  isResending: boolean;
  otpError: string | null;
  remainingAttempts: number | null;
  onVerify: (otp: string) => Promise<void> | void;
  onResend: () => Promise<void> | void;
  onChangePhone: () => void;
  onOtpChange?: (otp: string) => void;
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
  verifyingButtonText?: string;
}

export default function OtpVerificationSection({
  phone,
  normalizedPhone,
  cooldown,
  isVerifying,
  isResending,
  otpError,
  remainingAttempts,
  onVerify,
  onResend,
  onChangePhone,
  onOtpChange,
  title = "Verify Mobile Number",
  subtitle,
  submitButtonText = "Verify & Activate Account",
  verifyingButtonText = "Activating Account...",
}: OtpVerificationSectionProps) {
  // 6-digit slots state
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [isShake, setIsShake] = useState(false);
  const [resendNotification, setResendNotification] = useState<string | null>(null);

  // Input refs for automatic focus manipulation
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const isExpired = cooldown === 0;
  const isLocked = remainingAttempts === 0;
  const fullOtp = digits.join("");
  const isComplete = fullOtp.length === 6 && /^\d{6}$/.test(fullOtp);

  // Auto-focus first empty slot or slot 0 on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Trigger shake animation on new error
  useEffect(() => {
    if (otpError) {
      setIsShake(true);
      const timer = setTimeout(() => setIsShake(false), 400);
      return () => clearTimeout(timer);
    }
  }, [otpError]);

  // Handle single digit change
  function handleDigitChange(index: number, val: string) {
    // Only accept numeric input
    const cleanVal = val.replace(/\D/g, "");

    setResendNotification(null);

    // If multiple digits were pasted directly into this input
    if (cleanVal.length > 1) {
      handlePastedDigits(cleanVal, index);
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = cleanVal;
    setDigits(nextDigits);

    const newFull = nextDigits.join("");
    if (onOtpChange) {
      onOtpChange(newFull);
    }

    // Auto-advance to next input if digit entered
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  }

  // Handle paste across slots
  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>, startIndex: number) {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const cleanNumbers = pasteData.replace(/\D/g, "");
    if (!cleanNumbers) return;

    handlePastedDigits(cleanNumbers, startIndex);
  }

  function handlePastedDigits(cleanNumbers: string, startIndex: number = 0) {
    setResendNotification(null);
    const nextDigits = [...digits];

    // If pasted string is 6 digits or longer, always fill from index 0
    const start = cleanNumbers.length >= 6 ? 0 : startIndex;

    for (let i = 0; i < cleanNumbers.length && start + i < 6; i++) {
      nextDigits[start + i] = cleanNumbers[i];
    }

    setDigits(nextDigits);

    const newFull = nextDigits.join("");
    if (onOtpChange) {
      onOtpChange(newFull);
    }

    // Focus last filled index or next available slot
    const targetFocusIndex = Math.min(5, start + cleanNumbers.length);
    inputRefs.current[targetFocusIndex]?.focus();
  }

  // Handle keydown navigation (Backspace, Arrow keys)
  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // If current slot is empty, backspace moves to previous slot and clears it
        e.preventDefault();
        const nextDigits = [...digits];
        nextDigits[index - 1] = "";
        setDigits(nextDigits);
        if (onOtpChange) onOtpChange(nextDigits.join(""));
        inputRefs.current[index - 1]?.focus();
      } else if (digits[index]) {
        // Clear current slot
        const nextDigits = [...digits];
        nextDigits[index] = "";
        setDigits(nextDigits);
        if (onOtpChange) onOtpChange(nextDigits.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      inputRefs.current[index - 1]?.select();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  }

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isComplete || isVerifying || isExpired || isLocked) return;
    await onVerify(fullOtp);
  }

  // Handle single resend trigger
  async function handleSingleResend() {
    if (isResending || (!isExpired && !isLocked && cooldown > 0)) return;
    setResendNotification(null);
    setDigits(["", "", "", "", "", ""]);
    if (onOtpChange) onOtpChange("");

    await onResend();

    setResendNotification("A fresh 6-digit verification code has been dispatched.");
    // Auto-focus first input slot
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ------------------------------------------------------------------ */}
      {/* 1. Header with Phone & Change Number Action                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ebe5da] text-[#4a3b32] border border-[#d4ccc0] shadow-xs mb-1">
          <ShieldCheck className="w-6 h-6 text-[#4a3b32]" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-stone-800 tracking-tight">{title}</h3>
        <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
          {subtitle || (
            <>
              We dispatched a 6-digit verification code via SMS to{" "}
              <span className="font-semibold text-stone-800 font-mono tracking-tight">
                {normalizedPhone || phone}
              </span>
            </>
          )}
        </p>
        <div className="pt-1">
          <button
            type="button"
            onClick={onChangePhone}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ebe5da] hover:bg-[#e4ddd2] text-[#4a3b32] text-xs font-semibold rounded-xl border border-[#d4ccc0] transition shadow-2xs cursor-pointer group"
          >
            <Phone className="w-3.5 h-3.5 text-[#4a3b32] group-hover:scale-105 transition-transform" />
            <span>Change mobile number</span>
            <Edit2 className="w-3 h-3 text-stone-500" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Success Banner (e.g. after Resend)                              */}
      {/* ------------------------------------------------------------------ */}
      {resendNotification && (
        <div
          role="status"
          className="p-3.5 bg-[#edf5ee] border border-[#b8dcbc] rounded-2xl flex items-center gap-2.5 text-[#215428] text-xs sm:text-sm shadow-xs animate-in fade-in duration-200"
        >
          <CheckCircle className="w-4 h-4 text-[#215428] flex-shrink-0" />
          <span className="font-medium">{resendNotification}</span>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 3. Expired Notice (Informational only - NO DUPLICATE BUTTON!)       */}
      {/* ------------------------------------------------------------------ */}
      {isExpired && !isLocked && (
        <div
          role="alert"
          className="p-3.5 bg-[#fef8e7] border border-[#ecd99d] rounded-2xl flex items-center justify-between gap-3 text-[#6d5008] text-xs sm:text-sm shadow-xs animate-in fade-in duration-200"
        >
          <div className="flex items-center gap-2 font-medium">
            <Clock className="w-4 h-4 text-[#6d5008] flex-shrink-0" />
            <span>Verification code expired. Request a new code below.</span>
          </div>
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#6d5008] bg-[#f9ecc7] px-2 py-0.5 rounded-md">
            Expired
          </span>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. Fault / Invalid OTP & Lockout Alert                             */}
      {/* ------------------------------------------------------------------ */}
      {otpError && (
        <div
          role="alert"
          className="p-4 bg-[#fbeae8] border border-[#e8b5af] rounded-2xl flex items-start gap-3 text-[#7a271a] text-xs sm:text-sm shadow-xs animate-in fade-in duration-200"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#7a271a]" />
          <div className="flex-1 space-y-1.5">
            <span className="font-medium leading-snug block">{otpError}</span>
            {typeof remainingAttempts === "number" && remainingAttempts > 0 && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#fef8e7] border border-[#ecd99d] rounded-lg font-semibold text-[#6d5008] text-xs">
                <AlertCircle className="w-3.5 h-3.5 text-[#6d5008]" />
                <span>
                  {remainingAttempts} {remainingAttempts === 1 ? "attempt" : "attempts"} remaining
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. 6-Box Segmented OTP Input                                       */}
      {/* ------------------------------------------------------------------ */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-center text-xs font-semibold text-stone-700 uppercase tracking-wider mb-3">
            Enter 6-Digit Verification Code
          </label>

          <div
            role="group"
            aria-label="OTP verification code"
            className={`flex items-center justify-center gap-2 sm:gap-3 ${isShake ? "animate-shake" : ""}`}
          >
            {digits.map((digit, index) => {
              const isSlotError = Boolean(otpError);
              return (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  disabled={isVerifying || isLocked}
                  aria-label={`Digit ${index + 1} of 6`}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onPaste={(e) => handlePaste(e, index)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={(e) => e.target.select()}
                  className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl border transition-all duration-150 outline-none ${
                    isSlotError
                      ? "border-red-400 bg-red-50/40 text-red-900 ring-2 ring-red-400/20"
                      : isExpired
                      ? "border-[#d4ccc0] bg-[#f0eae1] text-stone-500 opacity-80"
                      : digit
                      ? "border-[#4a3b32] bg-[#fcfbf9] text-stone-900 ring-2 ring-[#4a3b32]/10"
                      : "border-[#d4ccc0] bg-[#ebe5da] text-stone-800 hover:border-stone-400 focus:bg-[#fcfbf9] focus:border-[#4a3b32] focus:ring-2 focus:ring-[#4a3b32]/15"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* 6. Status, Timer & THE SINGLE RESEND CONTROL (Best UX Practice)  */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-3 pt-1">
          {/* Visual Countdown Row */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-stone-600">
            <Clock className="w-4 h-4 text-stone-500" />
            <span>Time Remaining:</span>
            <span
              className={`font-mono font-bold px-2.5 py-0.5 rounded-lg text-xs sm:text-sm border tracking-wider transition-colors ${
                isExpired
                  ? "text-red-700 bg-red-50 border-red-200 font-bold"
                  : "text-[#4a3b32] bg-[#f5efe6] border-[#d4ccc0]"
              }`}
            >
              {formatTime(cooldown)}
            </span>
          </div>

          {/* THE SINGLE DEDICATED RESEND BUTTON */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleSingleResend}
              disabled={isResending || (!isExpired && !isLocked && cooldown > 0)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isResending
                  ? "bg-[#ebe5da] text-[#4a3b32] cursor-wait opacity-80"
                  : isExpired || isLocked
                  ? "bg-[#4a3b32] hover:bg-[#3d3028] text-[#fcfbf9] shadow-sm shadow-[#4a3b32]/20 cursor-pointer font-bold animate-in fade-in"
                  : "text-stone-400 bg-transparent cursor-not-allowed opacity-60"
              }`}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isResending ? "animate-spin text-[#4a3b32]" : ""}`}
              />
              {isResending ? (
                <span>Sending new verification code...</span>
              ) : isExpired || isLocked ? (
                <span>Resend Verification Code</span>
              ) : (
                <span>
                  Resend code in <span className="font-mono">{formatTime(cooldown)}</span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* 7. Primary Action Button ("Verify & Activate Account")           */}
        {/* ---------------------------------------------------------------- */}
        <button
          type="submit"
          disabled={isVerifying || !isComplete || isExpired || isLocked}
          className={`w-full py-3.5 sm:py-4 px-6 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 shadow-md ${
            isComplete && !isExpired && !isLocked && !isVerifying
              ? "bg-[#4a3b32] hover:bg-[#3d3028] text-[#fcfbf9] shadow-[#4a3b32]/25 cursor-pointer hover:shadow-lg focus:ring-2 focus:ring-[#4a3b32]"
              : "bg-[#7c6a5e] text-[#fcfbf9]/70 cursor-not-allowed opacity-60"
          }`}
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-[#fcfbf9]" />
              <span>{verifyingButtonText}</span>
            </>
          ) : (
            <>
              <span>{submitButtonText}</span>
              <ArrowRight className="w-4 h-4 text-[#fcfbf9]" />
            </>
          )}
        </button>

        {/* ---------------------------------------------------------------- */}
        {/* 8. Secondary Details Back Link                                   */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex items-center justify-between pt-3 border-t border-[#e5ded4] text-xs sm:text-sm text-stone-600">
          <button
            type="button"
            onClick={onChangePhone}
            className="text-[#4a3b32] hover:text-[#3d3028] font-bold underline cursor-pointer"
          >
            Change registration details
          </button>

          <span className="text-[11px] text-stone-500">
            SMS dispatched via Felna Gateway
          </span>
        </div>
      </form>
    </div>
  );
}
