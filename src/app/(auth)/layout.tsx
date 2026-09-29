import React from "react";
import TopBar from "@/components/home/TopBar";
import DynamicNavbar from "@/components/home/DynamicNavbar";
import { getSession } from "@/lib/auth";
import { getHomePageData } from "@/lib/services/homepage-service";
import { getCmsSiteSettings } from "@/lib/services/cms-service";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, homeData, settings] = await Promise.all([
    getSession(),
    getHomePageData(),
    getCmsSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#181310] text-[#2C2520] dark:text-[#fcfbf9] flex flex-col justify-between selection:bg-[#D49624]/20 dark:selection:bg-[#4a3b32] selection:text-[#2C2520] dark:selection:text-[#fcfbf9] transition-colors">
      {/* =================================================================== */}
      {/* 1. Boxed Header Card Wrapper (TopBar + DynamicNavbar)               */}
      {/* =================================================================== */}
      <header className="w-full relative z-20">
        <div className="w-[98%] 2xl:w-[98.5%] max-w-[1880px] mx-auto my-3 md:my-5 rounded-2xl md:rounded-3xl border border-[#2C2520]/15 dark:border-neutral-800/60 bg-[#E5E2DC] dark:bg-[#201915] shadow-xl dark:shadow-2xl shadow-[#2C2520]/5 dark:shadow-black/60 relative z-30 transition-colors">
          {/* Top Utility Bar (Edge-to-Edge) */}
          <TopBar
            announcementText={settings.announcementText}
            announcementLinkText={settings.announcementLinkText}
            announcementHref={settings.announcementLinkUrl}
            scheduleText={settings.scheduleText}
            supportHref="/contact"
          />

          {/* Dynamic Frosted Navbar (Edge-to-Edge) */}
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
      {/* 2. Main Authentication Content Area                                 */}
      {/* =================================================================== */}
      <main className="flex-1 flex flex-col justify-center py-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
