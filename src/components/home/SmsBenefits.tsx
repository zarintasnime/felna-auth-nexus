"use client";

import React, { useState } from "react";
import { Sparkles, Check, Layers, Grid } from "lucide-react";
import { BenefitItem } from "@/types/homepage";
import DynamicIcon from "@/components/common/DynamicIcon";

export interface SmsBenefitsProps {
  benefits?: BenefitItem[];
}

export default function SmsBenefits({ benefits = [] }: SmsBenefitsProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "high-volume" | "delivery">("all");

  if (!benefits || benefits.length === 0) return null;

  return (
    <section
      id="benefits"
      aria-labelledby="sms-benefits-title"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#d4ccc0] bg-[#f4f0e6]"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#ebe5da] text-[#4a3b32] border border-[#d4ccc0] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#4a3b32]" />
            <span>Carrier-Grade Advantages</span>
          </div>

          <h2
            id="sms-benefits-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#4a3b32]"
          >
            SMS Marketing Built for High-Volume ROI
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Engineered with direct telecom interconnects to ensure maximum delivery rates, 
            zero queue latency, and crystal-clear real-time operator reporting.
          </p>
        </div>

        {/* Responsive Grid of Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              className="p-6 sm:p-8 rounded-3xl bg-[#fcfbf9] border border-[#d4ccc0] shadow-xs hover:shadow-md transition-all duration-200 space-y-4 hover:translate-y-[-2px] group"
            >
              {/* Icon & Counter Header */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#ebe5da] text-[#4a3b32] border border-[#d4ccc0] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <DynamicIcon name={benefit.iconName} className="w-6 h-6 text-[#4a3b32]" />
                </div>
                <span className="text-xs font-mono font-bold text-stone-600 bg-[#ebe5da] px-2.5 py-1 rounded-lg border border-[#d4ccc0]">
                  0{index + 1}
                </span>
              </div>

              {/* Title & Copy */}
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-[#4a3b32]">
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              {/* Micro Indicator */}
              <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#4a3b32]">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Carrier Protocol</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
