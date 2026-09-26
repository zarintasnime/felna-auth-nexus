"use client";

import React, { useEffect, useState } from "react";
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-300/80 bg-white/90 backdrop-blur-md shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl py-1 px-1.5"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-base tracking-tight leading-none group-hover:text-sky-600 transition-colors">
                  Felna<span className="text-sky-600">.com</span>
                </span>
                <span className="text-[10px] font-medium text-slate-500 mt-0.5">
                  Secure Access System
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
                  ? "bg-sky-100 text-sky-800 border border-sky-300/70"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
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
                      ? "bg-sky-100 text-sky-800 border border-sky-300/70"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                      pathname.startsWith("/admin")
                        ? "bg-purple-100 text-purple-800 border border-purple-300/70"
                        : "text-purple-700/90 hover:text-purple-900 hover:bg-purple-50/60"
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-purple-600" />
                    <span>Admin Console</span>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Right Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoadingSession ? (
              <div className="h-8 w-24 bg-slate-200 animate-pulse rounded-lg" />
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* User Info Capsule */}
                <div className="flex items-center gap-2 pl-3 pr-2 py-1 bg-slate-100 border border-slate-300 rounded-xl text-xs">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] uppercase">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                  <span className="font-medium text-slate-800 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      isAdmin
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : "bg-sky-100 text-sky-700 border border-sky-200"
                    }`}
                  >
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-600/20 transition-all hover:scale-[1.02]"
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
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-300 bg-white px-4 pt-2 pb-4 space-y-3 animate-in slide-in-from-top duration-150">
          <div className="flex flex-col space-y-1">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-sky-600" />
                  <span>Member Dashboard</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Console</span>
                  </Link>
                )}

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                      {user.name ? user.name.charAt(0) : "U"}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-slate-500">{user.role}</div>
                    </div>
                  </div>
                  <LogoutButton variant="navbar" />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-white bg-blue-600 rounded-xl shadow-sm"
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
