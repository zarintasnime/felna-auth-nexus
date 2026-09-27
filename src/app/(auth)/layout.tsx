import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import TopBar from "@/components/home/TopBar";
import DynamicNavbar from "@/components/home/DynamicNavbar";
import { getSession } from "@/lib/auth";
import { getHomePageData } from "@/lib/services/homepage-service";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, homeData] = await Promise.all([
    getSession(),
    getHomePageData(),
  ]);

  return (
    <div className="min-h-screen bg-[#181310] text-[#fcfbf9] flex flex-col justify-between selection:bg-[#4a3b32] selection:text-[#fcfbf9]">
      {/* =================================================================== */}
      {/* 1. Boxed Header Card Wrapper (TopBar + DynamicNavbar)               */}
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
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. Main Authentication Content Area                                 */}
      {/* =================================================================== */}
      <main className="flex-1 flex flex-col justify-center py-6 sm:py-10">
        {children}
      </main>

      {/* =================================================================== */}
      {/* 3. Universal Footer (Cohesive Dark/Vintage Theme)                   */}
      {/* =================================================================== */}
      <footer id="contact" className="border-t border-[#382b24] py-8 px-4 bg-[#201915] text-center text-xs text-stone-400 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#4a3b32] text-[#fcfbf9] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#fcfbf9]" />
            </div>
            <span className="font-bold text-[#fcfbf9]">Felna.com</span>
            <span className="text-stone-400">&mdash; Secure Role-Based Authentication & Bulk SMS Platform</span>
          </div>

          <div className="flex items-center gap-5 text-xs font-medium text-stone-400">
            <Link href="/login" className="hover:text-amber-300 transition">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-amber-300 transition">
              Register
            </Link>
            <Link href="/dashboard" className="hover:text-amber-300 transition">
              Dashboard
            </Link>
            <span className="text-stone-600">|</span>
            <span className="text-stone-500">
              &copy; {new Date().getFullYear()} Felna Inc. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
