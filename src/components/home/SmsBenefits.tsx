"use client";

import React, { useState } from "react";
import { ChevronDown, ImageIcon } from "lucide-react";
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

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const items: AccordionBenefit[] =
    benefits && benefits.length >= 5
      ? benefits.map((b) => ({ title: b.title, description: b.description }))
      : DEFAULT_BENEFITS;

  return (
    <section
      id="benefits"
      aria-labelledby="sms-benefits-title"
      className="w-full my-8 md:my-14 px-4 sm:px-6"
    >
      {/* =================================================================== */}
      {/* Standard Boxed Wrapper Container: max-w-[1280px]                    */}
      {/* =================================================================== */}
      <div className="w-full max-w-[1280px] mx-auto p-6 md:p-12">
        {/* ================================================================= */}
        {/* Responsive 2-Column Grid (Left: Visual, Right: Accordion)         */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          
          {/* =============================================================== */}
          {/* Left Column: Visual Illustration Placeholder Card               */}
          {/* =============================================================== */}
          <div className="w-full flex items-center justify-center lg:sticky lg:top-24">
            <div className="w-full aspect-square rounded-3xl bg-neutral-900/50 border border-neutral-800 flex flex-col items-center justify-center p-8 relative overflow-hidden group shadow-2xl">
              {/* Subtle radial ambient glow */}
              <div className="absolute inset-0 bg-radial from-emerald-500/10 via-amber-500/5 to-transparent pointer-events-none" />

              <div className="relative flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-neutral-800/80 border border-neutral-700/80 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
                  <ImageIcon className="w-10 h-10 text-neutral-400 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="space-y-1">
                  <p className="text-base sm:text-lg font-bold text-neutral-200">
                    Illustration Placeholder
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-500 max-w-xs">
                    Visual representation of bulk SMS analytics and multi-channel campaign ROI
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* Right Column: Interactive Accordion List                         */}
          {/* =============================================================== */}
          <div className="w-full flex flex-col">
            <div className="mb-6">
              <span className="text-amber-400 font-bold tracking-wider text-xs uppercase inline-block mb-2">
                [ SMS BENEFITS ]
              </span>
              <h2
                id="sms-benefits-title"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug"
              >
                Drive Real Growth With Direct Messaging
              </h2>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={index}
                    className={`rounded-2xl transition-all duration-300 border ${
                      isOpen
                        ? "bg-neutral-800/60 border-emerald-500/50 shadow-lg shadow-emerald-500/5"
                        : "bg-neutral-900/40 border-neutral-800 hover:border-neutral-600"
                    }`}
                  >
                    {/* Accordion Header / Trigger Button */}
                    <button
                      type="button"
                      onClick={() => toggleAccordion(index)}
                      className="w-full p-5 flex items-center justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-2xl cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`text-base sm:text-lg font-semibold transition-colors duration-200 ${
                          isOpen ? "text-white" : "text-neutral-300 hover:text-white"
                        }`}
                      >
                        {item.title}
                      </span>

                      {/* Icon Circle (Green background + dark/black icon when active) */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border ${
                          isOpen
                            ? "bg-emerald-500 border-emerald-500 text-black shadow-sm shadow-emerald-500/30"
                            : "bg-neutral-800/50 border-neutral-700 text-neutral-400"
                        }`}
                      >
                        <ChevronDown
                          className={`w-4 h-4 stroke-[2.5] transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {/* Smooth Collapsible Content */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal border-t border-neutral-800/60 pt-3">
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
      </div>
    </section>
  );
}
