import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { BulkSmsOfferData } from "@/types/homepage";

export interface BulkSmsOfferProps {
  offer: BulkSmsOfferData | null;
}

export default function BulkSmsOffer({ offer }: BulkSmsOfferProps) {
  if (!offer) return null;

  return (
    <section
      id="services"
      aria-labelledby="bulk-sms-offer-title"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#d4ccc0] bg-[#f4f0e6]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main 2-Column Responsive Card Container */}
        <div className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-[#fcfbf9] border border-[#d4ccc0] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* =============================================================== */}
          {/* Left Column: Offer Details & CTAs (7 Cols)                      */}
          {/* =============================================================== */}
          <div className="lg:col-span-7 space-y-6">
            {/* Promotional Badge */}
            {offer.badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#ebe5da] text-[#4a3b32] border border-[#d4ccc0] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#4a3b32]" />
                <span>{offer.badge}</span>
              </div>
            )}

            {/* Headline */}
            <h2
              id="bulk-sms-offer-title"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#4a3b32] leading-tight"
            >
              {offer.title}
            </h2>

            {/* Formatted Description */}
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
              {offer.description}
            </p>

            {/* Key Value Prop Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-[#4a3b32] shrink-0" />
                <span>Direct Tier-1 Telecom Interconnects</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-[#4a3b32] shrink-0" />
                <span>Real-Time Operator DLR Status</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-stone-700">
                <ShieldCheck className="w-4 h-4 text-[#4a3b32] shrink-0" />
                <span>BTRC Approved Masking Routes</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-stone-700">
                <Zap className="w-4 h-4 text-[#4a3b32] shrink-0" />
                <span>Instant Phone Normalization (+880)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              <Link
                href={offer.ctaUrl || "/register"}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#4a3b32] hover:bg-[#3d3028] text-[#fcfbf9] font-bold text-sm rounded-xl shadow-md shadow-[#4a3b32]/25 transition hover:scale-[1.01]"
              >
                <span>{offer.ctaText || "Claim 23 Paisa Rate"}</span>
                <ArrowRight className="w-4 h-4 text-[#fcfbf9]" />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-transparent hover:bg-[#ebe5da]/70 text-[#4a3b32] font-semibold text-sm rounded-xl border border-[#d4ccc0] transition"
              >
                <span>Sign In to Account</span>
              </Link>
            </div>
          </div>

          {/* =============================================================== */}
          {/* Right Column: Promotional Visual Asset (5 Cols)                  */}
          {/* =============================================================== */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#d4ccc0] shadow-sm bg-[#ebe5da]">
              <Image
                src={offer.imageUrl}
                alt={offer.title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-500 hover:scale-105"
              />

              {/* Subtle Gradient Shade */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#201915]/60 via-transparent to-transparent" />

              {/* Floating Highlight Pill */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#fcfbf9]/95 backdrop-blur-md border border-[#d4ccc0] shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Guaranteed Pricing
                  </div>
                  <div className="text-sm font-extrabold text-[#4a3b32]">
                    Starting at ৳0.23 / SMS
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ebe5da] text-[#4a3b32] border border-[#d4ccc0]">
                  NO HIDDEN FEES
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
