"use client";

import React from "react";
import Link from "next/link";
import {
  Wallet,
  MessageSquareText,
  Headset,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Zap,
  TrendingUp,
  Cpu,
  Server,
  Smartphone,
  BarChart,
  Users,
  Award,
  Globe,
  Lock,
  Send,
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
    description: "We ensure 24/7 support by mail and phone.",
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
    case "security":
      return ShieldCheck;
    case "checkcircle":
    case "check":
      return CheckCircle;
    case "zap":
    case "lightning":
      return Zap;
    case "trendingup":
    case "growth":
      return TrendingUp;
    case "cpu":
      return Cpu;
    case "server":
      return Server;
    case "smartphone":
    case "mobile":
      return Smartphone;
    case "barchart":
    case "analytics":
      return BarChart;
    case "users":
      return Users;
    case "award":
      return Award;
    case "globe":
      return Globe;
    case "lock":
      return Lock;
    case "send":
      return Send;
    default:
      return DEFAULT_CARDS[index % DEFAULT_CARDS.length].icon;
  }
}

export default function WhyChooseUs({ features }: WhyChooseUsProps) {
  // Map dynamic features if provided and non-empty, applying grammar corrections and defaults
  const cards: FeatureCard[] =
    features && features.length > 0
      ? features.map((f, i) => {
          let desc = f.description || DEFAULT_CARDS[i % DEFAULT_CARDS.length].description;
          if (
            desc.includes("We are ensure Support and service") ||
            desc.includes("by mail/phone")
          ) {
            desc = "We ensure 24/7 support by mail and phone.";
          }
          return {
            title: f.title || DEFAULT_CARDS[i % DEFAULT_CARDS.length].title,
            description: desc,
            icon: resolveCardIcon(f.iconName, i),
          };
        })
      : DEFAULT_CARDS;

  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-choose-us-heading"
      className="w-full my-8 md:my-14 px-4 sm:px-6"
    >
      {/* =================================================================== */}
      {/* Boxed Wrapper Container: max-w-[1200px] on 8px grid                 */}
      {/* =================================================================== */}
      <div className="w-full max-w-[1200px] mx-auto p-6 md:p-8 lg:p-10">
        {/* ================================================================= */}
        {/* Top Header Flexbox                                                */}
        {/* ================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          {/* Left Side: Accent Tag + Large Main Heading */}
          <div className="space-y-3 max-w-xl">
            <span className="text-[#F5B83D] font-bold tracking-wider text-xs uppercase inline-block">
              [ WHY CHOOSE US ]
            </span>
            <h2
              id="why-choose-us-heading"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold tracking-tight text-white leading-tight"
            >
              Reliable IT Solution, for Best Results.
            </h2>
          </div>

          {/* Right Side: Short Description + Pill-shaped Learn More Button */}
          <div className="flex flex-col items-start md:items-end justify-between gap-4 max-w-md">
            <p className="text-[15px] sm:text-base text-neutral-400 leading-relaxed md:text-right">
              We deliver enterprise-grade SMS routing, real-time analytics, and round-the-clock technical assistance designed to scale your business effortlessly.
            </p>
            <Link
              href="#services"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#24201C] border border-white/10 hover:border-[#F5B83D] text-white hover:text-[#F5B83D] font-semibold text-xs sm:text-sm transition-all duration-300 shadow-sm group/btn"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 text-white group-hover/btn:text-[#F5B83D] transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Cards Grid: 4-Column Responsive Grid (Equal Heights & Amber Glow) */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 md:mt-12 items-stretch">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl bg-[#1B1815] border border-white/10 p-6 md:p-8 hover:-translate-y-1 hover:border-white/20 transition-all duration-300 h-full flex flex-col justify-between"
              >
                <div>
                  {/* Icon Tile: Rounded tile with faint amber accent glow & 360-deg rotation on hover */}
                  <div className="w-14 h-14 rounded-2xl bg-[#24201C] border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(245,184,61,0.15)] group-hover:border-[#F5B83D]/40 transition-all duration-300 shrink-0">
                    <Icon className="w-6 h-6 text-[#F5B83D] stroke-[1.75] transition-transform duration-500 ease-in-out group-hover:rotate-[360deg] group-hover:scale-110" />
                  </div>

                  {/* Card Title */}
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2.5 group-hover:text-amber-100 transition-colors">
                    {card.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-[15px] text-neutral-400 leading-relaxed font-normal">
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
