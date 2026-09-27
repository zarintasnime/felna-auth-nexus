import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, ArrowRight, BarChart2, Globe2, Sparkles } from "lucide-react";
import { MarketingSectionData } from "@/types/homepage";

export interface MarketingSectionProps {
  marketing: MarketingSectionData | null;
}

export default function MarketingSection({ marketing }: MarketingSectionProps) {
  if (!marketing) return null;

  return (
    <section
      id="marketing"
      aria-labelledby="marketing-section-title"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#d4ccc0] bg-[#201915] text-[#fcfbf9]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-[#2a221d] border border-[#7c6a5e]/50 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* =============================================================== */}
          {/* Left Column: Copy & Strategic Performance Stats (7 Cols)        */}
          {/* =============================================================== */}
          <div className="lg:col-span-7 space-y-6">
            {/* Kicker Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#4a3b32] text-[#e5ded4] border border-[#7c6a5e] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#e5ded4]" />
              <span>Targeted Customer Communication</span>
            </div>

            {/* Headline */}
            <h2
              id="marketing-section-title"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#fcfbf9] leading-tight"
            >
              {marketing.title}
            </h2>

            {/* Subtitle / Explanatory Copy */}
            {marketing.subtitle && (
              <p className="text-sm sm:text-base text-[#e5ded4] leading-relaxed font-normal">
                {marketing.subtitle}
              </p>
            )}

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#201915]/80 border border-[#7c6a5e]/60 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#e5ded4] font-medium">
                  <BarChart2 className="w-3.5 h-3.5 text-[#f4f0e6]" />
                  <span>Open Rate</span>
                </div>
                <div className="text-xl font-bold text-[#fcfbf9]">98%</div>
                <div className="text-[11px] text-stone-400">Within 3 minutes</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#201915]/80 border border-[#7c6a5e]/60 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#e5ded4] font-medium">
                  <Globe2 className="w-3.5 h-3.5 text-[#f4f0e6]" />
                  <span>Coverage</span>
                </div>
                <div className="text-xl font-bold text-[#fcfbf9]">64 Districts</div>
                <div className="text-[11px] text-stone-400">All Bangladesh networks</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#201915]/80 border border-[#7c6a5e]/60 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#e5ded4] font-medium">
                  <MessageSquare className="w-3.5 h-3.5 text-[#f4f0e6]" />
                  <span>Language</span>
                </div>
                <div className="text-xl font-bold text-[#fcfbf9]">বাংলা + English</div>
                <div className="text-[11px] text-stone-400">Full Unicode Support</div>
              </div>
            </div>

            {/* Call to Action Button */}
            <div className="pt-2">
              <Link
                href={marketing.ctaUrl || "/register"}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#f4f0e6] hover:bg-[#ebe5da] text-[#4a3b32] font-bold text-sm rounded-xl shadow-md transition hover:scale-[1.01]"
              >
                <span>{marketing.ctaText || "Launch Campaign"}</span>
                <ArrowRight className="w-4 h-4 text-[#4a3b32]" />
              </Link>
            </div>
          </div>

          {/* =============================================================== */}
          {/* Right Column: High-Impact Visual Asset (5 Cols)                 */}
          {/* =============================================================== */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#7c6a5e]/60 shadow-lg bg-[#201915]">
              <Image
                src={marketing.imageUrl}
                alt={marketing.title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center filter brightness-95 transition-transform duration-500 hover:scale-105"
              />

              {/* Edge Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#201915]/80 via-transparent to-transparent" />

              {/* Live Status Chip */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#201915]/90 backdrop-blur-md border border-[#7c6a5e]/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-[#fcfbf9]">Live Gateway Active</span>
                </div>
                <span className="text-[10px] font-mono text-[#e5ded4]">0.02s Latency</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
