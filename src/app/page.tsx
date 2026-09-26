import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Shield,
  LayoutDashboard,
  Users,
  MapPin,
  CheckCircle2,
  KeyRound,
  Phone,
  Zap,
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
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
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/50 dark:from-slate-900 dark:via-slate-950 dark:to-black">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Felna Identity & Role-Based Access</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-[1.15]">
              Seamless Authentication &{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Role Management
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Unified credentials portal with dual-mode password and mobile OTP login,
              geographic cascading profiling, and high-performance administrative controls.
            </p>

            {/* Dynamic Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02]"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Go to Member Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {session.role === "ADMIN" && (
                    <Link
                      href="/admin/dashboard"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-red-600/25 transition-all hover:scale-[1.02]"
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
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02]"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm transition-all"
                  >
                    <span>Create New Account</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Engineered for Speed, Precision & Security
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Built on Next.js, Neon Serverless PostgreSQL, and Cryptographic JWT Sessions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Unified Credential Hub
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Single-page authentication with instant tab-switching between Sign In and Registration.
                Supports both password credentials and 6-digit phone OTP verification.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Bangladesh Geographic Engine
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Real-time cascading dropdowns for 8 Divisions, 64 Districts, and Upazilas/Thanas
                with automated relational querying and localized address validation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center border border-red-200 dark:border-red-800">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Admin Console & RBAC
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Real-time role-based access control with live user search, role toggling (USER / ADMIN),
                account suspension, and metric analytics counters.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-4 bg-white dark:bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-700 dark:text-slate-300">Felna.com</span>
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
