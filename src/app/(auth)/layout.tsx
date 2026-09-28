import React from "react";
import Footer from "@/components/home/Footer";
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
      <header className="w-full relative z-20">
        <div className="w-[98%] 2xl:w-[98.5%] max-w-[1880px] mx-auto my-3 md:my-5 rounded-2xl md:rounded-3xl border border-neutral-800/60 bg-[#201915] shadow-2xl shadow-black/60 relative z-30">
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
      <Footer />
    </div>
  );
}
