import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import TopBar from "@/components/home/TopBar";
import DynamicNavbar from "@/components/home/DynamicNavbar";
import MobileBottomBar from "@/components/home/MobileBottomBar";
import OurValues from "@/components/about/OurValues";
import { getSession } from "@/lib/auth";
import { getHomePageData } from "@/lib/services/homepage-service";
import { getCmsSiteSettings, getCmsSocialLinks } from "@/lib/services/cms-service";

export const metadata: Metadata = {
  title: "About Us | Felna.com",
  description:
    "Felna.com is Bangladesh's premier carrier-grade Bulk SMS & OTP verification gateway.",
};

export default async function AboutPage() {
  const [session, homeData, settings, socialLinks] = await Promise.all([
    getSession(),
    getHomePageData(),
    getCmsSiteSettings(),
    getCmsSocialLinks(true),
  ]);

  return (
    <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#12100E] text-[#2C2520] dark:text-[#fcfbf9] flex flex-col justify-between selection:bg-[#D49624]/20 dark:selection:bg-[#4a3b32] selection:text-[#2C2520] dark:selection:text-[#fcfbf9] transition-colors">
      {/* =================================================================== */}
      {/* 1. Header Card Wrapper (TopBar + DynamicNavbar)                     */}
      <header className="w-full relative z-20">
        <div className="w-[98%] 2xl:w-[98.5%] max-w-[1880px] mx-auto my-3 md:my-5 rounded-2xl md:rounded-3xl border border-[#2C2520]/15 dark:border-neutral-800/60 bg-[#E5E2DC] dark:bg-[#201915] shadow-xl dark:shadow-2xl shadow-[#2C2520]/5 dark:shadow-black/60 relative z-30 transition-colors">
          <TopBar
            announcementText={settings.announcementText}
            announcementLinkText={settings.announcementLinkText}
            announcementHref={settings.announcementLinkUrl}
            scheduleText={settings.scheduleText}
            supportHref="/contact"
          />
          <DynamicNavbar
            items={homeData.navItems}
            siteSettings={settings}
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
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. Top Hero Banner (Full Width with Subtle Wave / Grid Pattern)     */}
      {/* =================================================================== */}
      <section
        aria-label="About Us Header"
        className="w-full bg-[#E5E2DC] dark:bg-[#0a0a0a] py-24 md:py-32 relative overflow-hidden flex flex-col items-center justify-center border-b border-[#2C2520]/12 dark:border-white/5 transition-colors"
      >
        {/* Subtle radial amber gradient & dotted grid texture */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,184,61,0.08)_0,transparent_70%)] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2C2520] dark:text-white tracking-tight mb-4">
            About Us
          </h1>
          <div className="flex items-center gap-2.5 text-sm font-medium text-[#6E665E] dark:text-neutral-400">
            <Link
              href="/"
              className="hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors"
            >
              Home
            </Link>
            <span className="text-[#6E665E]/50 dark:text-neutral-600">/</span>
            <span className="text-[#D49624] dark:text-[#F5B83D]">About Us</span>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. Main Content Grid (Max Width 1280px)                             */}
      {/* =================================================================== */}
      <main className="flex-1 w-full">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* =============================================================== */}
          {/* Left Column (Grid Col Span 5)                                   */}
          {/* =============================================================== */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Tag Row: Line + Uppercase Text */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-[1px] bg-[#D49624] dark:bg-[#F5B83D]" />
              <span className="text-xs font-bold tracking-widest text-[#6E665E] dark:text-neutral-400 uppercase">
                Our Story
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2C2520] dark:text-white leading-[1.15] mb-8 lg:mb-10 tracking-tight">
              Pioneering Technology &amp; Integrated Security Solutions.
            </h2>

            {/* Main Image */}
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-[#2C2520]/15 dark:border-white/10 group bg-[#E8E4DD] dark:bg-[#1B1815]">
              <Image
                src="/images/aboutsection.png"
                alt="IGL Group - Pioneering Technology & Security"
                width={800}
                height={1000}
                priority
                className="w-full h-auto object-cover rounded-3xl transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* =============================================================== */}
          {/* Right Column (Grid Col Span 7)                                  */}
          {/* =============================================================== */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Top 2 Images: Side-by-Side Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="relative w-full h-52 sm:h-60 md:h-64 rounded-2xl overflow-hidden border border-[#2C2520]/15 dark:border-white/10 shadow-xl group bg-[#E8E4DD] dark:bg-[#1B1815]">
                <Image
                  src="/images/workaboutsection.png"
                  alt="IGL Group Work & Solutions"
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              <div className="relative w-full h-52 sm:h-60 md:h-64 rounded-2xl overflow-hidden border border-[#2C2520]/15 dark:border-white/10 shadow-xl group bg-[#E8E4DD] dark:bg-[#1B1815]">
                <Image
                  src="/images/about_section1.png"
                  alt="IGL Group Technology Services"
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>

            {/* Paragraph Text (5 exact paragraphs) */}
            <div className="text-[#3D3630] dark:text-neutral-400 text-base md:text-[17px] leading-relaxed space-y-5 font-normal">
              <p>
                IGL Group is a web development, IT consulting, and industrial solutions provider serving clients since 2007. Founded by a team of self-motivated ICT professionals and business specialists, our mission is to deliver sophisticated, value-driven, and high-quality services in the field of Information and Communication Technology.
              </p>

              <p>
                IGL Group&apos;s diverse portfolio encompasses a wide range of physical security products, including ERP software solutions, video security, access control, fire systems, and Corporate Flexi Load with Bulk SMS. Additionally, we provide integrated security solutions powered by AI technology, unlocking new possibilities for safety management and business intelligence.
              </p>

              <p>
                Over the years, IGL Group has continuously expanded its expertise to meet the unique needs of various industries. We take pride in delivering intelligent, professional solutions tailored to sectors such as smart cities, transportation, retail, logistics, energy, and education.
              </p>

              <p>
                At IGL Group, we are committed to innovation, excellence, and technological advancement. Our mission is to enhance the safety, efficiency, and convenience of our clients&apos; operations through cutting-edge solutions.
              </p>

              <p>
                Thank you for considering The Ideal Growing List (IGL) as your trusted partner in pioneering technology solutions. We look forward to collaborating with you to drive innovation and progress in your endeavors.
              </p>
            </div>

            {/* Stats Row: 4-Column Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 mt-10 border-t border-[#2C2520]/12 dark:border-white/10">
              <div className="p-4 rounded-2xl bg-[#E8E4DD] dark:bg-[#1B1815]/60 border border-[#2C2520]/12 dark:border-white/5 transition-colors">
                <div className="text-3xl font-bold text-[#2C2520] dark:text-white mb-1.5 tracking-tight">15+ Years</div>
                <div className="text-xs text-[#6E665E] dark:text-neutral-500 uppercase font-medium tracking-wider">Experience</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#E8E4DD] dark:bg-[#1B1815]/60 border border-[#2C2520]/12 dark:border-white/5 transition-colors">
                <div className="text-3xl font-bold text-[#2C2520] dark:text-white mb-1.5 tracking-tight">500+</div>
                <div className="text-xs text-[#6E665E] dark:text-neutral-500 uppercase font-medium tracking-wider">Clients</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#E8E4DD] dark:bg-[#1B1815]/60 border border-[#2C2520]/12 dark:border-white/5 transition-colors">
                <div className="text-3xl font-bold text-[#2C2520] dark:text-white mb-1.5 tracking-tight">10k+</div>
                <div className="text-xs text-[#6E665E] dark:text-neutral-500 uppercase font-medium tracking-wider">Projects</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#E8E4DD] dark:bg-[#1B1815]/60 border border-[#2C2520]/12 dark:border-white/5 transition-colors">
                <div className="text-3xl font-bold text-[#2C2520] dark:text-white mb-1.5 tracking-tight">24/7</div>
                <div className="text-xs text-[#6E665E] dark:text-neutral-500 uppercase font-medium tracking-wider">Support</div>
              </div>
            </div>

            {/* Bottom Action Row: Overlapping Avatars & Video Play Button */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-8 mt-8 border-t border-[#2C2520]/12 dark:border-white/5">
              {/* Overlapping User Avatars */}
              <div className="flex items-center gap-3.5">
                <div className="flex -space-x-3 overflow-hidden p-0.5">
                  <div className="inline-block h-11 w-11 rounded-full ring-2 ring-[#E5E2DC] dark:ring-[#12100E] bg-[#DEDAD3] dark:bg-[#24201C] flex items-center justify-center text-xs font-bold text-[#D49624] dark:text-[#F5B83D] shadow-md">
                    JD
                  </div>
                  <div className="inline-block h-11 w-11 rounded-full ring-2 ring-[#E5E2DC] dark:ring-[#12100E] bg-[#D5D0C7] dark:bg-[#342b24] flex items-center justify-center text-xs font-bold text-[#2C2520] dark:text-white shadow-md">
                    MR
                  </div>
                  <div className="inline-block h-11 w-11 rounded-full ring-2 ring-[#E5E2DC] dark:ring-[#12100E] bg-[#CCC6BC] dark:bg-[#4a3b32] flex items-center justify-center text-xs font-bold text-[#8C6214] dark:text-amber-200 shadow-md">
                    AK
                  </div>
                  <div className="inline-block h-11 w-11 rounded-full ring-2 ring-[#E5E2DC] dark:ring-[#12100E] bg-[#D49624] dark:bg-[#F5B83D] flex items-center justify-center text-xs font-bold text-black shadow-md">
                    +5k
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#2C2520] dark:text-white leading-tight">5,000+ Businesses</span>
                  <span className="text-xs text-[#6E665E] dark:text-neutral-500">Trust IGL Group &amp; Felna</span>
                </div>
              </div>

              {/* Play Button: WATCH INTRO */}
              <div
                role="button"
                tabIndex={0}
                className="flex items-center gap-4 group cursor-pointer text-sm font-bold text-[#3D3630] dark:text-neutral-300 hover:text-[#2C2520] dark:hover:text-white uppercase tracking-wider transition-colors select-none"
              >
                <div className="w-12 h-12 rounded-full border border-[#D49624]/50 dark:border-[#F5B83D]/50 bg-[#D49624]/10 dark:bg-[#F5B83D]/10 flex items-center justify-center text-[#D49624] dark:text-[#F5B83D] group-hover:bg-[#D49624] dark:group-hover:bg-[#F5B83D] group-hover:text-black group-hover:border-[#D49624] dark:group-hover:border-[#F5B83D] group-hover:scale-105 transition-all shadow-md shadow-[#D49624]/10 dark:shadow-[#F5B83D]/10">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <span>Watch Intro</span>
              </div>
            </div>

          </div>

        </div>

        {/* =============================================================== */}
        {/* 4. Our Values Section                                            */}
        {/* =============================================================== */}
        <OurValues />
      </main>

      {/* Sticky Mobile Quick Action Bar */}
      <MobileBottomBar />
    </div>
  );
}
