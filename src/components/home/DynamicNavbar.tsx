"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  Shield,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";
import LogoutButton from "@/components/common/LogoutButton";
import { NavItem } from "@/types/homepage";

export interface SessionUser {
  userId: string;
  name?: string;
  phone: string;
  role: string;
}

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { id: "nav-1", label: "Home", url: "#home", isExternal: false },
  { id: "nav-2", label: "SMS Services", url: "#services", isExternal: false },
  { id: "nav-3", label: "Facebook Marketing", url: "#marketing", isExternal: false },
  { id: "nav-4", label: "Mobile Bill Solution", url: "#benefits", isExternal: false },
  { id: "nav-5", label: "SEO", url: "#why-choose-us", isExternal: false },
  { id: "nav-6", label: "Contact Us", url: "#contact", isExternal: false },
  { id: "nav-7", label: "Content Creator", url: "#services", isExternal: false },
  { id: "nav-8", label: "Payment", url: "#services", isExternal: false },
];

export interface DynamicNavbarProps {
  items?: NavItem[];
  initialSession?: SessionUser | null;
}

export default function DynamicNavbar({
  items = [],
  initialSession,
}: DynamicNavbarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(initialSession ?? null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(initialSession === undefined);

  const navLinks = items && items.length > 0 ? items : DEFAULT_NAV_ITEMS;

  // Sync state if initialSession prop changes
  useEffect(() => {
    if (initialSession !== undefined) {
      setUser(initialSession);
      setIsLoadingSession(false);
    }
  }, [initialSession]);

  // Client-side session fetch fallback if initialSession was not provided
  useEffect(() => {
    if (initialSession === undefined) {
      let isMounted = true;
      async function checkSession() {
        try {
          const res = await fetch("/api/auth/session");
          if (res.ok) {
            const data = await res.json();
            if (isMounted) {
              setUser(data.authenticated && data.user ? data.user : null);
            }
          }
        } catch {
          if (isMounted) setUser(null);
        } finally {
          if (isMounted) setIsLoadingSession(false);
        }
      }
      checkSession();
      return () => {
        isMounted = false;
      };
    }
  }, [initialSession]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close on ESC key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, handleKeyDown]);

  const isAdmin = user?.role === "ADMIN";

  // Helper to render navigation items cleanly (NO external link icon, prominent styling)
  const renderNavLink = (item: NavItem, isMobile = false) => {
    const isAnchor = item.url.startsWith("#");
    const isActive = !isAnchor && pathname === item.url;

    const baseClasses = isMobile
      ? `flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all ${
          isActive
            ? "bg-[#ebe5da] text-[#4a3b32] font-bold border border-[#d4ccc0]"
            : "text-stone-700 hover:text-[#4a3b32] hover:bg-[#ebe5da]/70"
        }`
      : `inline-flex items-center justify-center px-3 2xl:px-3.5 py-2 rounded-xl text-sm font-semibold tracking-tight whitespace-nowrap transition-all duration-150 ${
          isActive
            ? "bg-[#ebe5da] text-[#4a3b32] font-bold border border-[#d4ccc0] shadow-2xs"
            : "text-stone-700 hover:text-[#4a3b32] hover:bg-[#ebe5da]/70"
        }`;

    return (
      <Link
        key={item.id}
        href={item.url}
        className={baseClasses}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#d4ccc0] bg-[#f4f0e6]/95 backdrop-blur-md shadow-xs transition-all">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* =============================================================== */}
          {/* 1. Brand Logo & Title                                           */}
          {/* =============================================================== */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a3b32]/20 rounded-xl py-1 px-1.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#4a3b32] text-[#fcfbf9] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-[#fcfbf9]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[#4a3b32] text-lg tracking-tight leading-none">
                  Felna<span className="text-stone-500 font-bold">.com</span>
                </span>
                <span className="text-xs font-semibold text-stone-500 mt-1">
                  Bulk SMS & OTP Gateway
                </span>
              </div>
            </Link>
          </div>

          {/* =============================================================== */}
          {/* 2. Desktop Dynamic Navigation Links (No link icons)             */}
          {/* =============================================================== */}
          <nav
            aria-label="Main Navigation"
            className="hidden xl:flex items-center gap-1 2xl:gap-1.5"
          >
            {navLinks.map((item) => renderNavLink(item, false))}
          </nav>

          {/* =============================================================== */}
          {/* 3. Desktop Auth & Session Actions (Prominent, High-impact)      */}
          {/* =============================================================== */}
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            {isLoadingSession ? (
              <div className="h-10 w-32 bg-[#ebe5da] animate-pulse rounded-xl" />
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* Member Dashboard Link */}
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-stone-700 hover:text-[#4a3b32] hover:bg-[#ebe5da] border border-[#d4ccc0] rounded-xl transition-all shadow-2xs"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#4a3b32]" />
                  <span>Dashboard</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#4a3b32] bg-[#ebe5da] hover:bg-[#e4ddd2] border border-[#d4ccc0] rounded-xl transition-all shadow-2xs"
                  >
                    <Shield className="w-4 h-4 text-[#4a3b32]" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* User Avatar & Role Badge */}
                <div className="flex items-center gap-2.5 pl-3.5 pr-3 py-1.5 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-sm">
                  <div className="w-6 h-6 rounded-full bg-[#4a3b32] text-[#fcfbf9] flex items-center justify-center font-bold text-xs uppercase">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                  <span className="font-bold text-stone-800 max-w-[120px] truncate">
                    {user.name || "Member"}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f5efe6] text-[#4a3b32] border border-[#d4ccc0]">
                    {user.role}
                  </span>
                </div>

                {/* Sign Out Button */}
                <LogoutButton variant="navbar" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Outline / Soft Button for Sign In */}
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-[#4a3b32] hover:text-[#3d3028] bg-[#ebe5da]/80 hover:bg-[#ebe5da] border border-[#d4ccc0] rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-[0.98]"
                >
                  <LogIn className="w-4 h-4 text-[#4a3b32]" />
                  <span>Sign In</span>
                </Link>

                {/* Solid Primary Button for Create Account */}
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-[#fcfbf9] bg-[#4a3b32] hover:bg-[#3d3028] rounded-xl shadow-md shadow-[#4a3b32]/25 hover:shadow-lg hover:shadow-[#4a3b32]/30 transition-all active:scale-[0.98]"
                >
                  <UserPlus className="w-4 h-4 text-[#fcfbf9]" />
                  <span>Create Account</span>
                </Link>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* 4. Mobile Menu Trigger Button                                   */}
          {/* =============================================================== */}
          <div className="flex xl:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#4a3b32] bg-[#ebe5da]/70 hover:bg-[#ebe5da] border border-[#d4ccc0] transition"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-[#4a3b32]" /> : <Menu className="w-6 h-6 text-[#4a3b32]" />}
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 5. Accessible Mobile Slide-out Menu Drawer                          */}
      {/* =================================================================== */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-40 bg-[#4a3b32]/50 backdrop-blur-xs xl:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content (Warm vintage off-white / parchment container - NO bg-white) */}
          <nav
            id="mobile-navigation-drawer"
            aria-label="Mobile Navigation"
            className="fixed inset-x-0 top-0 z-50 max-h-[100vh] overflow-y-auto border-b border-[#d4ccc0] bg-[#fcfbf9] px-6 py-6 space-y-6 shadow-xl xl:hidden animate-in slide-in-from-top-2 duration-200"
          >
            {/* Header row in mobile drawer */}
            <div className="flex items-center justify-between pb-4 border-b border-[#d4ccc0]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#4a3b32] text-[#fcfbf9] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#fcfbf9]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#4a3b32] text-base leading-none">
                    Felna<span className="text-stone-500 font-bold">.com</span>
                  </span>
                  <span className="text-[10px] font-semibold text-stone-500 mt-0.5">
                    Bulk SMS & OTP Gateway
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl text-stone-700 hover:bg-[#ebe5da] transition"
                aria-label="Close navigation menu"
              >
                <X className="w-6 h-6 text-[#4a3b32]" />
              </button>
            </div>

            {/* Dynamic Navigation Links */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 px-3">
                Navigation
              </span>
              <div className="pt-2 space-y-1.5">
                {navLinks.length === 0 ? (
                  <p className="text-xs text-stone-500 px-3 py-2">No navigation links configured.</p>
                ) : (
                  navLinks.map((item) => renderNavLink(item, true))
                )}
              </div>
            </div>

            {/* Auth Actions Section */}
            <div className="pt-4 border-t border-[#d4ccc0]">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f5efe6] border border-[#d4ccc0]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#4a3b32] text-[#fcfbf9] flex items-center justify-center font-bold text-xs uppercase">
                        {user.name ? user.name.charAt(0) : "U"}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-stone-800">
                          {user.name || "Member"}
                        </div>
                        <div className="text-xs text-stone-500">{user.phone}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#ebe5da] text-[#4a3b32] border border-[#d4ccc0]">
                      {user.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 px-3 text-sm font-bold text-stone-800 bg-[#ebe5da] hover:bg-[#e4ddd2] border border-[#d4ccc0] rounded-xl transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#4a3b32]" />
                      <span>Dashboard</span>
                    </Link>

                    {isAdmin ? (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 py-3 px-3 text-sm font-bold text-[#4a3b32] bg-[#ebe5da] hover:bg-[#e4ddd2] border border-[#d4ccc0] rounded-xl transition"
                      >
                        <Shield className="w-4 h-4 text-[#4a3b32]" />
                        <span>Admin</span>
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center">
                        <LogoutButton variant="navbar" className="w-full justify-center" />
                      </div>
                    )}
                  </div>

                  {isAdmin && (
                    <div className="pt-1">
                      <LogoutButton variant="navbar" className="w-full justify-center py-3 text-sm" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 px-3">
                    Account Access
                  </span>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-[#4a3b32] bg-[#ebe5da] hover:bg-[#e4ddd2] border border-[#d4ccc0] rounded-xl transition shadow-2xs"
                    >
                      <LogIn className="w-4 h-4 text-[#4a3b32]" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-[#fcfbf9] bg-[#4a3b32] hover:bg-[#3d3028] rounded-xl shadow-md transition"
                    >
                      <UserPlus className="w-4 h-4 text-[#fcfbf9]" />
                      <span>Register</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
