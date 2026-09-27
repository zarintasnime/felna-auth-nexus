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
  ExternalLink,
} from "lucide-react";
import LogoutButton from "@/components/common/LogoutButton";
import { NavItem } from "@/types/homepage";

export interface SessionUser {
  userId: string;
  name?: string;
  phone: string;
  role: string;
}

export interface DynamicNavbarProps {
  items?: NavItem[];
  initialSession?: SessionUser | null;
}

export default function DynamicNavbar({
  items = [],
  initialSession = null,
}: DynamicNavbarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(initialSession);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(!initialSession);

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

  // Helper to render dynamic navigation links
  const renderNavLink = (item: NavItem, isMobile = false) => {
    const isAnchor = item.url.startsWith("#");
    const isActive = !isAnchor && pathname === item.url;

    const baseClasses = isMobile
      ? `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          isActive
            ? "bg-[#ebe5da] text-[#4a3b32] font-semibold border border-[#d4ccc0]"
            : "text-stone-700 hover:text-[#4a3b32] hover:bg-[#ebe5da]/60"
        }`
      : `inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
          isActive
            ? "bg-[#ebe5da] text-[#4a3b32] border border-[#d4ccc0]"
            : "text-stone-600 hover:text-[#4a3b32] hover:bg-[#ebe5da]/50"
        }`;

    if (item.isExternal) {
      return (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <span>{item.label}</span>
          <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
        </a>
      );
    }

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
    <header className="sticky top-0 z-40 w-full border-b border-[#d4ccc0] bg-[#f4f0e6]/90 backdrop-blur-md shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* =============================================================== */}
          {/* 1. Brand Logo & Title                                           */}
          {/* =============================================================== */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a3b32]/20 rounded-xl py-1 px-1.5"
            >
              <div className="w-9 h-9 rounded-xl bg-[#4a3b32] text-[#fcfbf9] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-[#fcfbf9]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#4a3b32] text-base tracking-tight leading-none">
                  Felna<span className="text-stone-500 font-semibold">.com</span>
                </span>
                <span className="text-[10px] font-medium text-stone-500 mt-0.5">
                  Bulk SMS & OTP Gateway
                </span>
              </div>
            </Link>
          </div>

          {/* =============================================================== */}
          {/* 2. Desktop Dynamic Navigation Links                             */}
          {/* =============================================================== */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1.5"
          >
            {items.map((item) => renderNavLink(item, false))}
          </nav>

          {/* =============================================================== */}
          {/* 3. Desktop Auth & Session Actions                               */}
          {/* =============================================================== */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoadingSession ? (
              <div className="h-8 w-28 bg-[#ebe5da] animate-pulse rounded-xl" />
            ) : user ? (
              <div className="flex items-center gap-2.5">
                {/* Member Dashboard Link */}
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-[#4a3b32] hover:bg-[#ebe5da]/60 rounded-xl transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#4a3b32]" />
                  <span>Member Dashboard</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#4a3b32] bg-[#ebe5da] hover:bg-[#e4ddd2] border border-[#d4ccc0] rounded-xl transition"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#4a3b32]" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* User Avatar & Role Badge */}
                <div className="flex items-center gap-2 pl-3 pr-2 py-1 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-xs">
                  <div className="w-5 h-5 rounded-full bg-[#4a3b32] text-[#fcfbf9] flex items-center justify-center font-bold text-[10px] uppercase">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                  <span className="font-semibold text-stone-800 max-w-[110px] truncate">
                    {user.name || "Member"}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#f5efe6] text-[#4a3b32] border border-[#d4ccc0]">
                    {user.role}
                  </span>
                </div>

                {/* Sign Out Button */}
                <LogoutButton variant="navbar" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Outline / Ghost Button for Sign In */}
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#4a3b32] hover:text-[#3d3028] bg-transparent hover:bg-[#ebe5da]/80 border border-[#d4ccc0] rounded-xl transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#4a3b32]" />
                  <span>Sign In</span>
                </Link>

                {/* Solid Primary Button for Create Account */}
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#fcfbf9] bg-[#4a3b32] hover:bg-[#3d3028] rounded-xl shadow-xs transition"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#fcfbf9]" />
                  <span>Create Account</span>
                </Link>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* 4. Mobile Menu Trigger Button                                   */}
          {/* =============================================================== */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-[#ebe5da] transition"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#4a3b32]" /> : <Menu className="w-5 h-5 text-[#4a3b32]" />}
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
            className="fixed inset-0 top-16 z-40 bg-[#4a3b32]/40 backdrop-blur-xs lg:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content (Warm vintage off-white / parchment container - NO bg-white) */}
          <nav
            id="mobile-navigation-drawer"
            aria-label="Mobile Navigation"
            className="fixed inset-x-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-[#d4ccc0] bg-[#fcfbf9] px-5 py-6 space-y-5 shadow-lg lg:hidden animate-in slide-in-from-top-2 duration-200"
          >
            {/* Dynamic Navigation Links */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-3">
                Navigation
              </span>
              <div className="pt-1 space-y-1">
                {items.length === 0 ? (
                  <p className="text-xs text-stone-500 px-3 py-2">No navigation links configured.</p>
                ) : (
                  items.map((item) => renderNavLink(item, true))
                )}
              </div>
            </div>

            {/* Auth Actions Section */}
            <div className="pt-4 border-t border-[#d4ccc0]">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#f5efe6] border border-[#d4ccc0]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#4a3b32] text-[#fcfbf9] flex items-center justify-center font-bold text-xs uppercase">
                        {user.name ? user.name.charAt(0) : "U"}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-800">
                          {user.name || "Member"}
                        </div>
                        <div className="text-[10px] text-stone-500">{user.phone}</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ebe5da] text-[#4a3b32] border border-[#d4ccc0]">
                      {user.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold text-stone-800 bg-[#ebe5da] hover:bg-[#e4ddd2] border border-[#d4ccc0] rounded-xl transition"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#4a3b32]" />
                      <span>Dashboard</span>
                    </Link>

                    {isAdmin ? (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold text-[#4a3b32] bg-[#ebe5da] hover:bg-[#e4ddd2] border border-[#d4ccc0] rounded-xl transition"
                      >
                        <Shield className="w-3.5 h-3.5 text-[#4a3b32]" />
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
                      <LogoutButton variant="navbar" className="w-full justify-center py-2.5" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-3">
                    Account Access
                  </span>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-[#4a3b32] bg-transparent hover:bg-[#ebe5da]/80 border border-[#d4ccc0] rounded-xl transition"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#4a3b32]" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-[#fcfbf9] bg-[#4a3b32] hover:bg-[#3d3028] rounded-xl shadow-xs transition"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-[#fcfbf9]" />
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
