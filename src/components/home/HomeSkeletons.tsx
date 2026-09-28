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
      className="w-full my-6 md:my-10 px-4 sm:px-6"
    >
      <div className="w-full max-w-[1280px] mx-auto bg-[#faf9f6] rounded-3xl overflow-hidden p-6 md:p-10 lg:p-12 border border-[#e7e1d7] animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="w-40 h-6 rounded-full bg-neutral-200" />
            <div className="space-y-2.5 max-w-lg">
              <div className="h-8 w-4/5 rounded-xl bg-neutral-200" />
              <div className="h-8 w-3/5 rounded-xl bg-neutral-200" />
            </div>
            <div className="space-y-2 pt-1 max-w-lg">
              <div className="h-4 w-full rounded-lg bg-neutral-200" />
              <div className="h-4 w-5/6 rounded-lg bg-neutral-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg pt-1">
              <div className="h-5 w-3/4 rounded bg-neutral-200" />
              <div className="h-5 w-3/4 rounded bg-neutral-200" />
              <div className="h-5 w-3/4 rounded bg-neutral-200" />
              <div className="h-5 w-3/4 rounded bg-neutral-200" />
            </div>
            <div className="flex gap-4 pt-2">
              <div className="w-36 h-11 rounded-full bg-neutral-300" />
              <div className="w-36 h-11 rounded-full bg-neutral-200" />
            </div>
          </div>
          <div>
            <div className="w-full aspect-[2952/1408] rounded-2xl bg-neutral-200" />
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
      className="w-full my-8 md:my-14 px-4 sm:px-6"
    >
      <div className="w-full max-w-[1280px] mx-auto p-6 md:p-12 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <div className="w-full aspect-square rounded-3xl bg-neutral-900/50 border border-neutral-800" />
          <div className="space-y-4">
            <div className="space-y-2 mb-6">
              <div className="w-28 h-4 rounded bg-neutral-800" />
              <div className="h-8 w-3/4 rounded bg-neutral-800" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-neutral-900/40 border border-neutral-800"
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
      className="w-full my-6 md:my-10 px-4 sm:px-6"
    >
      <div className="w-full max-w-[1280px] mx-auto p-6 md:p-10 lg:p-12 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="w-32 h-4 rounded bg-neutral-800" />
            <div className="h-10 w-4/5 rounded-xl bg-neutral-800" />
          </div>
          <div className="space-y-3 max-w-md w-full">
            <div className="h-4 w-full rounded bg-neutral-800" />
            <div className="h-4 w-3/4 rounded bg-neutral-800" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-neutral-900/50 border border-neutral-800 p-6 space-y-4"
            >
              <div className="w-14 h-14 rounded-full border border-neutral-700 bg-neutral-800" />
              <div className="h-5 w-3/4 rounded bg-neutral-800" />
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded bg-neutral-800" />
                <div className="h-3.5 w-4/5 rounded bg-neutral-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
