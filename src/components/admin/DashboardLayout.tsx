"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  MapPin,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  LogOut,
  User,
  ExternalLink,
  ChevronDown,
  Home,
  Globe,
} from "lucide-react";

interface AdminUserSession {
  userId: string;
  name: string;
  phone: string;
  role: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  session?: AdminUserSession | null;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Content & CMS",
    href: "/admin/cms",
    icon: Globe,
    badge: "Live",
  },
  {
    label: "User Management",
    href: "/admin/dashboard?tab=users",
    icon: Users,
  },
  {
    label: "Role & RBAC",
    href: "/admin/dashboard?tab=rbac",
    icon: ShieldCheck,
  },
  {
    label: "Geo Hierarchy",
    href: "/admin/dashboard?tab=geo",
    icon: MapPin,
  },
  {
    label: "SMS & Gateway",
    href: "/admin/dashboard?tab=sms",
    icon: MessageSquare,
  },
  {
    label: "System Settings",
    href: "/admin/dashboard?tab=settings",
    icon: Settings,
  },
];

export default function DashboardLayout({ children, session }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Generate dynamic breadcrumbs based on pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [
    { label: "Home", href: "/" },
    ...pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      const label =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      return { label, href };
    }),
  ];

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login?logout=1");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-200 text-slate-800 antialiased">
      {/* ========================================================================= */}
      {/* 1. DEEP DARK SLATE / NAVY BLUE SIDEBAR                                    */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header / Brand Logo */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/90 bg-slate-950/60">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="relative w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/60 p-1 flex items-center justify-center font-bold shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform shrink-0">
                <Image
                  src="/images/igl-logo.png"
                  alt="IGL Group Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-base tracking-tight leading-none">
                  IGL Group<span className="text-[#F5B83D] font-bold">.</span>
                </span>
                <span className="text-[10px] font-medium text-slate-400 mt-0.5 tracking-wider uppercase">
                  Felna Admin Console
                </span>
              </div>
            </Link>

            {/* Close button for mobile */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick System Status Chip */}
          <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Neon DB
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
                ACTIVE
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Core Management
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === "/admin/dashboard" && pathname.startsWith("/admin/dashboard"));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-sky-500/15 text-sky-400 font-semibold border-l-4 border-sky-400 shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? "text-sky-400" : "text-slate-400 group-hover:text-white"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Shortcuts
            </div>
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>Public Portal</span>
              </div>
              <span className="text-[10px] text-slate-400">Live</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer / User Profile summary */}
        <div className="p-3 border-t border-slate-800/90 bg-slate-950/60">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                {session?.name ? session.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="truncate text-left">
                <div className="text-xs font-semibold text-white truncate">
                  {session?.name || "Super Admin"}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {session?.phone || "01700000000"}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN LAYOUT WRAPPER (CLEAN LIGHT TOP NAVBAR + SOFT CONTENT)            */}
      {/* ========================================================================= */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Clean, modern light backdrop header */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-300/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-xs">
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center text-xs font-medium text-slate-500">
              <Link
                href="/"
                className="hover:text-slate-900 flex items-center gap-1 transition"
              >
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Home</span>
              </Link>

              {breadcrumbs.slice(1).map((crumb, idx) => (
                <React.Fragment key={crumb.href}>
                  <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400" />
                  {idx === breadcrumbs.length - 2 ? (
                    <span className="font-semibold text-slate-900">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="hover:text-slate-900 transition"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Right: Search, Notifications, Profile Settings */}
          <div className="flex items-center gap-3">
            {/* Search Input (Desktop) */}
            <div className="hidden lg:flex items-center relative">
              <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-48 pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition"
              />
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-white" />
            </button>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-slate-200" />

            {/* User Profile Settings Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {session?.name ? session.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-semibold text-slate-900 leading-tight">
                    {session?.name || "Super Admin"}
                  </span>
                  <span className="text-[10px] font-bold text-sky-600 leading-none mt-0.5">
                    {session?.role || "ADMIN"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <>
                  <div
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs text-slate-700 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <div className="font-semibold text-slate-900">
                        {session?.name || "Super Admin"}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {session?.phone || "01700000000"}
                      </div>
                      <span className="inline-block mt-1.5 px-2 py-0.5 text-[9px] font-bold bg-sky-50 text-sky-700 rounded-md border border-sky-200">
                        ADMIN PRIVILEGES
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition text-slate-700"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                        <span>Admin Overview</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition text-slate-700"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Member View</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 transition text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Body - Soft corporate slate-200 soothing background */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-200">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
