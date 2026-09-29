"use client";

import React from "react";
import {
  Heart,
  SmilePlus,
  ShieldCheck,
  Handshake,
  Flame,
  Lightbulb,
  TrendingUp,
  Target,
  Crosshair,
  GraduationCap,
  Scale,
  Activity,
  LucideIcon,
} from "lucide-react";

interface ValueItem {
  id: string;
  title: string;
  icon: LucideIcon;
  number: string;
}

const VALUES_DATA: ValueItem[] = [
  {
    id: "v-1",
    title: "Always Customer first-Customer Priority-Customer Focused",
    icon: Heart,
    number: "01",
  },
  {
    id: "v-2",
    title: "Sharing both happiness & sadness",
    icon: SmilePlus,
    number: "02",
  },
  {
    id: "v-3",
    title: "Respect & Responsibility",
    icon: ShieldCheck,
    number: "03",
  },
  {
    id: "v-4",
    title: "Honesty, Caring & Trust",
    icon: Handshake,
    number: "04",
  },
  {
    id: "v-5",
    title: "Passion, Dedicated, Professional & Commitment",
    icon: Flame,
    number: "05",
  },
  {
    id: "v-6",
    title: "Courageous, Embrace Change & Innovate",
    icon: Lightbulb,
    number: "06",
  },
  {
    id: "v-7",
    title: "Positive Mind never give-up & believe in growth.",
    icon: TrendingUp,
    number: "07",
  },
  {
    id: "v-8",
    title: "Work for Success",
    icon: Target,
    number: "08",
  },
  {
    id: "v-9",
    title: "If Discipline, Focused, Hard Working, Achieve Goals",
    icon: Crosshair,
    number: "09",
  },
  {
    id: "v-10",
    title: "We believe in our people, Develop & Empower them",
    icon: GraduationCap,
    number: "10",
  },
  {
    id: "v-11",
    title: "Compliance, legal authority & Environment",
    icon: Scale,
    number: "11",
  },
  {
    id: "v-12",
    title: "Ensure well-being and continuous self-improvement",
    icon: Activity,
    number: "12",
  },
];

export default function OurValues() {
  return (
    <section
      id="our-values"
      aria-labelledby="our-values-heading"
      className="py-24 bg-[#F4F1EA] dark:bg-[#12100E] relative overflow-hidden border-t border-[#2C2520]/10 dark:border-white/5 transition-colors duration-300"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(212,150,36,0.08)_0,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(245,184,61,0.06)_0,transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(44,37,32,0.04)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#D49624] dark:text-[#F5B83D] font-bold tracking-wider text-xs uppercase inline-block mb-3">
            [ GUIDING PRINCIPLES ]
          </span>
          <h2
            id="our-values-heading"
            className="text-4xl md:text-5xl font-bold text-[#2C2520] dark:text-white tracking-tight leading-tight"
          >
            Our <span className="text-[#D49624] dark:text-[#F5B83D]">Core Values</span>
          </h2>
          <p className="text-[#6E665E] dark:text-neutral-400 text-sm md:text-base mt-4 leading-relaxed font-normal">
            The fundamental beliefs and operating principles that drive our culture, innovation, and client partnerships every single day.
          </p>
        </div>

        {/* 12-Card Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {VALUES_DATA.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.id}
                className="group relative bg-[#E5E2DC] dark:bg-[#1B1815] border border-[#2C2520]/15 dark:border-white/5 rounded-2xl p-6 md:p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#D49624]/40 dark:hover:border-[#F5B83D]/40 hover:shadow-xl dark:hover:shadow-[0_10px_40px_-10px_rgba(245,184,61,0.2)] flex flex-col justify-between"
              >
                {/* Subtle Hover Gradient Flare in Corner */}
                <div
                  className="absolute -top-12 -right-12 w-28 h-28 bg-[#D49624]/10 dark:bg-[#F5B83D]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  aria-hidden="true"
                />

                <div>
                  {/* Top Bar: Icon Container + Numeric Index */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center transition-all duration-500 group-hover:bg-[#D49624]/20 dark:group-hover:bg-[#F5B83D]/20 text-[#D49624] dark:text-[#F5B83D] shadow-sm">
                      <Icon className="w-6 h-6 stroke-[1.75] transition-transform duration-500 ease-out group-hover:scale-110" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#6E665E]/60 dark:text-neutral-600 group-hover:text-[#D49624] dark:group-hover:text-[#F5B83D]/70 transition-colors">
                      {val.number}
                    </span>
                  </div>

                  {/* Title / Value */}
                  <h3 className="text-lg font-semibold text-[#2C2520] dark:text-white leading-snug group-hover:text-[#D49624] dark:group-hover:text-[#F5B83D] transition-colors">
                    {val.title}
                  </h3>
                </div>

                {/* Bottom subtle accent line on hover */}
                <div className="w-0 h-[2px] bg-[#D49624] dark:bg-[#F5B83D] mt-6 transition-all duration-500 ease-out group-hover:w-12 rounded-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
