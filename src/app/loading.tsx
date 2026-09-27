import React from "react";
import {
  HeroSliderSkeleton,
  BulkSmsOfferSkeleton,
  MarketingSectionSkeleton,
  SmsBenefitsSkeleton,
  WhyChooseUsSkeleton,
} from "@/components/home/HomeSkeletons";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f4f0e6] text-stone-800 flex flex-col justify-between">
      {/* Top Navbar Placeholder */}
      <header className="sticky top-0 z-40 w-full border-b border-[#d4ccc0] bg-[#f4f0e6]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4a3b32] animate-pulse" />
            <div className="h-4 w-28 rounded bg-[#ebe5da] animate-pulse" />
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="h-3 w-16 rounded bg-[#ebe5da] animate-pulse" />
            <div className="h-3 w-20 rounded bg-[#ebe5da] animate-pulse" />
            <div className="h-3 w-20 rounded bg-[#ebe5da] animate-pulse" />
            <div className="h-3 w-16 rounded bg-[#ebe5da] animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-20 rounded-xl bg-[#ebe5da] animate-pulse" />
            <div className="h-8 w-28 rounded-xl bg-[#4a3b32] animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Skeletons matching exact heights to eliminate CLS */}
      <main className="flex-1">
        <HeroSliderSkeleton />
        <BulkSmsOfferSkeleton />
        <MarketingSectionSkeleton />
        <SmsBenefitsSkeleton />
        <WhyChooseUsSkeleton />
      </main>
    </div>
  );
}
