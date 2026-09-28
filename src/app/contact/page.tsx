import React from "react";
import type { Metadata } from "next";
import {
  Phone,
  LifeBuoy,
  Briefcase,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import TopBar from "@/components/home/TopBar";
import DynamicNavbar from "@/components/home/DynamicNavbar";
import MobileBottomBar from "@/components/home/MobileBottomBar";
import Footer from "@/components/home/Footer";
import ContactForm from "@/components/contact/ContactForm";
import { getSession } from "@/lib/auth";
import { getHomePageData } from "@/lib/services/homepage-service";

export const metadata: Metadata = {
  title: "Contact Us | Felna.com & IGL Group",
  description:
    "Ready to help you! We're here to help and answer any question you might have about our Bulk SMS and IT solutions.",
};

export default async function ContactPage() {
  const [session, homeData] = await Promise.all([
    getSession(),
    getHomePageData(),
  ]);

  return (
    <div className="min-h-screen bg-[#12100E] text-[#fcfbf9] flex flex-col justify-between selection:bg-[#4a3b32] selection:text-[#fcfbf9] relative overflow-hidden">
      {/* Background Faint Radial Amber Glow */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F5B83D]/5 blur-[120px] rounded-full pointer-events-none"
        aria-hidden="true"
      />
      {/* Subtle Dotted Grid Pattern */}
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
        aria-hidden="true"
      />

      {/* =================================================================== */}
      {/* 1. Header Card Wrapper (TopBar + DynamicNavbar)                     */}
      {/* =================================================================== */}
      <header className="w-full relative z-20">
        <div className="w-[98%] 2xl:w-[98.5%] max-w-[1880px] mx-auto my-3 md:my-5 rounded-2xl md:rounded-3xl overflow-hidden border border-neutral-800/60 bg-[#201915] shadow-2xl shadow-black/60 relative">
          <TopBar />
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
      {/* 2. Main Content Area (Split Grid Layout)                            */}
      {/* =================================================================== */}
      <main className="flex-1 w-full pt-10 md:pt-16 pb-24 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* =============================================================== */}
          {/* Left Column: Contact Information (Dynamic & Premium)            */}
          {/* =============================================================== */}
          <div className="flex flex-col">
            {/* Small Tag */}
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#F5B83D]/10 text-[#F5B83D] border border-[#F5B83D]/25 mb-6 w-fit shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5B83D] animate-pulse" />
              <span>Let&apos;s work together</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
              Ready to <span className="text-[#F5B83D]">help you!</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[#B9B0A5] text-base sm:text-lg mb-12 leading-relaxed max-w-lg font-normal">
              We&apos;re here to help and answer any question you might have. Reach out to our team directly through any of our channels.
            </p>

            {/* Contact Grid (2x2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Item 1: Call us directly? */}
              <a
                href="tel:+8801958666999"
                className="group flex flex-col p-6 rounded-2xl bg-[#1B1815] border border-white/5 hover:border-[#F5B83D]/30 hover:-translate-y-1 transition-all duration-300 shadow-md block"
              >
                <div className="w-12 h-12 bg-white/5 text-[#F5B83D] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#F5B83D]/15 transition-all">
                  <Phone className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-neutral-500 text-sm font-medium">
                  Call us directly?
                </span>
                <span className="text-white font-semibold text-base mt-1 group-hover:text-[#F5B83D] transition-colors">
                  +880-1958-666999
                </span>
              </a>

              {/* Item 2: Need live support? */}
              <a
                href="mailto:services@iglgroup.org"
                className="group flex flex-col p-6 rounded-2xl bg-[#1B1815] border border-white/5 hover:border-[#F5B83D]/30 hover:-translate-y-1 transition-all duration-300 shadow-md block"
              >
                <div className="w-12 h-12 bg-white/5 text-[#F5B83D] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#F5B83D]/15 transition-all">
                  <LifeBuoy className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-neutral-500 text-sm font-medium">
                  Need live support?
                </span>
                <span className="text-white font-semibold text-base mt-1 group-hover:text-[#F5B83D] transition-colors break-all">
                  services@iglgroup.org
                </span>
              </a>

              {/* Item 3: Join growing team? */}
              <a
                href="mailto:careers@iglgroup.org"
                className="group flex flex-col p-6 rounded-2xl bg-[#1B1815] border border-white/5 hover:border-[#F5B83D]/30 hover:-translate-y-1 transition-all duration-300 shadow-md block"
              >
                <div className="w-12 h-12 bg-white/5 text-[#F5B83D] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#F5B83D]/15 transition-all">
                  <Briefcase className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-neutral-500 text-sm font-medium">
                  Join growing team?
                </span>
                <span className="text-white font-semibold text-base mt-1 group-hover:text-[#F5B83D] transition-colors break-all">
                  careers@iglgroup.org
                </span>
              </a>

              {/* Item 4: Visit headquarters? */}
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-6 rounded-2xl bg-[#1B1815] border border-white/5 hover:border-[#F5B83D]/30 hover:-translate-y-1 transition-all duration-300 shadow-md block"
              >
                <div className="w-12 h-12 bg-white/5 text-[#F5B83D] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#F5B83D]/15 transition-all">
                  <MapPin className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-neutral-500 text-sm font-medium">
                  Visit headquarters?
                </span>
                <span className="text-[#F5B83D] font-semibold text-base mt-1 flex items-center gap-1.5 group-hover:underline">
                  <span>View on google map</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </div>
          </div>

          {/* =============================================================== */}
          {/* Right Column: The Form (Sleek & Interactive)                    */}
          {/* =============================================================== */}
          <div className="w-full">
            <ContactForm />
          </div>

        </div>
      </main>

      {/* =================================================================== */}
      {/* 3. Universal Footer                                                 */}
      {/* =================================================================== */}
      <Footer />

      {/* Sticky Mobile Quick Action Bar */}
      <MobileBottomBar />
    </div>
  );
}
