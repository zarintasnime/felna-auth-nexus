"use client";

import React from "react";

export const PARTNERS: string[] = [
  "Grameenphone",
  "Banglalink",
  "Robi",
  "Airtel",
  "Teletalk",
  "IGL Group",
  "IGL Network™ Ltd.",
  "Unicode Converter",
  "iNews24 Ltd.",
  "RamBD Ltd.",
  "Student Visa BD",
  "Felna Tech",
];

export interface TrustedPartnersProps {
  partners?: string[];
}

export default function TrustedPartners({
  partners = PARTNERS,
}: TrustedPartnersProps) {
  return (
    <section
      aria-label="Trusted Partners"
      className="w-full my-8 md:my-14 overflow-hidden"
    >
      {/* =================================================================== */}
      {/* Premium Header with Styled 1000+ Pill                              */}
      {/* =================================================================== */}
      <div className="text-center mb-8 sm:mb-10 px-4">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white inline-flex items-center justify-center flex-wrap gap-2">
          <span>Join Over</span>
          <span className="inline-flex items-center px-3.5 py-0.5 rounded-full text-sm sm:text-base font-black bg-amber-400/15 text-amber-400 border border-amber-400/30 shadow-xs">
            1000+
          </span>
          <span>Companies with FelnaDMA</span>
        </h3>
      </div>

      {/* =================================================================== */}
      {/* Infinite Horizontal Scrolling Marquee Container                     */}
      {/* =================================================================== */}
      <div className="relative w-full overflow-hidden pause-on-hover py-3">
        {/* Left Edge Gradient Fade Mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-36 bg-gradient-to-r from-[#181310] to-transparent z-10"
        />

        {/* Right Edge Gradient Fade Mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-36 bg-gradient-to-l from-[#181310] to-transparent z-10"
        />

        {/* Marquee Track Container */}
        <div className="flex select-none">
          {/* Primary Track */}
          <div className="flex shrink-0 animate-marquee items-center">
            {partners.map((partner, index) => (
              <div
                key={`partner-track1-${index}`}
                className="group flex items-center justify-center min-w-[240px] h-20 mx-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-sm transition-all duration-300 hover:bg-neutral-800 hover:border-neutral-600 hover:shadow-lg cursor-pointer px-6"
              >
                <span className="text-xl md:text-2xl font-black tracking-tight text-neutral-500 group-hover:text-white transition-colors duration-300 uppercase whitespace-nowrap">
                  {partner}
                </span>
              </div>
            ))}
          </div>

          {/* Duplicate Track for Seamless Infinite Loop */}
          <div
            aria-hidden="true"
            className="flex shrink-0 animate-marquee items-center"
          >
            {partners.map((partner, index) => (
              <div
                key={`partner-track2-${index}`}
                className="group flex items-center justify-center min-w-[240px] h-20 mx-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-sm transition-all duration-300 hover:bg-neutral-800 hover:border-neutral-600 hover:shadow-lg cursor-pointer px-6"
              >
                <span className="text-xl md:text-2xl font-black tracking-tight text-neutral-500 group-hover:text-white transition-colors duration-300 uppercase whitespace-nowrap">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
