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
  Zap,
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-slate-200 text-slate-800 flex flex-col justify-between">
      {/* Universal Top Header */}
      <Navbar
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
        {/* Hero Section - Corporate Neutral Slate-200 with Soft Gradient Depth */}
        <section className="relative overflow-hidden py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-300/80 bg-gradient-to-b from-slate-200 via-slate-200/90 to-slate-300/40">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/80 text-sky-800 border border-slate-300 shadow-xs backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Felna Identity & Role-Based Access</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.15]">
              Seamless Authentication &{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Role Management
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Unified credentials portal with dual-mode password and mobile OTP login,
              geographic cascading profiling, and high-performance administrative controls.
            </p>

            {/* Dynamic Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/25 transition-all hover:scale-[1.01]"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Go to Member Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {session.role === "ADMIN" && (
                    <Link
                      href="/admin/dashboard"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-purple-600/25 transition-all hover:scale-[1.01]"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Open Admin Console</span>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/25 transition-all hover:scale-[1.01]"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 shadow-sm transition-all hover:scale-[1.01]"
                  >
                    <span>Create New Account</span>
                  </Link>
                </>
              )}
            </div>

            {/* Quick Gradient Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 max-w-3xl mx-auto text-left">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Instant OTP Auth</div>
                  <div className="text-[11px] text-purple-100 mt-0.5">Password & 6-Digit SMS</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Cascading BD Geo</div>
                  <div className="text-[11px] text-cyan-100 mt-0.5">Divisions, Districts & Thanas</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Role-Based Control</div>
                  <div className="text-[11px] text-emerald-100 mt-0.5">Admin & User RBAC</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Section - Clean White Cards with Soft Shadows on Slate-200 */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Engineered for Speed, Precision & Security
            </h2>
            <p className="text-sm text-slate-600">
              Built on Next.js, Neon Serverless PostgreSQL, and Cryptographic JWT Sessions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-300/80 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/80 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Unified Credential Hub
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Single-page authentication with instant tab-switching between Sign In and Registration.
                Supports both password credentials and 6-digit phone OTP verification.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-300/80 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200/80 shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Bangladesh Geographic Engine
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time cascading dropdowns for 8 Divisions, 64 Districts, and Upazilas/Thanas
                with automated relational querying and localized address validation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-300/80 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Admin Console & RBAC
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time role-based access control with live user search, role toggling (USER / ADMIN),
                account suspension, and metric analytics counters.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-300/80 py-6 px-4 bg-slate-200/90 text-center text-xs text-slate-600">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800">Felna.com</span>
            <span>&mdash; Secure Role-Based Authentication</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/login" className="hover:text-blue-600 transition">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-blue-600 transition">
              Register
            </Link>
            <Link href="/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
