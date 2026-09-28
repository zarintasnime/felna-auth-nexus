"use client";

import React from "react";
import Link from "next/link";
import {
  Wallet,
  MessageSquareText,
  Headset,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { ServiceFeatureItem } from "@/types/homepage";

export interface WhyChooseUsProps {
  features?: ServiceFeatureItem[];
}

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DEFAULT_CARDS: FeatureCard[] = [
  {
    title: "Mobile Payment Solution",
    description: "You Can Pay Your Corporate Mobile Bill From Same Panel.",
    icon: Wallet,
  },
  {
    title: "Cheap SMS Rate Better Support",
    description: "We Provide You Lowest Rate of SMS Masking or non-Masking.",
    icon: MessageSquareText,
  },
  {
    title: "24/7 Support Instantly",
    description: "We are ensure Support and service 24/7 hours. by mail/phone",
    icon: Headset,
  },
  {
    title: "Masking SMS Configuration",
    description: "We Can Provide Your Masking With in a Day for Business promotion",
    icon: ShieldCheck,
  },
];

function resolveCardIcon(iconName?: string, index = 0): React.ComponentType<{ className?: string }> {
  switch (iconName?.toLowerCase()) {
    case "wallet":
    case "creditcard":
    case "smartphone":
      return Wallet;
    case "messagesquaretext":
    case "messagessquare":
    case "messagesquare":
    case "message-square":
    case "message":
      return MessageSquareText;
    case "headset":
    case "headphones":
    case "clock":
      return Headset;
    case "shieldcheck":
    case "shield-check":
    case "badgecheck":
    case "settings":
      return ShieldCheck;
    default:
      return DEFAULT_CARDS[index % DEFAULT_CARDS.length].icon;
  }
}

export default function WhyChooseUs({ features }: WhyChooseUsProps) {
  // Map dynamic features if provided and non-empty, otherwise use strict blueprint defaults
  const cards: FeatureCard[] =
    features && features.length > 0
      ? features.slice(0, 4).map((f, i) => ({
          title: f.title || DEFAULT_CARDS[i].title,
          description: f.description || DEFAULT_CARDS[i].description,
          icon: resolveCardIcon(f.iconName, i),
        }))
      : DEFAULT_CARDS;

  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-choose-us-heading"
      className="w-full my-6 md:my-10 px-4 sm:px-6"
    >
      {/* =================================================================== */}
      {/* Standard Boxed Wrapper Container: max-w-[1280px]                    */}
      {/* =================================================================== */}
      <div className="w-full max-w-[1280px] mx-auto p-6 md:p-10 lg:p-12">
        {/* ================================================================= */}
        {/* Top Header Flexbox                                                */}
        {/* ================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          {/* Left Side: Accent Tag + Large Main Heading */}
          <div className="space-y-3 max-w-xl">
            <span className="text-amber-400 font-bold tracking-wider text-xs uppercase inline-block">
              [ WHY CHOOSE US ]
            </span>
            <h2
              id="why-choose-us-heading"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white leading-tight"
            >
              Reliable IT Solution, for Best Results.
            </h2>
          </div>

          {/* Right Side: Short Description + Pill-shaped Learn More Button */}
          <div className="flex flex-col items-start md:items-end justify-between gap-4 max-w-md">
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed md:text-right">
              We deliver enterprise-grade SMS routing, real-time analytics, and round-the-clock technical assistance designed to scale your business effortlessly.
            </p>
            <Link
              href="#services"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-white hover:text-amber-400 font-semibold text-xs sm:text-sm transition-all duration-300 shadow-sm group/btn"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 text-white group-hover/btn:text-amber-400 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Cards Grid: 4-Column Responsive Grid with Smooth Rotating Hover   */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-amber-400 p-6 transition-colors duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon Container: Fill color on card hover + 360-deg rotation on the icon itself */}
                  <div className="w-14 h-14 rounded-full border border-neutral-700 text-neutral-300 flex items-center justify-center mb-6 group-hover:bg-amber-400 group-hover:text-black group-hover:border-amber-400 transition-all duration-300">
                    <Icon className="w-6 h-6 stroke-[1.75] transition-transform duration-500 ease-in-out group-hover:rotate-[360deg] group-hover:scale-110" />
                  </div>

                  {/* Card Title */}
                  <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-amber-100 transition-colors">
                    {card.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
