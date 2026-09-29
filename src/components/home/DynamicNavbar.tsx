"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shield,
  Menu,
  X,
  ChevronDown,
  MapPin,
  MessageSquare,
  Megaphone,
  TrendingUp,
  Sparkles,
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
  { id: "nav-3", label: "Mobile Bill Solution", url: "#benefits", isExternal: false },
  { id: "nav-4", label: "Services", url: "#services", isExternal: false },
  { id: "nav-5", label: "Pricing", url: "#services", isExternal: false },
  { id: "nav-6", label: "Contact Us", url: "/contact", isExternal: false },
];

export interface DynamicNavbarProps {
  items?: NavItem[];
  initialSession?: SessionUser | null;
}

interface DropdownItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SERVICES_ITEMS: DropdownItem[] = [
  {
    id: "service-fb-marketing",
    label: "Facebook Marketing",
    description: "Targeted social campaigns",
    href: "#marketing",
    icon: Megaphone,
  },
  {
    id: "service-seo",
    label: "SEO",
    description: "Search engine ranking & reach",
    href: "#why-choose-us",
    icon: TrendingUp,
  },
  {
    id: "service-content-creator",
    label: "Content Creator",
    description: "High-converting copy & media",
    href: "#content-creator",
    icon: Sparkles,
  },
];

export interface SisterConcernItem {
  id: string;
  label: string;
  href: string;
}

const SISTER_CONCERN_ITEMS: SisterConcernItem[] = [
  { id: "sc-felna-marketing", label: "Felna Digital Marketing Agency", href: "#" },
  { id: "sc-felna-online", label: "Felna Online", href: "#" },
  { id: "sc-felnatech", label: "FelnaTech", href: "#" },
  { id: "sc-igl-host", label: "IGL Host LLC", href: "#" },
  { id: "sc-igl-network", label: "IGL Network", href: "#" },
  { id: "sc-igl-tours", label: "IGL Tours and Travels", href: "#" },
  { id: "sc-igl-web", label: "IGL Web", href: "#" },
  { id: "sc-student-visa", label: "Student Visa", href: "#" },
];

const CONTACT_ITEMS: DropdownItem[] = [
  {
    id: "contact-address",
    label: "Address",
    description: "Dhaka & Chittagong offices",
    href: "/address",
    icon: MapPin,
  },
  {
    id: "contact-feedback",
    label: "Feedback",
    description: "Send an inquiry or message",
    href: "/feedback",
    icon: MessageSquare,
  },
];

