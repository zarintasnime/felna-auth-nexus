import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Shield } from "lucide-react";
import { ServiceFeatureItem } from "@/types/homepage";
import DynamicIcon from "@/components/common/DynamicIcon";

export interface WhyChooseUsProps {
  features?: ServiceFeatureItem[];
}

export default function WhyChooseUs({ features = [] }: WhyChooseUsProps) {
  if (!features || features.length === 0) return null;

  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-choose-us-title"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#d4ccc0] bg-[#f5efe6]"
    >
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#ebe5da] text-[#4a3b32] border border-[#d4ccc0] shadow-2xs">
            <Shield className="w-3.5 h-3.5 text-[#4a3b32]" />
            <span>Enterprise Infrastructure</span>
          </div>

          <h2
            id="why-choose-us-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#4a3b32]"
          >
            Why Thousands of Businesses Trust Felna SMS
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            From e-commerce order alerts to banking OTPs and countrywide marketing campaigns, 
            we provide the most stable SMS routing backbone in Bangladesh.
          </p>
        </div>

        {/* Responsive 3-to-4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="p-6 sm:p-7 rounded-3xl bg-[#fcfbf9] border border-[#d4ccc0] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 hover:translate-y-[-2px]"
            >
              <div className="space-y-4">
                {/* Visual Icon / Image Container */}
                <div className="w-12 h-12 rounded-2xl bg-[#ebe5da] text-[#4a3b32] border border-[#d4ccc0] flex items-center justify-center shadow-2xs shrink-0">
                  {feature.imageUrl ? (
                    <div className="relative w-7 h-7 overflow-hidden rounded-lg">
                      <Image
                        src={feature.imageUrl}
                        alt={feature.title}
                        fill
                        sizes="28px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <DynamicIcon
                      name={feature.iconName}
                      className="w-6 h-6 text-[#4a3b32]"
                    />
                  )}
                </div>

                {/* Feature Title */}
                <h3 className="text-base sm:text-lg font-bold text-[#4a3b32] tracking-tight">
                  {feature.title}
                </h3>

                {/* Feature Description */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Micro Trust Indicator */}
              <div className="pt-2 border-t border-[#e5ded4] flex items-center gap-1.5 text-[11px] font-semibold text-stone-600">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4a3b32]" />
                <span>Enterprise SLA Guarantee</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Conversion Reassurance Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#ebe5da] border border-[#d4ccc0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-lg sm:text-xl font-bold text-[#4a3b32]">
              Ready to supercharge your customer communication?
            </h4>
            <p className="text-xs sm:text-sm text-stone-600">
              Create an account in 60 seconds with instant test credits and API credentials.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#4a3b32] hover:bg-[#3d3028] text-[#fcfbf9] font-bold text-sm rounded-xl shadow-md shadow-[#4a3b32]/25 transition hover:scale-[1.01]"
            >
              <span>Get Free Test Credits</span>
              <ArrowRight className="w-4 h-4 text-[#fcfbf9]" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
