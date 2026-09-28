import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { BulkSmsOfferData } from "@/types/homepage";

export interface BulkSmsOfferProps {
  offer: BulkSmsOfferData | null;
}

export default function BulkSmsOffer({ offer }: BulkSmsOfferProps) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80";

  const displayImage = offer?.imageUrl || fallbackImage;

  return (
    <section
      id="services"
      aria-labelledby="bulk-sms-offer-title"
      className="w-[98%] 2xl:w-[98.5%] max-w-[1880px] mx-auto my-6 md:my-8 px-0"
    >
      {/* Card Container: Warm Off-White Cream Background that pops against dark canvas */}
      <div className="rounded-3xl p-8 md:p-12 bg-[#faf9f6] border border-[#d4ccc0] shadow-2xl text-neutral-900 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* =============================================================== */}
        {/* Left Column: Text, Feature Grid & Action Buttons (7 Cols)        */}
        {/* =============================================================== */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Top Badge: Sparkle Icon + Special Promotional Offer */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-neutral-200/60 text-neutral-800 border border-neutral-300/60 shadow-2xs w-fit mb-5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span>Special Promotional Offer</span>
          </div>

          {/* Main Heading: Large, Bold in Bengali as specified */}
          <h2
            id="bulk-sms-offer-title"
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 mb-4 leading-[1.2]"
          >
            ২৩ পয়সা প্রতি এসএমএস, আপনার ওটিপি মাত্র ২ সেকেন্ডে আপনার গ্রাহক পাবে।
          </h2>

          {/* Paragraph Description */}
          <p className="text-neutral-600 text-sm sm:text-base mb-8 leading-relaxed max-w-2xl font-normal">
            FelnaDMA provide reliable bulk SMS service with carrier-grade direct operator interconnects across Bangladesh. Deliver OTPs and transactional notifications in 2 seconds with 99.98% delivery success, automated recharge, and developer-friendly REST APIs.
          </p>

          {/* Features Grid (2x2) with checkmark icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 text-sm font-semibold text-neutral-800">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span>BTRC Approved Routes</span>
            </div>

            <div className="flex items-center gap-3 text-sm font-semibold text-neutral-800">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span>Fastest OTP Delivery</span>
            </div>

            <div className="flex items-center gap-3 text-sm font-semibold text-neutral-800">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span>Masking & Non-masking</span>
            </div>

            <div className="flex items-center gap-3 text-sm font-semibold text-neutral-800">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span>Real-Time DLR Status</span>
            </div>
          </div>

          {/* Buttons: Flex Row (Primary + Secondary) */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Primary Button: Dark Espresso/Black background with white text */}
            <Link
              href={offer?.ctaUrl || "/register"}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#201915] hover:bg-[#382b24] text-white font-bold text-sm rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Claim 23 Paisa Rate</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            {/* Secondary Button: White background with thin border */}
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-sm rounded-xl border border-neutral-300 shadow-xs transition-all hover:border-neutral-400 active:scale-[0.98]"
            >
              <span>Sign In to Account</span>
            </Link>
          </div>
        </div>

        {/* =============================================================== */}
        {/* Right Column: Visual Showcase & Floating Glassmorphism Card (5 Cols) */}
        {/* =============================================================== */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center">
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-neutral-200/80 bg-neutral-100">
            {/* Main Background Image */}
            <Image
              src={displayImage}
              alt={offer?.title || "Bulk SMS Promotional Offer"}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center transition-transform duration-500 hover:scale-105"
            />

            {/* Gradient Overlay for visual polish */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

            {/* Floating Glassmorphism Card at bottom */}
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-xl flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500">
                  GUARANTEED PRICING
                </div>
                <div className="text-sm sm:text-base font-extrabold text-neutral-900">
                  Starting at ৳0.23 / SMS
                </div>
              </div>

              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs whitespace-nowrap">
                NO HIDDEN FEES
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
