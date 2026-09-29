"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { BenefitItem } from "@/types/homepage";

export interface AccordionBenefit {
  title: string;
  description: string;
}

export interface SmsBenefitsProps {
  benefits?: BenefitItem[];
}

export const DEFAULT_BENEFITS: AccordionBenefit[] = [
  {
    title: "You Can Increase Customer Engagement By Bulk SMS Services",
    description:
      "Think of bulk SMS service solution as a way to enhance how your brand engages with your all customers across the entire customer life cycle. Businesses should remember to vary the type of content they send out by bulk SMS promotion - while customers may value updates and news on forthcoming developments within the brand by bulk SMS, business promotional information is best delivered way via sms marketing services where longer, more creative messaging is more appropriate.",
  },
  {
    title: "Speed Up Your Sale By Bulk SMS Marketing",
    description:
      "Speed up your sale by bulk SMS marketing way, this is only way to connect with your customer directly phone to phone instantly. there is no any others way to connect/reach your target customer. You can try once to better understand. Bulk SMS service is the only way to create brand first in the corporate market.",
  },
  {
    title: "Cost Effective SMS Marketing Solution",
    description:
      "SMS marketing service is only way to make cost effective marketing solution in any time, this way is too strong then any others marketing solution way, like news paper, TV, radio etc. you can send bulk SMS for promotion to customer so customer seen instant from his mobile phone with cheap cost way.",
  },
  {
    title: "Bulk SMS Is A Direct Immediate Channel With Customer Engagement",
    description:
      "Bulk SMS service is one of the most popular way to connect with your customer; with a read rate of 90% within 30 minutes from delivery, you can be reassured that your time critical messages will be read almost instantly. A significant 45% of bulk SMS campaigns generate a successful ROI (Return on Investment), reaching over 50% when combined with other popular channels such as email and social media. so bulk SMS promotion is a one of the best way for your brand popularity",
  },
  {
    title: "Bulk SMS Is A Simple Way But Feedback Is Too Large",
    description:
      "SMS marketing cost is very cheap but feedback better then any others marketing system. and customer satisfaction is too much showing able. If you don't believe so you can try once with bulk SMS marketing for test.",
  },
];

export default function SmsBenefits({ benefits }: SmsBenefitsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [imgSrc, setImgSrc] = useState<string>("/images/sms-benefits.png");

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const items: AccordionBenefit[] =
    benefits && benefits.length > 0
      ? benefits.map((b) => ({ title: b.title, description: b.description }))
      : DEFAULT_BENEFITS;

  return (
    <section
      id="benefits"
      aria-labelledby="sms-benefits-title"
      className="w-full my-8 md:my-14 px-4 sm:px-6"
    >
      {/* =================================================================== */}
      {/* Boxed Wrapper Container: max-w-[1200px] on 8px grid                 */}
      {/* =================================================================== */}
      <div className="w-full max-w-[1200px] mx-auto p-6 md:p-8 lg:p-10">
        {/* ================================================================= */}
        {/* 2-Column Layout: Sticky Left Header/Intro & Right Accordion       */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* =============================================================== */}
          {/* Left Column (Sticky): Title, Short Intro & Visual Frame         */}
          {/* =============================================================== */}
          <div className="w-full lg:col-span-5 lg:sticky lg:top-24 space-y-5 self-start">
            <div className="space-y-3">
              <span className="text-[#F5B83D] font-bold tracking-wider text-xs uppercase inline-block">
                [ SMS BENEFITS & FAQ ]
              </span>
              <h2
                id="sms-benefits-title"
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight"
              >
                Drive Real Growth With Direct Messaging
              </h2>
              <p className="text-[15px] sm:text-base text-neutral-400 leading-relaxed font-normal pt-1">
                Connect directly with your customers across Bangladesh. Experience over 90% read rates within 30 minutes, instantaneous OTP delivery, and unmatched conversion rates compared to traditional channels.
              </p>
            </div>

            {/* Visual Graphic Illustration Card */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#1B1815] p-5 shadow-xl shadow-black/40 group">
              <div className="absolute inset-0 bg-radial from-[#F5B83D]/10 via-transparent to-transparent blur-2xl pointer-events-none" />
              <div className="relative w-full flex items-center justify-center">
                <Image
                  src={imgSrc}
                  alt="SMS Marketing & Multi-Channel Communication Benefits"
                  width={600}
                  height={400}
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="w-full h-auto max-h-[260px] object-contain drop-shadow-md transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  onError={() => setImgSrc("/images/sms-benefits.png")}
                />
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* Right Column: Interactive Accordion List                         */}
          {/* =============================================================== */}
          <div className="w-full lg:col-span-7 space-y-4">
            {items.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className={`rounded-2xl transition-all duration-300 border ${
                    isOpen
                      ? "bg-[#1B1815] border-[#F5B83D]/60 shadow-[0_0_20px_rgba(245,184,61,0.08)]"
                      : "bg-[#1B1815] border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Accordion Header / Trigger Button */}
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B83D] rounded-2xl cursor-pointer group"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-base sm:text-lg font-semibold transition-colors duration-200 leading-snug ${
                        isOpen
                          ? "text-[#F5B83D]"
                          : "text-white group-hover:text-[#F5B83D]/90"
                      }`}
                    >
                      {item.title}
                    </span>

                    {/* Icon Container: Solid Amber (#F5B83D) when open, neutral when closed */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border ${
                        isOpen
                          ? "bg-[#F5B83D] border-[#F5B83D] text-black shadow-sm shadow-[#F5B83D]/30"
                          : "bg-[#24201C] border-white/10 text-neutral-400 group-hover:text-white"
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 stroke-[2.5] transition-transform duration-250 ease-in-out ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Smooth 250ms Collapsible Content with Readable Line Lengths */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                    style={{ transitionDuration: "250ms" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-[15px] sm:text-base text-neutral-400 leading-relaxed font-normal border-t border-white/5 pt-4 max-w-prose">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
