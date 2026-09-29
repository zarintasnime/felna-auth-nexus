import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  ArrowUpRight,
  Building2,
  Clock,
  Sparkles,
  MessageSquare,
  Compass,
} from "lucide-react";
import TopBar from "@/components/home/TopBar";
import DynamicNavbar from "@/components/home/DynamicNavbar";
import MobileBottomBar from "@/components/home/MobileBottomBar";
import Footer from "@/components/home/Footer";
import { getSession } from "@/lib/auth";
import { getHomePageData } from "@/lib/services/homepage-service";
import { getCmsSiteSettings, getCmsSocialLinks } from "@/lib/services/cms-service";

export const metadata: Metadata = {
  title: "Office Address & Locations | Felna.com",
  description:
    "Find our Dhaka and Chittagong office locations. Get in touch with Felna.com for carrier-grade Bulk SMS, OTP gateways, and enterprise IT solutions.",
};

export default async function AddressPage() {
  const [session, homeData, settings, socialLinks] = await Promise.all([
    getSession(),
    getHomePageData(),
    getCmsSiteSettings(),
    getCmsSocialLinks(true),
  ]);

  return (
    <div className="min-h-screen bg-[#12100E] text-[#fcfbf9] flex flex-col justify-between selection:bg-[#4a3b32] selection:text-[#fcfbf9] relative overflow-hidden">
      {/* Background Ambient Radial Amber Glows */}
      <div
        className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#F5B83D]/5 blur-[140px] rounded-full pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-[#F5B83D]/5 blur-[140px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Dotted Grid Texture */}
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
        aria-hidden="true"
      />

      {/* =================================================================== */}
      {/* 1. Boxed Header Card Wrapper (TopBar + DynamicNavbar)               */}
      {/* =================================================================== */}
      <header className="w-full relative z-20">
        <div className="w-[98%] 2xl:w-[98.5%] max-w-[1880px] mx-auto my-3 md:my-5 rounded-2xl md:rounded-3xl border border-neutral-800/60 bg-[#201915] shadow-2xl shadow-black/60 relative z-30">
          <TopBar
            announcementText={settings.announcementText}
            announcementLinkText={settings.announcementLinkText}
            announcementHref={settings.announcementLinkUrl}
            scheduleText={settings.scheduleText}
            supportHref="/contact"
          />
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
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. Main Content Area                                                */}
      {/* =================================================================== */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 md:px-12 pt-8 md:pt-14 pb-24 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center justify-center gap-2 text-xs font-medium text-neutral-400 mb-8 sm:mb-12"
        >
          <Link href="/" className="hover:text-[#F5B83D] transition-colors">
            Home
          </Link>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-400">Contact Us</span>
          <span className="text-neutral-600">/</span>
          <span className="text-[#F5B83D] font-semibold">Address</span>
        </nav>

        {/* Hero Header Section */}
        <section className="text-center max-w-[1040px] mx-auto space-y-6">
          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#F5B83D]">
            <span className="w-8 sm:w-12 h-[2px] bg-[#F5B83D]" />
            <span>Let&apos;s work together</span>
            <span className="w-8 sm:w-12 h-[2px] bg-[#F5B83D]" />
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
            IGL GROUP<span className="text-[#F5B83D]">.</span>
          </h1>

          {/* Description Text (Rendered exactly as specified) */}
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal pt-2">
            At IGL Group, reaching out to us means gaining access to expert
            guidance, tailored IT solutions, and advanced software solutions
            designed to meet your unique business needs. Whether you&apos;re
            interested in learning more about our innovative products, need
            assistance with a project, or want to explore how we can address your
            specific challenges, we’re here to help. Contacting us gives you
            the opportunity to connect with a team that values your time and is
            committed to providing the best possible experience. We’re
            dedicated to answering your questions promptly and offering
            solutions that make a real difference. So, don’t hesitate to get in
            touch &mdash; we’re here to ensure your success and provide the
            support you need every step of the way.
          </p>
        </section>

        {/* =============================================================== */}
        {/* 3. Office Cards Grid (2-Column Responsive Layout)                */}
        {/* =============================================================== */}
        <section
          aria-label="Office Locations"
          className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
        >
          {/* ------------------------------------------------------------- */}
          {/* Card 1: Dhaka Office                                          */}
          {/* ------------------------------------------------------------- */}
          <div className="group relative bg-[#1B1815] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#F5B83D]/40 hover:shadow-[0_20px_50px_rgba(245,184,61,0.12)] flex flex-col justify-between overflow-hidden">
            {/* Top Amber Ambient Gradient inside card */}
            <div
              className="absolute -top-24 -right-24 w-64 h-64 bg-[#F5B83D]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#F5B83D]/20 transition-all duration-500"
              aria-hidden="true"
            />

            <div>
              {/* Card Header: Brand Logo & Type Badge */}
              <div className="flex items-start justify-between gap-4 mb-8">
                {/* Official Company Logo Tile */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#24201C] border border-white/10 p-2.5 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-[#F5B83D]/40 transition-all duration-300 shrink-0">
                  <Image
                    src="/images/logo/IGL_logo.png"
                    alt="IGL Group Logo"
                    width={72}
                    height={72}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#F5B83D]/15 text-[#F5B83D] border border-[#F5B83D]/30 shadow-xs">
                    <Sparkles className="w-3 h-3 text-[#F5B83D]" />
                    <span>Headquarters</span>
                  </span>
                  <span className="text-[11px] text-neutral-400 font-medium">
                    Dhaka Division
                  </span>
                </div>
              </div>

              {/* Office Title */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-[#F5B83D] transition-colors mb-6">
                Dhaka Office
              </h2>

              {/* Office Details */}
              <div className="space-y-6 text-sm">
                {/* Address Row */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#24201C]/60 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-[#24201C] border border-white/10 flex items-center justify-center text-[#F5B83D] shrink-0 shadow-xs">
                    <MapPin className="w-5 h-5 text-[#F5B83D]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5B83D]">
                      Office Address
                    </span>
                    <p className="text-neutral-200 font-medium leading-relaxed">
                      House # 33A(4th Floor), Road # 4, Dhanmondi, Dhaka-1205.
                    </p>
                  </div>
                </div>

                {/* Phone Numbers Row */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#24201C]/60 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-[#24201C] border border-white/10 flex items-center justify-center text-[#F5B83D] shrink-0 shadow-xs">
                    <Phone className="w-5 h-5 text-[#F5B83D]" />
                  </div>
                  <div className="space-y-1.5 w-full">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5B83D]">
                      Phone Numbers
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 font-mono text-sm">
                      <a
                        href="tel:+8801958666999"
                        className="text-neutral-200 hover:text-[#F5B83D] transition-colors underline-offset-4 hover:underline flex items-center gap-1.5"
                      >
                        <span>+880-1958-666999</span>
                      </a>
                      <span className="hidden sm:inline text-neutral-600">&bull;</span>
                      <a
                        href="tel:+880255166666"
                        className="text-neutral-200 hover:text-[#F5B83D] transition-colors underline-offset-4 hover:underline flex items-center gap-1.5"
                      >
                        <span>+880-2-5516-6666</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Working Hours Info */}
                <div className="flex items-center gap-3 px-4 py-2.5 text-xs text-neutral-400">
                  <Clock className="w-4 h-4 text-[#F5B83D] shrink-0" />
                  <span>Sunday &ndash; Thursday: 9:00 AM &ndash; 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Clickable VIEW MAP Button */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <a
                href="https://www.google.com/maps/search/?api=1&query=House+33A,+Road+4,+Dhanmondi,+Dhaka-1205"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full py-4 px-6 rounded-2xl bg-[#24201C] hover:bg-[#F5B83D] text-[#F5B83D] hover:text-black font-bold text-sm tracking-wider uppercase border border-[#F5B83D]/30 hover:border-[#F5B83D] shadow-lg hover:shadow-[0_0_30px_rgba(245,184,61,0.35)] transition-all duration-300 group/btn active:scale-[0.99]"
              >
                <Compass className="w-4 h-4 text-[#F5B83D] group-hover/btn:text-black transition-colors" />
                <span>View Map</span>
                <ArrowUpRight className="w-4 h-4 text-[#F5B83D] group-hover/btn:text-black transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Card 2: Chittagong Office                                     */}
          {/* ------------------------------------------------------------- */}
          <div className="group relative bg-[#1B1815] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#F5B83D]/40 hover:shadow-[0_20px_50px_rgba(245,184,61,0.12)] flex flex-col justify-between overflow-hidden">
            {/* Top Amber Ambient Gradient inside card */}
            <div
              className="absolute -top-24 -right-24 w-64 h-64 bg-[#F5B83D]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#F5B83D]/20 transition-all duration-500"
              aria-hidden="true"
            />

            <div>
              {/* Card Header: Brand Logo & Type Badge */}
              <div className="flex items-start justify-between gap-4 mb-8">
                {/* Official Brand Logo / Icon Tile */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#24201C] border border-white/10 p-2.5 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-[#F5B83D]/40 transition-all duration-300 shrink-0">
                  <Image
                    src="/images/logo/felna-tech-logo.png"
                    alt="Felna Tech Chittagong Logo"
                    width={72}
                    height={72}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/5 text-neutral-300 border border-white/10 shadow-xs">
                    <Building2 className="w-3 h-3 text-[#F5B83D]" />
                    <span>Regional Branch</span>
                  </span>
                  <span className="text-[11px] text-neutral-400 font-medium">
                    Chittagong Division
                  </span>
                </div>
              </div>

              {/* Office Title */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-[#F5B83D] transition-colors mb-6">
                Chittagong Office
              </h2>

              {/* Office Details */}
              <div className="space-y-6 text-sm">
                {/* Address Row */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#24201C]/60 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-[#24201C] border border-white/10 flex items-center justify-center text-[#F5B83D] shrink-0 shadow-xs">
                    <MapPin className="w-5 h-5 text-[#F5B83D]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5B83D]">
                      Office Address
                    </span>
                    <p className="text-neutral-200 font-medium leading-relaxed">
                      House-201(4B), KY Tower, Gulbag R/A - 2, Agrabad Access Road, Halishahar, Chittagong.
                    </p>
                  </div>
                </div>

                {/* Phone Numbers Row */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#24201C]/60 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-[#24201C] border border-white/10 flex items-center justify-center text-[#F5B83D] shrink-0 shadow-xs">
                    <Phone className="w-5 h-5 text-[#F5B83D]" />
                  </div>
                  <div className="space-y-1.5 w-full">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5B83D]">
                      Phone Numbers
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 font-mono text-sm">
                      <a
                        href="tel:+8801958666999"
                        className="text-neutral-200 hover:text-[#F5B83D] transition-colors underline-offset-4 hover:underline flex items-center gap-1.5"
                      >
                        <span>+880-1958-666999</span>
                      </a>
                      <span className="hidden sm:inline text-neutral-600">&bull;</span>
                      <a
                        href="tel:+8802333320999"
                        className="text-neutral-200 hover:text-[#F5B83D] transition-colors underline-offset-4 hover:underline flex items-center gap-1.5"
                      >
                        <span>+880-2-3333-20999</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Working Hours Info */}
                <div className="flex items-center gap-3 px-4 py-2.5 text-xs text-neutral-400">
                  <Clock className="w-4 h-4 text-[#F5B83D] shrink-0" />
                  <span>Sunday &ndash; Thursday: 9:00 AM &ndash; 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Clickable VIEW MAP Button */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <a
                href="https://www.google.com/maps/search/?api=1&query=KY+Tower,+Gulbag+R%2FA+-+2,+Agrabad+Access+Road,+Halishahar,+Chittagong"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full py-4 px-6 rounded-2xl bg-[#24201C] hover:bg-[#F5B83D] text-[#F5B83D] hover:text-black font-bold text-sm tracking-wider uppercase border border-[#F5B83D]/30 hover:border-[#F5B83D] shadow-lg hover:shadow-[0_0_30px_rgba(245,184,61,0.35)] transition-all duration-300 group/btn active:scale-[0.99]"
              >
                <Compass className="w-4 h-4 text-[#F5B83D] group-hover/btn:text-black transition-colors" />
                <span>View Map</span>
                <ArrowUpRight className="w-4 h-4 text-[#F5B83D] group-hover/btn:text-black transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* 4. Bottom Support Strip & Contact CTA                            */}
        {/* =============================================================== */}
        <section className="mt-16 md:mt-24 p-8 sm:p-10 rounded-3xl bg-[#1B1815] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Looking for tailored SMS solutions or technical support?
            </h3>
            <p className="text-sm text-neutral-400">
              Our engineering and sales team is available 24/7 to assist your business integration.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <Link
              href="/feedback"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#F5B83D] hover:bg-[#e5aa32] text-black font-bold text-sm transition-all shadow-md shadow-[#F5B83D]/20 active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Feedback</span>
            </Link>
            <a
              href="tel:+8801958666999"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#24201C] hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-all active:scale-[0.98]"
            >
              <Phone className="w-4 h-4 text-[#F5B83D]" />
              <span>Direct Call</span>
            </a>
          </div>
        </section>
      </main>

      {/* =================================================================== */}
      {/* Universal Footer */}
      {/* =================================================================== */}
      <Footer settings={settings} socialLinks={socialLinks} />

      {/* Sticky Mobile Quick Action Bar */}
      <MobileBottomBar />
    </div>
  );
}
