import React from "react";

/**
 * Skeleton for Hero Slider - Matches exact dimensions (h-[460px] sm:h-[520px] lg:h-[560px]) to prevent CLS.
 */
export function HeroSliderSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full h-[460px] sm:h-[520px] lg:h-[560px] overflow-hidden border-b border-[#d4ccc0] bg-[#2a221d] animate-pulse flex flex-col justify-center"
    >
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
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

        {/* Button Skeletons */}
        <div className="pt-3 flex gap-3">
          <div className="w-36 h-12 rounded-xl bg-[#4a3b32]" />
          <div className="w-28 h-12 rounded-xl bg-[#4a3b32]/50" />
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
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#d4ccc0] bg-[#f4f0e6]"
    >
      <div className="max-w-7xl mx-auto p-6 sm:p-10 lg:p-12 rounded-3xl bg-[#fcfbf9] border border-[#d4ccc0] animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="w-40 h-6 rounded-full bg-[#ebe5da]" />
          <div className="h-9 w-4/5 rounded-2xl bg-[#ebe5da]" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded-lg bg-[#ebe5da]" />
            <div className="h-4 w-5/6 rounded-lg bg-[#ebe5da]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="h-5 w-3/4 rounded bg-[#ebe5da]" />
            <div className="h-5 w-3/4 rounded bg-[#ebe5da]" />
            <div className="h-5 w-3/4 rounded bg-[#ebe5da]" />
            <div className="h-5 w-3/4 rounded bg-[#ebe5da]" />
          </div>
          <div className="pt-2 flex gap-3">
            <div className="w-44 h-12 rounded-xl bg-[#ebe5da]" />
            <div className="w-32 h-12 rounded-xl bg-[#ebe5da]" />
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="aspect-[4/3] w-full rounded-2xl bg-[#ebe5da] border border-[#d4ccc0]" />
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
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#d4ccc0] bg-[#201915]"
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
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#d4ccc0] bg-[#f4f0e6]"
    >
      <div className="max-w-7xl mx-auto space-y-10 animate-pulse">
        <div className="text-center space-y-3 max-w-xl mx-auto flex flex-col items-center">
          <div className="w-36 h-6 rounded-full bg-[#ebe5da]" />
          <div className="h-8 w-4/5 rounded-xl bg-[#ebe5da]" />
          <div className="h-4 w-full rounded bg-[#ebe5da]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-[#fcfbf9] border border-[#d4ccc0] space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#ebe5da]" />
              <div className="h-6 w-1/2 rounded bg-[#ebe5da]" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-[#ebe5da]" />
                <div className="h-4 w-3/4 rounded bg-[#ebe5da]" />
              </div>
            </div>
          ))}
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
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#d4ccc0] bg-[#f5efe6]"
    >
      <div className="max-w-7xl mx-auto space-y-12 animate-pulse">
        <div className="text-center space-y-3 max-w-xl mx-auto flex flex-col items-center">
          <div className="w-40 h-6 rounded-full bg-[#ebe5da]" />
          <div className="h-8 w-4/5 rounded-xl bg-[#ebe5da]" />
          <div className="h-4 w-full rounded bg-[#ebe5da]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-7 rounded-3xl bg-[#fcfbf9] border border-[#d4ccc0] space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#ebe5da]" />
              <div className="h-5 w-2/3 rounded bg-[#ebe5da]" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-[#ebe5da]" />
                <div className="h-4 w-4/5 rounded bg-[#ebe5da]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
