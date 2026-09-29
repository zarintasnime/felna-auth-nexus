"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Phone,
  ArrowRight,
  Zap,
  ShieldCheck,
  CheckCheck,
  Wifi,
  Signal,
} from "lucide-react";
import { BulkSmsOfferData } from "@/types/homepage";

export interface BulkSmsOfferProps {
  offer: BulkSmsOfferData | null;
}

export default function BulkSmsOffer({ offer }: BulkSmsOfferProps) {
  return (
    <section
      id="services"
      aria-labelledby="bulk-sms-offer-title"
      className="relative w-full py-24 md:py-32 px-4 sm:px-6 overflow-hidden scroll-mt-20"
    >
      <span id="pricing" className="absolute -top-24 block invisible pointer-events-none" aria-hidden="true" />
      {/* Background Faint Dotted Grid Texture to ground the section */}
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
        aria-hidden="true"
      />

      {/* =================================================================== */}
      {/* Premium Dark Card Wrapper                                           */}
      {/* =================================================================== */}
      <div className="w-full max-w-[1200px] mx-auto bg-[#1B1815] border border-[#F5B83D]/30 rounded-[24px] overflow-hidden p-8 md:p-12 lg:p-[48px] relative shadow-2xl shadow-black/80">
        {/* Soft Radial Amber Glow in the Top-Left Corner */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 bg-[#F5B83D]/10 rounded-full blur-[80px] pointer-events-none"
          aria-hidden="true"
        />

        {/* 2-Column Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center relative z-10">
          
          {/* =============================================================== */}
          {/* Left Column: Text & Hierarchy (Price as Hero)                   */}
          {/* =============================================================== */}
          <div className="w-full lg:col-span-7 flex flex-col justify-center">
            {/* Badge: Pill shape with pulsing amber dot */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full text-sm font-medium bg-[#F5B83D]/10 text-[#F5B83D] border border-[#F5B83D]/20 mb-6 w-fit shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5B83D] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F5B83D]" />
              </span>
              <span>Special Promotional Offer</span>
            </div>

            {/* Headline: Price as Hero (Two distinct lines) */}
            <h2
              id="bulk-sms-offer-title"
              className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-[1.18]"
            >
              <span className="text-[#F5B83D] block mb-2">
                ২৩ পয়সা প্রতি এসএমএস
              </span>
              <span className="text-white block text-2xl sm:text-3xl lg:text-[32px] font-bold leading-snug">
                আপনার ওটিপি মাত্র ২ সেকেন্ডে আপনার গ্রাহক পাবে।
              </span>
            </h2>

            {/* Paragraph: Styled & brand standardized */}
            <p className="text-[16px] md:text-[17px] text-[#B9B0A5] leading-relaxed max-w-[65ch] mt-4 font-normal">
              Felna.com provides reliable bulk SMS services with carrier-grade direct operator interconnects across Bangladesh. Deliver OTPs and transactional notifications in 2 seconds with ২৩ পয়সা lowest rates, 99.98% delivery success, automated recharge, and developer-friendly REST APIs.
            </p>

            {/* Checklist Chips: 2x2 Grid with Amber Icons and Pill Styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-8">
              <div className="rounded-full border border-white/10 px-4 py-2.5 bg-white/5 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5B83D] shrink-0" />
                <span className="text-sm font-medium text-neutral-200">BTRC Approved</span>
              </div>

              <div className="rounded-full border border-white/10 px-4 py-2.5 bg-white/5 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5B83D] shrink-0" />
                <span className="text-sm font-medium text-neutral-200">2s Instant OTP</span>
              </div>

              <div className="rounded-full border border-white/10 px-4 py-2.5 bg-white/5 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5B83D] shrink-0" />
                <span className="text-sm font-medium text-neutral-200">Masking & Non-Masking</span>
              </div>

              <div className="rounded-full border border-white/10 px-4 py-2.5 bg-white/5 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5B83D] shrink-0" />
                <span className="text-sm font-medium text-neutral-200">Real-time Operator DLR</span>
              </div>
            </div>

            {/* CTAs (52px height) */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              {/* Primary: Solid Amber Button */}
              <Link
                href={offer?.ctaUrl || "/register"}
                className="bg-[#F5B83D] hover:bg-[#e5aa32] text-black font-semibold h-[52px] px-8 rounded-full inline-flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-[#F5B83D]/20 active:scale-[0.98]"
              >
                <span>See packages</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>

              {/* Secondary: Ghost Button with Phone Icon */}
              <a
                href="tel:+8801977771234"
                className="border border-white/20 hover:border-white/40 hover:bg-white/5 text-white h-[52px] px-8 rounded-full inline-flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98]"
              >
                <Phone className="w-4 h-4 text-[#F5B83D]" />
                <span>Request a call</span>
              </a>
            </div>
          </div>

          {/* =============================================================== */}
          {/* Right Column: Sleek Smartphone Mockup & Floating Glass Chips    */}
          {/* =============================================================== */}
          <div className="w-full lg:col-span-5 flex items-center justify-center py-6 lg:py-0">
            <div className="relative">
              {/* Floating Glass Chip 1: Top Left */}
              <div className="absolute top-10 -left-4 sm:-left-8 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-white text-sm shadow-xl flex items-center gap-2 z-20 whitespace-nowrap">
                <Zap className="w-4 h-4 text-[#F5B83D]" />
                <span>Delivered in 2s ✓</span>
              </div>

              {/* Floating Glass Chip 2: Center Right */}
              <div className="absolute top-1/2 -right-4 sm:-right-8 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-[#F5B83D]/40 px-4 py-2 rounded-xl text-white text-sm shadow-xl flex items-center gap-2 z-20 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5B83D] animate-pulse" />
                <span className="font-bold text-[#F5B83D]">৳0.23</span>
                <span className="text-neutral-300 text-xs">/ SMS</span>
              </div>

              {/* Floating Glass Chip 3: Bottom Left */}
              <div className="absolute bottom-10 -left-3 sm:-left-6 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-white text-sm shadow-xl flex items-center gap-2 z-20 whitespace-nowrap">
                <ShieldCheck className="w-4 h-4 text-[#F5B83D]" />
                <span>BTRC Approved</span>
              </div>

              {/* Smartphone Frame */}
              <div className="w-[280px] h-[550px] mx-auto bg-[#12100E] border-[6px] border-neutral-800 rounded-[2.5rem] relative overflow-hidden shadow-2xl flex flex-col justify-between p-4">
                {/* Notch / Dynamic Island */}
                <div className="w-24 h-4 bg-neutral-900 rounded-full mx-auto mt-1 mb-2 shrink-0 border border-neutral-800/80" />

                {/* Status Bar */}
                <div className="flex items-center justify-between text-[11px] font-medium text-neutral-400 px-3 pb-3 border-b border-neutral-800/80 shrink-0">
                  <span>09:41</span>
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <Signal className="w-3 h-3" />
                    <Wifi className="w-3 h-3" />
                    <div className="w-4 h-2 border border-neutral-400 rounded-xs relative flex items-center p-0.5">
                      <div className="w-2 h-1 bg-neutral-300 rounded-2xs" />
                    </div>
                  </div>
                </div>

                {/* Sender ID Bar */}
                <div className="flex items-center gap-2.5 py-3 border-b border-neutral-800/60 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#24201C] border border-[#F5B83D]/30 flex items-center justify-center text-[#F5B83D] font-bold text-xs">
                    F
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white">Felna.com</span>
                      <CheckCircle2 className="w-3 h-3 text-[#F5B83D]" />
                    </div>
                    <span className="text-[10px] text-neutral-400">Verified Sender ID</span>
                  </div>
                </div>

                {/* Chat Message Content */}
                <div className="flex-1 py-4 flex flex-col justify-center space-y-3">
                  <div className="text-[10px] text-neutral-500 mx-auto px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 w-fit">
                    Today 10:24 AM
                  </div>

                  {/* OTP Message Bubble */}
                  <div className="bg-neutral-800 text-white p-4 rounded-2xl rounded-tl-sm border border-neutral-700/60 shadow-lg space-y-2">
                    <p className="text-xs text-neutral-300">
                      Your <span className="font-semibold text-white">Felna.com</span> OTP is:
                    </p>
                    <div className="py-1 px-3 bg-neutral-900/90 rounded-lg border border-[#F5B83D]/30 flex items-center justify-between">
                      <span className="text-xl font-mono font-extrabold tracking-widest text-[#F5B83D]">
                        482915
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-medium">
                        Valid 3m
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-tight">
                      Valid for 3 minutes. Do not share this code with anyone.
                    </p>
                    <div className="flex items-center justify-end gap-1 text-[9px] text-neutral-500 pt-0.5">
                      <span>10:24 AM</span>
                      <CheckCheck className="w-3.5 h-3.5 text-[#F5B83D]" />
                    </div>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="w-28 h-1 bg-neutral-700 rounded-full mx-auto mt-2 shrink-0" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
