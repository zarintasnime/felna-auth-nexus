import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Code2,
  Cpu,
  Layers,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Globe,
  CheckCircle2,
  Server,
  Zap,
} from "lucide-react";
import TopBar from "@/components/home/TopBar";
import DynamicNavbar from "@/components/home/DynamicNavbar";
import MobileBottomBar from "@/components/home/MobileBottomBar";
import { getSession } from "@/lib/auth";
import { getHomePageData } from "@/lib/services/homepage-service";
import { getCmsSiteSettings } from "@/lib/services/cms-service";

export const metadata: Metadata = {
  title: "IGL Web | Sister Concern of IGL Group",
  description:
    "IGL Web stands for Ideal Growing List, a dynamic software-based company specializing in IT, web development, and digital transformation.",
};

export default async function IglWebPage() {
  const [session, homeData, settings] = await Promise.all([
    getSession(),
    getHomePageData(),
    getCmsSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#12100E] text-[#2C2520] dark:text-[#fcfbf9] flex flex-col justify-between selection:bg-[#D49624]/20 dark:selection:bg-[#4a3b32] selection:text-[#2C2520] dark:selection:text-[#fcfbf9] transition-colors">
      {/* =================================================================== */}
      {/* 1. Header Card Wrapper (TopBar + DynamicNavbar)                     */}
      {/* =================================================================== */}
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
      {/* 2. Main Content Area: Simplified & Clean Showcase                   */}
      {/* =================================================================== */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#6E665E] dark:text-neutral-400">
          <Link href="/" className="hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#6E665E]/70 dark:text-neutral-500">Sister Concern</span>
          <span>/</span>
          <span className="text-[#D49624] dark:text-[#F5B83D] font-medium">IGL Web</span>
        </nav>

        {/* Hero Showcase Card */}
        <section className="relative overflow-hidden rounded-3xl bg-[#E8E4DD] dark:bg-[#1B1815] border border-[#2C2520]/15 dark:border-white/10 p-8 sm:p-12 lg:p-16 shadow-xl dark:shadow-2xl transition-colors">
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute -top-24 -right-24 w-96 h-96 bg-[#D49624]/10 dark:bg-[#F5B83D]/10 rounded-full blur-[100px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Brand Logo Display */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start justify-center">
              <div className="relative w-full max-w-[340px] aspect-16/9 rounded-2xl bg-[#E5E2DC] dark:bg-[#24201C] border border-[#2C2520]/15 dark:border-white/10 p-6 flex items-center justify-center shadow-xl group hover:border-[#D49624]/40 dark:hover:border-[#F5B83D]/30 transition-all duration-300">
                <img
                  src="/images/logo/IGLWeb-logo.png"
                  alt="IGL Web Logo"
                  className="w-full h-auto max-h-[90px] object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4 flex items-center gap-2 text-[#6E665E] dark:text-neutral-400 text-xs">
                <Globe className="w-3.5 h-3.5 text-[#D49624] dark:text-[#F5B83D]" />
                <a
                  href="https://iglweb.com/web/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors underline underline-offset-4"
                >
                  iglweb.com/web
                </a>
              </div>
            </div>

            {/* Right Column: Information & Actions */}
            <div className="lg:col-span-8 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#D49624]/10 dark:bg-[#F5B83D]/10 text-[#D49624] dark:text-[#F5B83D] border border-[#D49624]/30 dark:border-[#F5B83D]/30 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D49624] dark:text-[#F5B83D]" />
                <span>Sister Concern of IGL Group</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2C2520] dark:text-white tracking-tight leading-tight">
                IGL Web
              </h1>

              <p className="text-[#3D3630] dark:text-neutral-300 text-base sm:text-lg leading-relaxed font-normal">
                IGL Web stands for Ideal Growing List, a dynamic software-based company committed to
                delivering innovative solutions. Based on a foundation of excellence and driven by a
                passion for technology, IGL Web specializes in managing and executing a wide range
                of IT and software projects. At IGL Web, our mission is to foster digital
                transformation by offering expert guidance and effective solutions that propel
                success in an ever-changing technological landscape.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="https://iglweb.com/web/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#D49624] dark:bg-[#F5B83D] hover:bg-[#c2861b] dark:hover:bg-[#e5aa32] text-[#1B1815] dark:text-black font-bold text-sm sm:text-base rounded-full shadow-lg shadow-[#D49624]/20 dark:shadow-[#F5B83D]/25 transition-all duration-300 active:scale-[0.98]"
                >
                  <span>Visit Site For More Info</span>
                  <ExternalLink className="w-4 h-4 text-[#1B1815] dark:text-black" />
                </a>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-[#2C2520]/20 dark:border-white/10 hover:border-[#2C2520]/40 dark:hover:border-white/20 bg-[#2C2520]/5 dark:bg-white/5 hover:bg-[#2C2520]/10 dark:hover:bg-white/10 text-[#2C2520] dark:text-white font-medium text-sm sm:text-base transition-all"
                >
                  <span>Contact Felna Group</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Pillar Simplified Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Software & Web Solutions */}
          <div className="p-8 rounded-3xl bg-[#E8E4DD] dark:bg-[#1B1815] border border-[#2C2520]/15 dark:border-white/10 shadow-lg dark:shadow-xl space-y-4 hover:border-[#D49624]/40 dark:hover:border-[#F5B83D]/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#D49624]/10 dark:bg-[#F5B83D]/10 text-[#D49624] dark:text-[#F5B83D] flex items-center justify-center">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#2C2520] dark:text-white">Software & Web Solutions</h3>
            <p className="text-sm text-[#6E665E] dark:text-neutral-400 leading-relaxed">
              Custom software engineering, high-throughput web applications, and enterprise web
              portals tailored precisely to business workflows.
            </p>
          </div>

          {/* Card 2: End-to-End IT Execution */}
          <div className="p-8 rounded-3xl bg-[#E8E4DD] dark:bg-[#1B1815] border border-[#2C2520]/15 dark:border-white/10 shadow-lg dark:shadow-xl space-y-4 hover:border-[#D49624]/40 dark:hover:border-[#F5B83D]/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#D49624]/10 dark:bg-[#F5B83D]/10 text-[#D49624] dark:text-[#F5B83D] flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#2C2520] dark:text-white">End-to-End IT Execution</h3>
            <p className="text-sm text-[#6E665E] dark:text-neutral-400 leading-relaxed">
              Seamless management of tech projects from architecture and UI/UX design to robust
              QA, production deployment, and maintenance.
            </p>
          </div>

          {/* Card 3: Digital Transformation */}
          <div className="p-8 rounded-3xl bg-[#E8E4DD] dark:bg-[#1B1815] border border-[#2C2520]/15 dark:border-white/10 shadow-lg dark:shadow-xl space-y-4 hover:border-[#D49624]/40 dark:hover:border-[#F5B83D]/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#D49624]/10 dark:bg-[#F5B83D]/10 text-[#D49624] dark:text-[#F5B83D] flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#2C2520] dark:text-white">Digital Transformation</h3>
            <p className="text-sm text-[#6E665E] dark:text-neutral-400 leading-relaxed">
              Strategic consulting and technological solutions that empower organizations to
              accelerate operational efficiency and scale sustainably.
            </p>
          </div>
        </section>

        {/* Clean Outbound Portal Card */}
        <section className="rounded-3xl bg-gradient-to-br from-[#E8E4DD] to-[#E5E2DC] dark:from-[#201915] dark:to-[#16120F] border border-[#2C2520]/15 dark:border-white/10 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl transition-colors">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-[#2C2520] dark:text-white">
              Accelerate your business with IGL Web
            </h3>
            <p className="text-sm text-[#6E665E] dark:text-neutral-400 max-w-xl">
              Discover cutting-edge web design, software development, domain registration, and hosting
              solutions built to propel your growth.
            </p>
          </div>
          <a
            href="https://iglweb.com/web/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#D49624] dark:bg-[#F5B83D] hover:bg-[#c2861b] dark:hover:bg-[#e5aa32] text-[#1B1815] dark:text-black font-bold text-sm rounded-full shrink-0 shadow-md transition-all active:scale-[0.98]"
          >
            <span>Visit iglweb.com/web</span>
            <ExternalLink className="w-4 h-4 text-[#1B1815] dark:text-black" />
          </a>
        </section>
      </main>

      {/* Floating Bottom Bar for Mobile Devices */}
      <MobileBottomBar />
    </div>
  );
}
