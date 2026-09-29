import React from "react";

/**
 * Skeleton for Hero Slider - Matches exact dimensions (h-[460px] sm:h-[520px] lg:h-[560px]) to prevent CLS.
 */
export function HeroSliderSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full h-[460px] sm:h-[520px] lg:h-[560px] overflow-hidden bg-[#2a221d] animate-pulse flex flex-col justify-center"
    >
      <div className="w-full max-w-[1880px] mx-auto px-12 sm:px-16 md:px-20 lg:px-24 xl:px-28 2xl:px-32 space-y-5">
        {/* Badge Skeleton */}
        <div className="w-36 h-7 rounded-full bg-[#4a3b32]/80 border border-[#7c6a5e]/40" />

        {/* Title Skeleton Lines */}
        <div className="space-y-3 max-w-2xl">
          <div className="h-10 sm:h-12 w-3/4 rounded-2xl bg-[#4a3b32]/70" />
          <div className="h-10 sm:h-12 w-full rounded-2xl bg-[#4a3b32]/70" />
        </div>

        {/* Subtitle Skeleton */}
        <div className="space-y-2 max-w-xl pt-1">
          <div className="h-4 w-full rounded-lg bg-[#4a3b32]/50" />
          <div className="h-4 w-4/5 rounded-lg bg-[#4a3b32]/50" />
        </div>

        {/* Button Skeletons: Pill Button + Phone Badge */}
        <div className="pt-3 flex items-center gap-4 sm:gap-6">
          <div className="w-48 h-12 sm:h-14 rounded-full bg-[#4a3b32]" />
          <div className="w-44 h-12 rounded-2xl bg-[#4a3b32]/50" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Section 3: Bulk SMS Offer
 */
export function BulkSmsOfferSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="w-full py-24 md:py-32 px-4 sm:px-6"
    >
      <div className="w-full max-w-[1200px] mx-auto bg-[#1B1815] rounded-[24px] overflow-hidden p-8 md:p-12 lg:p-[48px] border border-[#F5B83D]/30 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="space-y-5 lg:col-span-7">
            <div className="w-44 h-7 rounded-full bg-[#24201C]" />
            <div className="space-y-3">
              <div className="h-10 w-3/5 rounded-xl bg-[#24201C]" />
              <div className="h-8 w-4/5 rounded-xl bg-[#24201C]" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full rounded bg-[#24201C]" />
              <div className="h-4 w-5/6 rounded bg-[#24201C]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="h-10 rounded-full bg-[#24201C]" />
              <div className="h-10 rounded-full bg-[#24201C]" />
              <div className="h-10 rounded-full bg-[#24201C]" />
              <div className="h-10 rounded-full bg-[#24201C]" />
            </div>
            <div className="flex gap-4 pt-3">
              <div className="w-36 h-[52px] rounded-full bg-[#24201C]" />
              <div className="w-36 h-[52px] rounded-full bg-[#24201C]" />
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-[280px] h-[520px] rounded-[2.5rem] bg-[#24201C] border-[6px] border-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Section 4: Marketing Section
 */
export function MarketingSectionSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-neutral-800/60 bg-[#201915]"
    >
      <div className="max-w-7xl mx-auto p-8 sm:p-12 rounded-3xl bg-[#2a221d] border border-[#7c6a5e]/50 animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="w-48 h-6 rounded-full bg-[#4a3b32]" />
          <div className="h-9 w-4/5 rounded-2xl bg-[#4a3b32]" />
          <div className="h-4 w-3/4 rounded bg-[#4a3b32]/70" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="h-20 rounded-2xl bg-[#4a3b32]/60" />
            <div className="h-20 rounded-2xl bg-[#4a3b32]/60" />
            <div className="h-20 rounded-2xl bg-[#4a3b32]/60" />
          </div>
          <div className="w-44 h-12 rounded-xl bg-[#4a3b32]" />
        </div>
        <div className="lg:col-span-5">
          <div className="aspect-[4/3] w-full rounded-2xl bg-[#4a3b32] border border-[#7c6a5e]/50" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Section 5: SMS Benefits
 */
export function SmsBenefitsSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="w-full my-8 md:my-14 px-4 sm:px-6"
    >
      <div className="w-full max-w-[1200px] mx-auto p-6 md:p-8 lg:p-10 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="w-full lg:col-span-5 space-y-5">
            <div className="space-y-3">
              <div className="w-28 h-4 rounded bg-[#24201C]" />
              <div className="h-8 w-4/5 rounded-xl bg-[#24201C]" />
              <div className="h-4 w-full rounded bg-[#24201C]" />
            </div>
            <div className="h-56 rounded-2xl bg-[#1B1815] border border-white/10" />
          </div>
          <div className="w-full lg:col-span-7 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-[#1B1815] border border-white/10"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Section 6: Why Choose Us
 */
export function WhyChooseUsSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="w-full my-8 md:my-14 px-4 sm:px-6"
    >
      <div className="w-full max-w-[1200px] mx-auto p-6 md:p-8 lg:p-10 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="w-32 h-4 rounded bg-[#24201C]" />
            <div className="h-10 w-4/5 rounded-xl bg-[#24201C]" />
          </div>
          <div className="space-y-3 max-w-md w-full">
            <div className="h-4 w-full rounded bg-[#24201C]" />
            <div className="h-4 w-3/4 rounded bg-[#24201C]" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 md:mt-12 items-stretch">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#1B1815] border border-white/10 p-6 md:p-8 space-y-4 h-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#24201C] border border-white/10" />
              <div className="h-5 w-3/4 rounded bg-[#24201C]" />
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded bg-[#24201C]" />
                <div className="h-3.5 w-4/5 rounded bg-[#24201C]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
