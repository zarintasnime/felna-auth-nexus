import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Shield,
  LayoutDashboard,
  Users,
  MapPin,
  KeyRound,
  Sparkles,
  Lock,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import DynamicNavbar from "@/components/home/DynamicNavbar";
import { getSession } from "@/lib/auth";
import { getHomePageData } from "@/lib/services/homepage-service";

export default async function HomePage() {
  const [session, homeData] = await Promise.all([
    getSession(),
    getHomePageData(),
  ]);

  return (
    <div className="min-h-screen bg-[#f4f0e6] text-stone-800 flex flex-col justify-between selection:bg-[#4a3b32] selection:text-[#fcfbf9]">
      {/* Dynamic Frosted Navbar with Dynamic Links & Auth State */}
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

      {/* Main Content Area */}
      <main className="flex-1">
        {/* ================================================================= */}
        {/* Hero Section - Clean, Centered, Spacious & Minimalist */}
        {/* ================================================================= */}
        <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#d4ccc0]">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Pill Tag / Kicker Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#ebe5da] text-[#4a3b32] border border-[#d4ccc0] shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4a3b32]" />
              <span>Felna Identity & Role-Based Access</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#4a3b32] max-w-3xl mx-auto leading-[1.16]">
              Felna Portal: Secure Role-Based Authentication
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed font-normal">
              A refined credentials platform offering seamless dual-mode password and mobile OTP login,
              cascading Bangladesh geographic profiling, and enterprise-grade administrative controls.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#4a3b32] hover:bg-[#3d3028] text-[#fcfbf9] font-semibold text-sm rounded-xl shadow-sm shadow-[#4a3b32]/25 transition hover:scale-[1.01]"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#fcfbf9]" />
                    <span>Go to Member Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-[#fcfbf9]" />
                  </Link>

                  {session.role === "ADMIN" && (
                    <Link
                      href="/admin/dashboard"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent hover:bg-[#ebe5da]/60 text-[#4a3b32] border-2 border-[#4a3b32] font-semibold text-sm rounded-xl transition hover:scale-[1.01]"
                    >
                      <Shield className="w-4 h-4 text-[#4a3b32]" />
                      <span>Open Admin Console</span>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#4a3b32] hover:bg-[#3d3028] text-[#fcfbf9] font-semibold text-sm rounded-xl shadow-sm shadow-[#4a3b32]/25 transition hover:scale-[1.01]"
                  >
                    <KeyRound className="w-4 h-4 text-[#fcfbf9]" />
                    <span>Go to Portal</span>
                    <ArrowRight className="w-4 h-4 text-[#fcfbf9]" />
                  </Link>

                  <a
                    href="#features"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent hover:bg-[#ebe5da]/60 text-[#4a3b32] border-2 border-[#4a3b32] font-semibold text-sm rounded-xl transition hover:scale-[1.01]"
                  >
                    <span>Learn More</span>
                    <ChevronRight className="w-4 h-4 text-[#4a3b32]" />
                  </a>
                </>
              )}
            </div>

            {/* Quick Vintage Highlight Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-8 max-w-3xl mx-auto text-left">
              <div className="p-4 rounded-2xl bg-[#fcfbf9] border border-[#d4ccc0] shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ebe5da] text-[#4a3b32] border border-[#d4ccc0] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-[#4a3b32]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#4a3b32] leading-tight">Instant OTP Auth</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">Password & 6-Digit SMS</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#fcfbf9] border border-[#d4ccc0] shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ebe5da] text-[#4a3b32] border border-[#d4ccc0] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#4a3b32]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#4a3b32] leading-tight">Cascading BD Geo</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">Divisions, Districts & Thanas</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#fcfbf9] border border-[#d4ccc0] shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ebe5da] text-[#4a3b32] border border-[#d4ccc0] flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-[#4a3b32]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#4a3b32] leading-tight">Role-Based Access</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">Admin & User RBAC</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* Feature Cards Section */}
        {/* ================================================================= */}
        <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-16">
          <div className="text-center space-y-2 mb-12">
            <span className="text-[11px] font-bold text-[#4a3b32] uppercase tracking-widest px-3 py-1 bg-[#ebe5da] rounded-full border border-[#d4ccc0]">
              Architecture & Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#4a3b32]">
              Engineered for Security, Precision & Trust
            </h2>
            <p className="text-sm text-stone-600 max-w-xl mx-auto">
              Built on Next.js, Neon Serverless PostgreSQL, and Cryptographic JWT Sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#fcfbf9] border border-[#d4ccc0] shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#ebe5da] text-[#4a3b32] flex items-center justify-center border border-[#d4ccc0] shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-[#4a3b32]" />
              </div>
              <h3 className="font-bold text-base text-[#4a3b32]">
                Unified Credential Hub
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Single-page authentication with instant tab-switching between Sign In and Registration.
                Supports credential hashing, tamper-safe sessions, and 6-digit phone verification.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#fcfbf9] border border-[#d4ccc0] shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#ebe5da] text-[#4a3b32] flex items-center justify-center border border-[#d4ccc0] shadow-2xs">
                <MapPin className="w-5 h-5 text-[#4a3b32]" />
              </div>
              <h3 className="font-bold text-base text-[#4a3b32]">
                Bangladesh Geographic Engine
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Real-time cascading dropdowns for 8 Divisions, 64 Districts, and Upazilas/Thanas
                with automated relational querying and localized address validation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#fcfbf9] border border-[#d4ccc0] shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#ebe5da] text-[#4a3b32] flex items-center justify-center border border-[#d4ccc0] shadow-2xs">
                <Users className="w-5 h-5 text-[#4a3b32]" />
              </div>
              <h3 className="font-bold text-base text-[#4a3b32]">
                Admin Console & RBAC
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Real-time role-based access control with live user search, role toggling (USER / ADMIN),
                account suspension, and metric analytics counters.
              </p>
            </div>
          </div>

          {/* Standards & Security Overview Banner */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#fcfbf9] border border-[#d4ccc0] shadow-sm space-y-4">
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
                  <p className="text-stone-600 mt-0.5">Serverless pooled database with SSL connection verification.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#4a3b32] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800">Cryptographic OTP:</span>
                  <p className="text-stone-600 mt-0.5">SHA-256 OTP hashing with timingSafeEqual and lockout defenses.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#4a3b32] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800">Stateless JWT Cookies:</span>
                  <p className="text-stone-600 mt-0.5">HTTP-only signed cookies verified through Edge Middleware.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================================================================= */}
      {/* Footer */}
      {/* ================================================================= */}
      <footer className="border-t border-[#d4ccc0] py-8 px-4 bg-[#f4f0e6] text-center text-xs text-stone-600">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#4a3b32] text-[#fcfbf9] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#fcfbf9]" />
            </div>
            <span className="font-bold text-[#4a3b32]">Felna.com</span>
            <span>&mdash; Secure Role-Based Authentication System</span>
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
              &copy; {new Date().getFullYear()} Felna Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
