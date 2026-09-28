"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { BulkSmsOfferData } from "@/types/homepage";

export interface BulkSmsOfferProps {
  offer: BulkSmsOfferData | null;
}

export default function BulkSmsOffer({ offer }: BulkSmsOfferProps) {
  const [imgSrc, setImgSrc] = useState<string>("/images/Offer_Image.jpg");

  return (
    <section
      id="services"
      aria-labelledby="bulk-sms-offer-title"
      className="w-full my-6 md:my-12 px-0"
    >
      {/* =================================================================== */}
      {/* Main Card Container: Expansive w-[96%] xl:max-w-[1400px] Harmony   */}
      {/* =================================================================== */}
      <div className="w-[96%] xl:max-w-[1400px] mx-auto rounded-3xl bg-[#faf9f6] border border-[#e7e1d7] shadow-2xl shadow-black/20 text-neutral-900 p-8 md:p-12 lg:p-14">
        {/* ================================================================= */}
        {/* 2-Column Responsive Grid (50 / 50 split) with Healthy Gap         */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* =============================================================== */}
          {/* Left Column (Text Content, Features & Actions)                  */}
          {/* =============================================================== */}
          <div className="flex flex-col justify-center">
            {/* Top Badge: Sparkle Icon + Pill Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-neutral-200/70 text-neutral-800 border border-neutral-300/70 shadow-2xs w-fit mb-5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span>Special Promotional Offer</span>
            </div>

            {/* Heading: High-impact typography with natural Bengali line-wrap */}
            <h2
              id="bulk-sms-offer-title"
              className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-neutral-900 leading-snug mb-4 max-w-lg"
            >
              ২৩ পয়সা প্রতি এসএমএস, আপনার ওটিপি মাত্র ২ সেকেন্ডে আপনার গ্রাহক পাবে।
            </h2>

            {/* Description: Readable text constrained to max-w-lg */}
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-6 max-w-lg font-normal">
              FelnaDMA provide reliable bulk SMS service with carrier-grade direct operator interconnects across Bangladesh. Deliver OTPs and transactional notifications in 2 seconds with 99.98% delivery success, automated recharge, and developer-friendly REST APIs.
            </p>

            {/* 2x2 Checkmark Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8 max-w-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60 shadow-2xs">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-neutral-800">BTRC Approved</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60 shadow-2xs">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-neutral-800">Fastest OTP</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60 shadow-2xs">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-neutral-800">Masking Route</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60 shadow-2xs">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-neutral-800">API Support</span>
              </div>
            </div>

            {/* Buttons: Fully rounded pill-shaped actions */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Primary Button */}
              <Link
                href={offer?.ctaUrl || "#packages"}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#201915] hover:bg-[#382b24] text-white font-bold text-xs sm:text-sm rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <span>See packages</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>

              {/* Secondary Button */}
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-transparent hover:bg-neutral-100 text-neutral-900 font-semibold text-xs sm:text-sm rounded-full border border-neutral-300 shadow-xs hover:border-neutral-400 active:scale-[0.98] transition-all duration-200"
              >
                <span>Request a call</span>
              </Link>
            </div>
          </div>

          {/* =============================================================== */}
          {/* Right Column: Natural Scaling Image (100% Uncropped)            */}
          {/* =============================================================== */}
          <div className="relative w-full flex items-center justify-center">
            <Image
              src={imgSrc}
              alt="২৩ পয়সা প্রতি এসএমএস - FelnaDMA Special Promotional Offer"
              width={2952}
              height={1408}
              priority
              className="w-full h-auto rounded-2xl shadow-xl ring-1 ring-black/5 transition-transform duration-500 hover:scale-[1.01]"
              onError={() => {
                setImgSrc(
                  offer?.imageUrl ||
                    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80"
                );
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
