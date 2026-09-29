import React, { Suspense } from "react";
import { Lock, CheckCircle2 } from "lucide-react";
import TopBar from "@/components/home/TopBar";
import DynamicNavbar from "@/components/home/DynamicNavbar";
import HeroSlider from "@/components/home/HeroSlider";
import BulkSmsOffer from "@/components/home/BulkSmsOffer";
import MarketingSection from "@/components/home/MarketingSection";
import SmsBenefits from "@/components/home/SmsBenefits";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TrustedPartners from "@/components/home/TrustedPartners";
import MobileBottomBar from "@/components/home/MobileBottomBar";
import Footer from "@/components/home/Footer";
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
import { getPublicCmsData } from "@/lib/services/cms-service";

export default async function HomePage() {
  const [session, homeData, cmsData] = await Promise.all([
    getSession(),
    getHomePageData(),
    getPublicCmsData(),
  ]);

  return (
    <div className="min-h-screen bg-[#181310] text-[#fcfbf9] flex flex-col justify-between selection:bg-[#4a3b32] selection:text-[#fcfbf9]">
      {/* =================================================================== */}
      {/* 1. Boxed Header Card Wrapper (TopBar + DynamicNavbar + HeroSlider)  */}
      {/* =================================================================== */}
      <header className="w-full relative z-20">
        <div className="w-[98%] 2xl:w-[98.5%] max-w-[1880px] mx-auto my-3 md:my-5 rounded-2xl md:rounded-3xl border border-neutral-800/60 bg-[#201915] shadow-2xl shadow-black/60 relative z-30">
          {/* Top Utility Bar (Dynamic from CMS Settings) */}
          <TopBar
            announcementText={cmsData.settings.announcementText}
            announcementLinkText={cmsData.settings.announcementLinkText}
            announcementHref={cmsData.settings.announcementLinkUrl}
            scheduleText={cmsData.settings.scheduleText}
            supportHref="/contact"
          />

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
          <div id="home" className="rounded-b-2xl md:rounded-b-3xl overflow-hidden">
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
        {/* Trusted Partners / Client Logo Carousel (Dynamic from CMS) */}
        <SectionErrorBoundary sectionName="Trusted Partners">
          <TrustedPartners partners={cmsData.partners} />
        </SectionErrorBoundary>

        {/* Section 3: Bulk SMS Promotional Offer Block */}
        <SectionErrorBoundary sectionName="Bulk SMS Offer">
          <Suspense fallback={<BulkSmsOfferSkeleton />}>
            <BulkSmsOffer offer={homeData.offer} />
          </Suspense>
        </SectionErrorBoundary>

        {/* SMS Benefits / Accordion Section (Mounted directly below BulkSmsOffer) */}
        <SectionErrorBoundary sectionName="SMS Benefits">
          <Suspense fallback={<SmsBenefitsSkeleton />}>
            <SmsBenefits benefits={homeData.benefits} />
          </Suspense>
        </SectionErrorBoundary>

        {/* Why Choose Us Enterprise Features Grid */}
        <SectionErrorBoundary sectionName="Why Choose Us">
          <Suspense fallback={<WhyChooseUsSkeleton />}>
            <WhyChooseUs features={homeData.features} />
          </Suspense>
        </SectionErrorBoundary>

        {/* Section 4: Marketing Strategy Highlight Section */}
        <SectionErrorBoundary sectionName="Marketing Section">
          <Suspense fallback={<MarketingSectionSkeleton />}>
            <MarketingSection marketing={homeData.marketing} />
          </Suspense>
        </SectionErrorBoundary>

        {/* Standards & Security Overview Banner */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1B1815] border border-white/10 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-bold text-base text-white">
                  Security Specifications & Standards
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Multi-layered defense architecture protecting identities and credentials on Felna.com.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#24201C] text-[#F5B83D] text-xs font-semibold border border-white/10 self-start sm:self-auto">
                <Lock className="w-3.5 h-3.5 text-[#F5B83D]" />
                <span>SSL & Hashing Enforced</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5B83D] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-200">Neon PostgreSQL:</span>
                  <p className="text-neutral-400 mt-0.5">
                    Serverless pooled database with SSL connection verification.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5B83D] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-200">Cryptographic OTP:</span>
                  <p className="text-neutral-400 mt-0.5">
                    SHA-256 OTP hashing with timingSafeEqual and lockout defenses.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5B83D] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-200">Stateless JWT Cookies:</span>
                  <p className="text-neutral-400 mt-0.5">
                    HTTP-only signed cookies verified through Edge Middleware.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =================================================================== */}
      {/* Universal Footer (Dynamic from CMS Settings & Social Links)         */}
      {/* =================================================================== */}
      <Footer settings={cmsData.settings} socialLinks={cmsData.socialLinks} />

      {/* Sticky Mobile Quick Action Bar (<640px) */}
      <MobileBottomBar />
    </div>
  );
}
