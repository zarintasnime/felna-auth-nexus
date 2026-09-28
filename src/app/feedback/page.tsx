import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Star,
  Clock,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  Sparkles,
  MessageSquareHeart,
} from "lucide-react";
import TopBar from "@/components/home/TopBar";
import DynamicNavbar from "@/components/home/DynamicNavbar";
import MobileBottomBar from "@/components/home/MobileBottomBar";
import Footer from "@/components/home/Footer";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import { getSession } from "@/lib/auth";
import { getHomePageData } from "@/lib/services/homepage-service";

export const metadata: Metadata = {
  title: "Feedback & Inquiries | Felna.com & IGL Group",
  description:
    "We value your feedback. Rate your experience and send us your thoughts or inquiries to help us continuously improve our Bulk SMS and IT solutions.",
};

export default async function FeedbackPage() {
  const [session, homeData] = await Promise.all([
    getSession(),
    getHomePageData(),
  ]);

  return (
    <div className="min-h-screen bg-[#12100E] text-[#fcfbf9] flex flex-col justify-between selection:bg-[#4a3b32] selection:text-[#fcfbf9] relative overflow-hidden">
      {/* Background Ambient Radial Amber Glows */}
      <div
        className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#F5B83D]/5 blur-[140px] rounded-full pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 left-0 w-[450px] h-[450px] bg-[#F5B83D]/5 blur-[140px] rounded-full pointer-events-none"
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
      <main className="flex-1 w-full pt-8 md:pt-14 pb-24 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-8 sm:mb-12"
          >
            <Link href="/" className="hover:text-[#F5B83D] transition-colors">
              Home
            </Link>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-400">Contact Us</span>
            <span className="text-neutral-600">/</span>
            <span className="text-[#F5B83D] font-semibold">Feedback</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* ============================================================= */}
            {/* Left Column: Context, Reviews & Direct Channels               */}
            {/* ============================================================= */}
            <div className="flex flex-col">
              {/* Small Tag */}
              <div className="flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#F5B83D]/10 text-[#F5B83D] border border-[#F5B83D]/25 mb-6 w-fit shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5B83D] animate-pulse" />
                <span>We Value Your Opinion</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
                Share Your <span className="text-[#F5B83D]">Feedback.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-[#B9B0A5] text-base sm:text-lg mb-10 leading-relaxed font-normal">
                Help us shape the future of Felna SMS Gateway and IGL Group.
                Whether you have praise, an inquiry, or ideas on how we can serve
                your business better, our executive and engineering teams review
                every submission.
              </p>

              {/* Trust & Channels Grid (2x2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                {/* Item 1: High Customer Satisfaction */}
                <div className="p-5 rounded-2xl bg-[#1B1815] border border-white/5 shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-[#24201C] border border-white/10 flex items-center justify-center text-[#F5B83D] mb-3">
                    <Star className="w-5 h-5 fill-[#F5B83D] text-[#F5B83D]" />
                  </div>
                  <div className="text-xl font-extrabold text-white">4.9 / 5.0</div>
                  <p className="text-neutral-400 text-xs mt-1">
                    Average satisfaction score from 1,200+ business clients.
                  </p>
                </div>

                {/* Item 2: Prompt Response SLA */}
                <div className="p-5 rounded-2xl bg-[#1B1815] border border-white/5 shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-[#24201C] border border-white/10 flex items-center justify-center text-[#F5B83D] mb-3">
                    <Clock className="w-5 h-5 text-[#F5B83D]" />
                  </div>
                  <div className="text-xl font-extrabold text-white">&lt; 24 Hours</div>
                  <p className="text-neutral-400 text-xs mt-1">
                    All suggestions and inquiries are reviewed by our leaders.
                  </p>
                </div>

                {/* Item 3: Direct Phone */}
                <a
                  href="tel:+8801958666999"
                  className="group p-5 rounded-2xl bg-[#1B1815] border border-white/5 hover:border-[#F5B83D]/30 transition-all duration-300 shadow-md block"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#24201C] border border-white/10 flex items-center justify-center text-[#F5B83D] mb-3 group-hover:scale-110 group-hover:bg-[#F5B83D]/15 transition-all">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-neutral-500 text-xs font-medium block">
                    Urgent Inquiry?
                  </span>
                  <span className="text-white font-semibold text-sm mt-0.5 group-hover:text-[#F5B83D] transition-colors block">
                    +880-1958-666999
                  </span>
                </a>

                {/* Item 4: Visit Offices */}
                <Link
                  href="/address"
                  className="group p-5 rounded-2xl bg-[#1B1815] border border-white/5 hover:border-[#F5B83D]/30 transition-all duration-300 shadow-md block"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#24201C] border border-white/10 flex items-center justify-center text-[#F5B83D] mb-3 group-hover:scale-110 group-hover:bg-[#F5B83D]/15 transition-all">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-neutral-500 text-xs font-medium block">
                    Our Offices
                  </span>
                  <span className="text-[#F5B83D] font-semibold text-sm mt-0.5 flex items-center gap-1 group-hover:underline">
                    <span>Dhaka &amp; Chittagong</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </div>
            </div>

            {/* ============================================================= */}
            {/* Right Column: Interactive Feedback Form                       */}
            {/* ============================================================= */}
            <div className="w-full">
              <FeedbackForm />
            </div>
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
