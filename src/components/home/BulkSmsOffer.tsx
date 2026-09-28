"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
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
      className="w-[98%] 2xl:w-[98.5%] max-w-[1880px] mx-auto my-6 md:my-10 px-0"
    >
      {/* =================================================================== */}
      {/* Main Card Container: Soft off-white/cream with subtle vintage tone  */}
      {/* =================================================================== */}
      <div className="rounded-3xl p-8 md:p-12 lg:p-14 bg-[#faf9f6] border border-[#e7e1d7] shadow-2xl shadow-black/25 text-neutral-900 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
        {/* =============================================================== */}
        {/* Left Column: Text Content, Typography & Pill Buttons            */}
        {/* =============================================================== */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center">
          {/* Subtle Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-neutral-200/70 text-neutral-800 border border-neutral-300/70 shadow-2xs w-fit mb-5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span>Special Promotional Offer</span>
          </div>

          {/* Heading: Large, bold Bengali headline */}
          <h2
            id="bulk-sms-offer-title"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.15] mb-6"
          >
            ২৩ পয়সা প্রতি এসএমএস, আপনার ওটিপি মাত্র ২ সেকেন্ডে আপনার গ্রাহক পাবে।
          </h2>

          {/* Description: English/Bengali description */}
          <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-10 max-w-2xl font-normal">
            FelnaDMA provide reliable bulk SMS service with carrier-grade direct operator interconnects across Bangladesh. Deliver OTPs and transactional notifications in 2 seconds with 99.98% delivery success, automated recharge, and developer-friendly REST APIs.
          </p>

          {/* Buttons: Pill-Shaped Flex Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Primary Button: Solid dark espresso, pill-shaped with subtle hover lift */}
            <Link
              href={offer?.ctaUrl || "#packages"}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#201915] hover:bg-[#382b24] text-white font-bold text-sm sm:text-base rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>See packages</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            {/* Secondary Button: Transparent background, dark text, thin border, pill-shaped */}
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent hover:bg-neutral-100 text-neutral-900 font-semibold text-sm sm:text-base rounded-full border border-neutral-300 shadow-xs hover:border-neutral-400 active:scale-[0.98] transition-all duration-200"
            >
              <span>Request a call</span>
            </Link>
          </div>
        </div>

        {/* =============================================================== */}
        {/* Right Column: Promotional Banner Asset Integration              */}
        {/* =============================================================== */}
        <div className="lg:col-span-6 xl:col-span-5 relative w-full flex items-center justify-center">
          <div className="relative w-full aspect-[2952/1408] rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5 bg-[#f0eae1] transition-all duration-300 hover:shadow-black/25">
            {/* Local Next.js Image with fallback */}
            <Image
              src={imgSrc}
              alt="২৩ পয়সা প্রতি এসএমএস - FelnaDMA Special Promotional Offer"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
              onError={() => {
                // Fallback to high-res standard promotional banner if needed
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
