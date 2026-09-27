import React, { Suspense } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import TopBar from "@/components/home/TopBar";
import DynamicNavbar from "@/components/home/DynamicNavbar";
import HeroSlider from "@/components/home/HeroSlider";
import BulkSmsOffer from "@/components/home/BulkSmsOffer";
import MarketingSection from "@/components/home/MarketingSection";
import SmsBenefits from "@/components/home/SmsBenefits";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import SectionErrorBoundary from "@/components/common/SectionErrorBoundary";
import {
  HeroSliderSkeleton,
  BulkSmsOfferSkeleton,
  MarketingSectionSkeleton,
  SmsBenefitsSkeleton,
  WhyChooseUsSkeleton,
} from "@/components/home/HomeSkeletons";
import { getSession } from "@/lib/auth";
import { getHomePageData } from "@/lib/services/homepage-service";

export default async function HomePage() {
  const [session, homeData] = await Promise.all([
    getSession(),
    getHomePageData(),
  ]);

  return (
    <div className="min-h-screen bg-[#181310] text-[#fcfbf9] flex flex-col justify-between selection:bg-[#4a3b32] selection:text-[#fcfbf9]">
      {/* =================================================================== */}
      {/* 1. Boxed Header Card Wrapper (TopBar + DynamicNavbar + HeroSlider)  */}
      {/* =================================================================== */}
      <header className="w-full">
        <div className="w-[98%] 2xl:w-[98.5%] max-w-[1880px] mx-auto my-3 md:my-5 rounded-2xl md:rounded-3xl overflow-hidden border border-neutral-800/60 bg-[#201915] shadow-2xl shadow-black/60 relative">
          {/* Top Utility Bar (Edge-to-Edge) */}
          <TopBar />

          {/* Dynamic Frosted Navbar (Edge-to-Edge) */}
          <DynamicNavbar
            items={homeData.navItems}
            initialSession={
              session
                ? {
                    userId: session.userId,
                    name: session.name || "Member",
                    phone: session.phone,
                    role: session.role,
                  }
                : null
            }
          />

          {/* Hero Slider Island (Seamless bottom of the card) */}
          <div id="home">
            <SectionErrorBoundary sectionName="Hero Slider" fallback={<HeroSliderSkeleton />}>
              <Suspense fallback={<HeroSliderSkeleton />}>
                <HeroSlider slides={homeData.heroSlides} />
              </Suspense>
            </SectionErrorBoundary>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* Main Content Area: Sections 3 to 6 + Security Overview              */}
      {/* =================================================================== */}
      <main className="flex-1">
        {/* Section 3: Bulk SMS Promotional Offer Block */}
        <SectionErrorBoundary sectionName="Bulk SMS Offer">
          <Suspense fallback={<BulkSmsOfferSkeleton />}>
            <BulkSmsOffer offer={homeData.offer} />
          </Suspense>
        </SectionErrorBoundary>

        {/* Section 4: Marketing Strategy Highlight Section */}
        <SectionErrorBoundary sectionName="Marketing Section">
          <Suspense fallback={<MarketingSectionSkeleton />}>
            <MarketingSection marketing={homeData.marketing} />
          </Suspense>
        </SectionErrorBoundary>

        {/* Section 5: Carrier-Grade SMS Marketing Benefits */}
        <SectionErrorBoundary sectionName="SMS Benefits">
          <Suspense fallback={<SmsBenefitsSkeleton />}>
            <SmsBenefits benefits={homeData.benefits} />
          </Suspense>
        </SectionErrorBoundary>

        {/* Section 6: Why Choose Us Enterprise Features Grid */}
        <SectionErrorBoundary sectionName="Why Choose Us">
          <Suspense fallback={<WhyChooseUsSkeleton />}>
            <WhyChooseUs features={homeData.features} />
          </Suspense>
        </SectionErrorBoundary>

        {/* Standards & Security Overview Banner */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#fcfbf9] border border-[#d4ccc0] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5ded4] pb-4">
              <div>
                <h3 className="font-bold text-base text-[#4a3b32]">
                  Security Specifications & Standards
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Multi-layered defense architecture protecting identities and credentials.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#ebe5da] text-[#4a3b32] text-xs font-semibold border border-[#d4ccc0] self-start sm:self-auto">
                <Lock className="w-3.5 h-3.5 text-[#4a3b32]" />
                <span>SSL & Hashing Enforced</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#4a3b32] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800">Neon PostgreSQL:</span>
                  <p className="text-stone-600 mt-0.5">
                    Serverless pooled database with SSL connection verification.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#4a3b32] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800">Cryptographic OTP:</span>
                  <p className="text-stone-600 mt-0.5">
                    SHA-256 OTP hashing with timingSafeEqual and lockout defenses.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#4a3b32] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800">Stateless JWT Cookies:</span>
                  <p className="text-stone-600 mt-0.5">
                    HTTP-only signed cookies verified through Edge Middleware.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =================================================================== */}
      {/* Universal Footer                                                    */}
      {/* =================================================================== */}
      <footer id="contact" className="border-t border-[#d4ccc0] py-8 px-4 bg-[#f4f0e6] text-center text-xs text-stone-600">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#4a3b32] text-[#fcfbf9] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#fcfbf9]" />
            </div>
            <span className="font-bold text-[#4a3b32]">Felna.com</span>
            <span>&mdash; Secure Role-Based Authentication & Bulk SMS Platform</span>
          </div>

          <div className="flex items-center gap-5 text-xs font-medium">
            <Link href="/login" className="hover:text-[#4a3b32] transition">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-[#4a3b32] transition">
              Register
            </Link>
            <Link href="/dashboard" className="hover:text-[#4a3b32] transition">
              Dashboard
            </Link>
            <span className="text-stone-400">|</span>
            <span className="text-stone-500">
              &copy; {new Date().getFullYear()} Felna Inc. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