export default function DynamicNavbar({
  initialSession,
}: DynamicNavbarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(initialSession ?? null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(initialSession === undefined);

  // Dropdown states
  const [isSisterConcernOpen, setIsSisterConcernOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
  const [isMobileSisterConcernExpanded, setIsMobileSisterConcernExpanded] = useState(false);
  const [isMobileServicesExpanded, setIsMobileServicesExpanded] = useState(false);
  const [isMobileContactExpanded, setIsMobileContactExpanded] = useState(false);

  const sisterConcernDropdownRef = useRef<HTMLDivElement>(null);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const contactDropdownRef = useRef<HTMLDivElement>(null);

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

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSisterConcernOpen(false);
    setIsServicesDropdownOpen(false);
    setIsContactDropdownOpen(false);
  }, [pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sisterConcernDropdownRef.current &&
        !sisterConcernDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSisterConcernOpen(false);
      }
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsServicesDropdownOpen(false);
      }
      if (
        contactDropdownRef.current &&
        !contactDropdownRef.current.contains(event.target as Node)
      ) {
        setIsContactDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close on ESC key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsMobileMenuOpen(false);
      setIsSisterConcernOpen(false);
      setIsServicesDropdownOpen(false);
      setIsContactDropdownOpen(false);
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

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  // Resolve cross-page anchor URLs correctly
  const getHref = (url: string) => {
    if (url.startsWith("#")) {
      return pathname === "/" ? url : `/${url}`;
    }
    return url;
  };

  const isContactActive = pathname === "/address" || pathname === "/feedback" || pathname === "/contact";
  const isAboutActive = pathname === "/about";

  return (
    <header className="h-[72px] bg-[#12100E]/85 backdrop-blur-[12px] sticky top-0 z-50 transition-all duration-300 border-b border-white/10 w-full">
      <div className="w-full max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 h-full">
        <div className="flex h-full items-center justify-between gap-4">
          {/* =============================================================== */}
          {/* 1. Brand Logo & Identity (CSS Monogram + Exact Brand Typography) */}
          {/* =============================================================== */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B83D]/40 rounded-xl py-1 px-1.5"
            >
              {/* Monogram: F with amber gradient */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5B83D] to-[#E09819] flex items-center justify-center font-bold text-black text-xl shadow-lg shadow-[#F5B83D]/20 shrink-0 group-hover:scale-105 transition-transform">
                F
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-none">
                  Felna.com
                </span>
                <span className="text-neutral-500 text-[11px] font-medium tracking-wide mt-1">
                  Bulk SMS &amp; OTP Gateway
                </span>
              </div>
            </Link>
          </div>

          {/* =============================================================== */}
          {/* 2. Streamlined Navigation Links (Desktop)                        */}
          {/* =============================================================== */}
          <nav
            aria-label="Main Navigation"
            className="hidden xl:flex items-center gap-1 2xl:gap-1.5"
          >
            {/* 1. Home */}
            <Link
              href={getHref("#home")}
              className={`text-[15px] px-3 py-2 rounded-lg font-medium transition-colors ${
                pathname === "/" ? "text-[#E8E3DC] hover:text-[#F5B83D]" : "text-[#E8E3DC] hover:text-[#F5B83D]"
              }`}
            >
              Home
            </Link>

            {/* 2. About Us */}
            <Link
              href="/about"
              className={`text-[15px] px-3 py-2 rounded-lg font-medium transition-colors ${
                isAboutActive ? "text-[#F5B83D]" : "text-[#E8E3DC] hover:text-[#F5B83D]"
              }`}
            >
              About Us
            </Link>

            {/* 3. Sister Concern (Top-Level Dropdown) */}
            <div
              ref={sisterConcernDropdownRef}
              className="relative group"
              onMouseEnter={() => setIsSisterConcernOpen(true)}
              onMouseLeave={() => setIsSisterConcernOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsSisterConcernOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 text-[15px] px-3 py-2 rounded-lg font-medium transition-colors select-none ${
                  isSisterConcernOpen
                    ? "text-[#F5B83D]"
                    : "text-[#E8E3DC] hover:text-[#F5B83D]"
                }`}
                aria-haspopup="true"
                aria-expanded={isSisterConcernOpen}
              >
                <span>Sister Concern</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isSisterConcernOpen
                      ? "rotate-180 text-[#F5B83D]"
                      : "text-neutral-400 group-hover:text-[#F5B83D]"
                  }`}
                />
              </button>

              {/* Sister Concern Floating Dark Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 w-64 bg-[#1B1815] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-md transition-all duration-200 before:absolute before:-top-3 before:left-0 before:w-full before:h-3 before:content-[''] ${
                  isSisterConcernOpen
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible pointer-events-none -translate-y-1"
                }`}
                role="menu"
              >
                {SISTER_CONCERN_ITEMS.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setIsSisterConcernOpen(false)}
                    className="block text-[15px] text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* 4. Our Team */}
            <Link
              href="/about#team"
              className="text-[15px] text-[#E8E3DC] hover:text-[#F5B83D] font-medium transition-colors px-3 py-2 rounded-lg"
            >
              Our Team
            </Link>

            {/* 5. SMS Services */}
            <Link
              href={getHref("#services")}
              className="text-[15px] text-[#E8E3DC] hover:text-[#F5B83D] font-medium transition-colors px-3 py-2 rounded-lg"
            >
              SMS Services
            </Link>

            {/* 6. Mobile Bill Solution */}
            <Link
              href={getHref("#benefits")}
              className="text-[15px] text-[#E8E3DC] hover:text-[#F5B83D] font-medium transition-colors px-3 py-2 rounded-lg"
            >
              Mobile Bill Solution
            </Link>

            {/* 7. Services Dropdown (Without Sister Concern) */}
            <div
              ref={servicesDropdownRef}
              className="relative group"
              onMouseEnter={() => setIsServicesDropdownOpen(true)}
              onMouseLeave={() => setIsServicesDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsServicesDropdownOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 text-[15px] px-3 py-2 rounded-lg font-medium transition-colors select-none ${
                  isServicesDropdownOpen
                    ? "text-[#F5B83D]"
                    : "text-[#E8E3DC] hover:text-[#F5B83D]"
                }`}
                aria-haspopup="true"
                aria-expanded={isServicesDropdownOpen}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isServicesDropdownOpen
                      ? "rotate-180 text-[#F5B83D]"
                      : "text-neutral-400 group-hover:text-[#F5B83D]"
                  }`}
                />
              </button>

              {/* Floating Dark Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 w-64 bg-[#1B1815] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-md transition-all duration-200 before:absolute before:-top-3 before:left-0 before:w-full before:h-3 before:content-[''] ${
                  isServicesDropdownOpen
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible pointer-events-none -translate-y-1"
                }`}
                role="menu"
              >
                {SERVICES_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={getHref(item.href)}
                      role="menuitem"
                      onClick={() => setIsServicesDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group/item text-neutral-300 hover:bg-white/5 hover:text-[#F5B83D]"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#24201C] border border-white/10 flex items-center justify-center text-[#F5B83D] shrink-0 group-hover/item:border-[#F5B83D]/40 transition-colors">
                        <Icon className="w-4 h-4 text-[#F5B83D]" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold text-white group-hover/item:text-[#F5B83D] transition-colors leading-tight">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-neutral-400 group-hover/item:text-neutral-300 transition-colors">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 8. Pricing */}
            <Link
              href={getHref("#services")}
              className="text-[15px] text-[#E8E3DC] hover:text-[#F5B83D] font-medium transition-colors px-3 py-2 rounded-lg"
            >
              Pricing
            </Link>

            {/* 9. Contact Us Dropdown */}
            <div
              ref={contactDropdownRef}
              className="relative group"
              onMouseEnter={() => setIsContactDropdownOpen(true)}
              onMouseLeave={() => setIsContactDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsContactDropdownOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 text-[15px] px-3 py-2 rounded-lg font-medium transition-colors select-none ${
                  isContactDropdownOpen || isContactActive
                    ? "text-[#F5B83D]"
                    : "text-[#E8E3DC] hover:text-[#F5B83D]"
                }`}
                aria-haspopup="true"
                aria-expanded={isContactDropdownOpen}
              >
                <span>Contact Us</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isContactDropdownOpen
                      ? "rotate-180 text-[#F5B83D]"
                      : "text-neutral-400 group-hover:text-[#F5B83D]"
                  }`}
                />
              </button>

              {/* Floating Dark Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 w-60 bg-[#1B1815] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-md transition-all duration-200 before:absolute before:-top-3 before:left-0 before:w-full before:h-3 before:content-[''] ${
                  isContactDropdownOpen
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible pointer-events-none -translate-y-1"
                }`}
                role="menu"
              >
                {CONTACT_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isItemActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setIsContactDropdownOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group/item ${
                        isItemActive
                          ? "bg-white/10 text-[#F5B83D] font-semibold"
                          : "text-neutral-300 hover:bg-white/5 hover:text-[#F5B83D]"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#24201C] border border-white/10 flex items-center justify-center text-[#F5B83D] shrink-0 group-hover/item:border-[#F5B83D]/40 transition-colors">
                        <Icon className="w-4 h-4 text-[#F5B83D]" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold text-white group-hover/item:text-[#F5B83D] transition-colors leading-tight">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-neutral-400 group-hover/item:text-neutral-300 transition-colors">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* =============================================================== */}
          {/* 3. Call-to-Action Buttons (Hierarchy Fix: Ghost + Solid Amber)   */}
          {/* =============================================================== */}
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            {isLoadingSession ? (
              <div className="h-10 w-44 bg-white/5 animate-pulse rounded-full" />
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* Member Dashboard Link */}
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-4 h-10 text-sm font-medium text-white hover:text-[#F5B83D] hover:bg-white/5 border border-white/20 rounded-full transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#F5B83D]" />
                  <span>Dashboard</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center gap-2 px-4 h-10 text-sm font-semibold text-black bg-[#F5B83D] hover:bg-[#e5a930] rounded-full transition-all shadow-md shadow-[#F5B83D]/10"
                  >
                    <Shield className="w-4 h-4 text-black" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* User Avatar & Role Badge */}
                <div className="flex items-center gap-2.5 pl-3.5 pr-3 h-10 bg-white/5 border border-white/10 rounded-full text-sm">
                  <div className="w-6 h-6 rounded-full bg-[#F5B83D] text-black flex items-center justify-center font-bold text-xs uppercase">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                  <span className="font-medium text-white max-w-[120px] truncate">
                    {user.name || "Member"}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-[#F5B83D] border border-white/10">
                    {user.role}
                  </span>
                </div>

                {/* Sign Out Button */}
                <LogoutButton variant="navbar" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Secondary Ghost Button for Sign In */}
                <Link
                  href="/login"
                  className="bg-transparent text-white border border-white/20 hover:bg-white/5 rounded-full h-10 px-6 font-medium transition-all inline-flex items-center justify-center text-sm"
                >
                  <span>Sign In</span>
                </Link>

                {/* Primary Solid Amber Pill for Create Account */}
                <Link
                  href="/register"
                  className="bg-[#F5B83D] text-black font-semibold rounded-full h-10 px-6 hover:bg-[#e5a930] transition-colors inline-flex items-center justify-center text-sm shadow-md shadow-[#F5B83D]/15"
                >
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
              className="p-2.5 rounded-xl text-[#E8E3DC] hover:text-[#F5B83D] bg-white/5 hover:bg-white/10 border border-white/10 transition"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 5. Mobile Slide-out Menu Drawer (Dark SaaS Theme)                   */}
      {/* =================================================================== */}
      {isMobileMenuOpen && (
        <>
          {/* Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm xl:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <nav
            id="mobile-navigation-drawer"
            aria-label="Mobile Navigation"
            className="fixed inset-x-0 top-0 z-50 max-h-[100vh] overflow-y-auto border-b border-white/10 bg-[#12100E] px-6 py-6 space-y-6 shadow-2xl xl:hidden animate-in slide-in-from-top-2 duration-200 text-[#E8E3DC]"
          >
            {/* Header row in mobile drawer */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5B83D] to-[#E09819] flex items-center justify-center font-bold text-black text-xl shadow-lg shadow-[#F5B83D]/20 shrink-0">
                  F
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base leading-none">
                    Felna.com
                  </span>
                  <span className="text-neutral-500 text-[10px] font-medium tracking-wide mt-1">
                    Bulk SMS &amp; OTP Gateway
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition"
                aria-label="Close navigation menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 px-3">
                Navigation
              </span>
              <div className="pt-2 space-y-1.5">
                {/* 1. Home */}
                <Link
                  href={getHref("#home")}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 transition-all"
                >
                  <span>Home</span>
                </Link>

                {/* 2. About Us */}
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 transition-all"
                >
                  <span>About Us</span>
                </Link>

                {/* 3. Sister Concern Accordion */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setIsMobileSisterConcernExpanded((prev) => !prev)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 transition-all"
                    aria-label="Toggle sister concern options"
                    aria-expanded={isMobileSisterConcernExpanded}
                  >
                    <span>Sister Concern</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isMobileSisterConcernExpanded ? "rotate-180 text-[#F5B83D]" : "text-neutral-400"
                      }`}
                    />
                  </button>

                  <div
                    className={`pl-4 pr-2 space-y-1 border-l-2 border-white/10 ml-4 transition-all duration-200 ${
                      isMobileSisterConcernExpanded ? "block" : "hidden"
                    }`}
                  >
                    {SISTER_CONCERN_ITEMS.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-[15px] text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 4. Our Team */}
                <Link
                  href="/about#team"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 transition-all"
                >
                  <span>Our Team</span>
                </Link>

                {/* 5. SMS Services */}
                <Link
                  href={getHref("#services")}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 transition-all"
                >
                  <span>SMS Services</span>
                </Link>

                {/* 6. Mobile Bill Solution */}
                <Link
                  href={getHref("#benefits")}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 transition-all"
                >
                  <span>Mobile Bill Solution</span>
                </Link>

                {/* 7. Services Accordion */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setIsMobileServicesExpanded((prev) => !prev)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 transition-all"
                    aria-label="Toggle services options"
                    aria-expanded={isMobileServicesExpanded}
                  >
                    <span>Services</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isMobileServicesExpanded ? "rotate-180 text-[#F5B83D]" : "text-neutral-400"
                      }`}
                    />
                  </button>

                  <div
                    className={`pl-4 pr-2 space-y-1 border-l-2 border-white/10 ml-4 transition-all duration-200 ${
                      isMobileServicesExpanded ? "block" : "hidden"
                    }`}
                  >
                    {SERVICES_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={getHref(item.href)}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-neutral-300 hover:text-[#F5B83D] hover:bg-white/5 transition-all"
                        >
                          <Icon className="w-4 h-4 text-[#F5B83D] shrink-0" />
                          <div className="flex flex-col text-left">
                            <span className="font-semibold leading-tight">{item.label}</span>
                            <span className="text-[10px] text-neutral-400">{item.description}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* 8. Pricing */}
                <Link
                  href={getHref("#services")}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 transition-all"
                >
                  <span>Pricing</span>
                </Link>

                {/* 9. Contact Us Accordion */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setIsMobileContactExpanded((prev) => !prev)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 transition-all"
                    aria-label="Toggle contact options"
                    aria-expanded={isMobileContactExpanded}
                  >
                    <span>Contact Us</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isMobileContactExpanded ? "rotate-180 text-[#F5B83D]" : "text-neutral-400"
                      }`}
                    />
                  </button>

                  <div
                    className={`pl-4 pr-2 space-y-1 border-l-2 border-white/10 ml-4 transition-all duration-200 ${
                      isMobileContactExpanded || isContactActive ? "block" : "hidden"
                    }`}
                  >
                    {CONTACT_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const isItemActive = pathname === item.href;
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                            isItemActive
                              ? "text-[#F5B83D] font-semibold bg-white/10"
                              : "text-neutral-300 hover:text-[#F5B83D] hover:bg-white/5"
                          }`}
                        >
                          <Icon className="w-4 h-4 text-[#F5B83D] shrink-0" />
                          <div className="flex flex-col text-left">
                            <span className="font-semibold leading-tight">{item.label}</span>
                            <span className="text-[10px] text-neutral-400">{item.description}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Auth Actions Section in Mobile Drawer */}
            <div className="pt-4 border-t border-white/10">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F5B83D] text-black flex items-center justify-center font-bold text-xs uppercase">
                        {user.name ? user.name.charAt(0) : "U"}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {user.name || "Member"}
                        </div>
                        <div className="text-xs text-neutral-400">{user.phone}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-[#F5B83D] border border-white/10">
                      {user.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 px-3 text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#F5B83D]" />
                      <span>Dashboard</span>
                    </Link>

                    {isAdmin ? (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 py-3 px-3 text-sm font-semibold text-black bg-[#F5B83D] hover:bg-[#e5a930] rounded-full transition shadow-md"
                      >
                        <Shield className="w-4 h-4 text-black" />
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
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 px-3">
                    Account Access
                  </span>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium text-white border border-white/20 hover:bg-white/5 rounded-full transition"
                    >
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-black bg-[#F5B83D] hover:bg-[#e5a930] rounded-full transition shadow-md shadow-[#F5B83D]/15"
                    >
                      <span>Create Account</span>
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
