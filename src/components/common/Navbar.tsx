"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shield,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

interface SessionUser {
  userId: string;
  name?: string;
  phone: string;
  role: string;
}

interface NavbarProps {
  initialSession?: SessionUser | null;
}

export default function Navbar({ initialSession = null }: NavbarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(initialSession);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(!initialSession);

  useEffect(() => {
    // Only fetch if initialSession was not provided
    if (!initialSession) {
      let isMounted = true;
      async function checkSession() {
        try {
          const res = await fetch("/api/auth/session");
          if (res.ok) {
            const data = await res.json();
            if (isMounted && data.authenticated && data.user) {
              setUser(data.user);
            } else if (isMounted) {
              setUser(null);
            }
          }
        } catch {
          // Ignore network errors for session check
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#d4ccc0] bg-[#f4f0e6]/90 backdrop-blur-md shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a3b32]/20 rounded-xl py-1 px-1.5"
            >
              <div className="relative w-9 h-9 rounded-xl bg-[#201915] border border-neutral-700/60 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <Image
                  src="/images/igl-logo.png"
                  alt="IGL Group Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#4a3b32] text-base tracking-tight leading-none">
                  IGL Group<span className="text-[#F5B83D] font-bold">.</span>
                </span>
                <span className="text-[10px] font-medium text-stone-500 mt-0.5">
                  Felna.com SMS Gateway
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                pathname === "/"
                  ? "bg-[#ebe5da] text-[#4a3b32] border border-[#d4ccc0]"
                  : "text-stone-600 hover:text-[#4a3b32] hover:bg-[#ebe5da]/50"
              }`}
            >
              Home
            </Link>

            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    pathname.startsWith("/dashboard")
                      ? "bg-[#ebe5da] text-[#4a3b32] border border-[#d4ccc0]"
                      : "text-stone-600 hover:text-[#4a3b32] hover:bg-[#ebe5da]/50"
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#4a3b32]" />
                  <span>Dashboard</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                      pathname.startsWith("/admin")
                        ? "bg-[#ebe5da] text-[#4a3b32] border border-[#d4ccc0]"
                        : "text-[#4a3b32] hover:bg-[#ebe5da]/50"
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-[#4a3b32]" />
                    <span>Admin Console</span>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Right Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoadingSession ? (
              <div className="h-8 w-24 bg-[#ebe5da] animate-pulse rounded-lg" />
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* User Info Capsule */}
                <div className="flex items-center gap-2 pl-3 pr-2 py-1 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-xs">
                  <div className="w-5 h-5 rounded-full bg-[#4a3b32] text-[#fcfbf9] flex items-center justify-center font-bold text-[10px] uppercase">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                  <span className="font-semibold text-stone-800 max-w-[120px] truncate">
                    {user.name}
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
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 hover:text-[#4a3b32] hover:bg-[#ebe5da]/60 rounded-xl transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#fcfbf9] bg-[#4a3b32] hover:bg-[#3d3028] rounded-xl shadow-xs transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-[#ebe5da] transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#d4ccc0] bg-[#fcfbf9] px-4 pt-2 pb-4 space-y-3 animate-in slide-in-from-top duration-150">
          <div className="flex flex-col space-y-1">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-[#ebe5da]/50"
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-[#ebe5da]/50 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#4a3b32]" />
                  <span>Member Dashboard</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-[#4a3b32] hover:bg-[#ebe5da]/50 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-[#4a3b32]" />
                    <span>Admin Console</span>
                  </Link>
                )}

                <div className="pt-2 border-t border-[#d4ccc0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#4a3b32] text-[#fcfbf9] flex items-center justify-center font-bold text-xs uppercase">
                      {user.name ? user.name.charAt(0) : "U"}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-stone-800">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-stone-500">{user.role}</div>
                    </div>
                  </div>
                  <LogoutButton variant="navbar" />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#d4ccc0]">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-stone-800 bg-[#ebe5da] hover:bg-[#e4ddd2] border border-[#d4ccc0] rounded-xl"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-[#fcfbf9] bg-[#4a3b32] hover:bg-[#3d3028] rounded-xl shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
