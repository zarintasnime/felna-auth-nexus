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
import ThemeToggle from "@/components/theme/ThemeToggle";
import { NavItem } from "@/types/homepage";

export interface SessionUser {
  userId: string;
  name?: string;
  phone: string;
  role: string;
}

<<<<<<< Updated upstream
export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { id: "nav-1", label: "Home", url: "#home", isExternal: false },
  { id: "nav-2", label: "SMS Services", url: "#services", isExternal: false },
  { id: "nav-3", label: "Mobile Bill Solution", url: "#benefits", isExternal: false },
  { id: "nav-4", label: "Services", url: "#services", isExternal: false },
  { id: "nav-5", label: "Pricing", url: "#services", isExternal: false },
  { id: "nav-6", label: "Contact Us", url: "/contact", isExternal: false },
=======
export const SISTER_CONCERN_ITEMS = [
  { label: "Felna Digital Marketing Agency", href: "#" },
  { label: "Felna Online", href: "#" },
  { label: "FelnaTech", href: "#" },
  { label: "IGL Host LLC", href: "#" },
  { label: "IGL Network", href: "#" },
  { label: "IGL Tours and Travels", href: "#" },
  { label: "IGL Web", href: "#" },
  { label: "Student Visa", href: "#" },
];

export const OUR_TEAM_ITEMS = [
  { label: "Board of Directors", href: "/team/directors" },
  { label: "Board of Officers", href: "/team/officers" },
];

export const SERVICES_DROPDOWN_ITEMS = [
  { label: "Facebook Marketing", href: "/#marketing" },
  { label: "SEO", href: "/#why-choose-us" },
  { label: "Content Creator", href: "/#services" },
];

export const CAREER_ITEMS = [
  { label: "Job Post", href: "/career/job-post" },
  { label: "Sign Up", href: "/career/signup" },
>>>>>>> Stashed changes
];

export interface DynamicNavbarProps {
  items?: NavItem[];
  initialSession?: SessionUser | null;
  siteSettings?: {
    siteName?: string | null;
    siteTagline?: string | null;
    logoUrl?: string | null;
  } | null;
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
  { id: "sc-igl-web", label: "IGL Web", href: "/igl-web" },
  { id: "sc-student-visa", label: "Student Visa", href: "/student-visa" },
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
<<<<<<< Updated upstream
  items = DEFAULT_NAV_ITEMS,
=======
>>>>>>> Stashed changes
  initialSession,
  siteSettings,
}: DynamicNavbarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(initialSession ?? null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(initialSession === undefined);

<<<<<<< Updated upstream
  // Dynamic Site Branding States
  const [siteName, setSiteName] = useState<string>(siteSettings?.siteName || "Felna.com");
  const [siteTagline, setSiteTagline] = useState<string>(
    siteSettings?.siteTagline || "Bulk SMS & OTP Gateway"
  );
  const [logoUrl, setLogoUrl] = useState<string | null>(siteSettings?.logoUrl || null);
  const [logoError, setLogoError] = useState(false);

  // Sync state if siteSettings prop changes
  useEffect(() => {
    if (siteSettings) {
      setSiteName(siteSettings.siteName || "Felna.com");
      setSiteTagline(siteSettings.siteTagline || "Bulk SMS & OTP Gateway");
      setLogoUrl(siteSettings.logoUrl || null);
      setLogoError(false);
    }
  }, [siteSettings?.siteName, siteSettings?.siteTagline, siteSettings?.logoUrl]);

  // Client-side fallback to fetch public settings if not provided
  useEffect(() => {
    if (!siteSettings) {
      fetch("/api/cms/settings")
        .then((res) => res.json())
        .then((json) => {
          if (json?.data) {
            if (json.data.siteName) setSiteName(json.data.siteName);
            if (json.data.siteTagline) setSiteTagline(json.data.siteTagline);
            if (json.data.logoUrl) setLogoUrl(json.data.logoUrl);
          }
        })
        .catch(() => {});
    }
  }, [siteSettings]);

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
=======
  // Dropdown states
  const [isSisterConcernDropdownOpen, setIsSisterConcernDropdownOpen] = useState(false);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
  const [isCareerDropdownOpen, setIsCareerDropdownOpen] = useState(false);

  // Mobile accordion states
  const [isMobileSisterConcernExpanded, setIsMobileSisterConcernExpanded] = useState(false);
  const [isMobileTeamExpanded, setIsMobileTeamExpanded] = useState(false);
  const [isMobileServicesExpanded, setIsMobileServicesExpanded] = useState(false);
  const [isMobileContactExpanded, setIsMobileContactExpanded] = useState(false);
  const [isMobileCareerExpanded, setIsMobileCareerExpanded] = useState(false);

  // Refs for outside-click detection
  const sisterConcernDropdownRef = useRef<HTMLDivElement>(null);
  const teamDropdownRef = useRef<HTMLDivElement>(null);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const contactDropdownRef = useRef<HTMLDivElement>(null);
  const careerDropdownRef = useRef<HTMLDivElement>(null);

  // Sync session prop
>>>>>>> Stashed changes
  useEffect(() => {
    if (initialSession !== undefined) {
      setUser(initialSession);
      setIsLoadingSession(false);
    }
  }, [initialSession]);

  // Session fetch fallback
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
<<<<<<< Updated upstream
    setIsSisterConcernOpen(false);
=======
    setIsSisterConcernDropdownOpen(false);
    setIsTeamDropdownOpen(false);
>>>>>>> Stashed changes
    setIsServicesDropdownOpen(false);
    setIsContactDropdownOpen(false);
    setIsCareerDropdownOpen(false);
  }, [pathname]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sisterConcernDropdownRef.current &&
        !sisterConcernDropdownRef.current.contains(event.target as Node)
      ) {
<<<<<<< Updated upstream
        setIsSisterConcernOpen(false);
=======
        setIsSisterConcernDropdownOpen(false);
      }
      if (
        teamDropdownRef.current &&
        !teamDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTeamDropdownOpen(false);
>>>>>>> Stashed changes
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
      if (
        careerDropdownRef.current &&
        !careerDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCareerDropdownOpen(false);
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
<<<<<<< Updated upstream
      setIsSisterConcernOpen(false);
=======
      setIsSisterConcernDropdownOpen(false);
      setIsTeamDropdownOpen(false);
>>>>>>> Stashed changes
      setIsServicesDropdownOpen(false);
      setIsContactDropdownOpen(false);
      setIsCareerDropdownOpen(false);
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

<<<<<<< Updated upstream
  // Resolve cross-page anchor URLs correctly
  const getHref = (url: string) => {
    if (url.startsWith("#")) {
      return pathname === "/" ? url : `/${url}`;
=======
  // Active checks
  const isHomeActive = pathname === "/";
  const isAboutActive = pathname === "/about";
  const isSisterConcernActive = pathname.startsWith("/sister-concern");
  const isTeamActive = pathname.startsWith("/team");
  const isServicesActive = pathname.startsWith("/services");
  const isContactActive = pathname === "/contact" || pathname === "/address" || pathname === "/feedback";
  const isAddressActive = pathname === "/address";
  const isFeedbackActive = pathname === "/feedback";
  const isCareerActive = pathname.startsWith("/career");

  const getHref = (url: string) => {
    if (url.startsWith("#") && pathname !== "/") {
      return `/${url}`;
>>>>>>> Stashed changes
    }
    return url;
  };

  const isContactActive = pathname === "/address" || pathname === "/feedback" || pathname === "/contact";
  const isAboutActive = pathname === "/about";

  return (
<<<<<<< Updated upstream
    <header className="h-[72px] bg-[#E8E4DD]/95 dark:bg-[#12100E]/85 backdrop-blur-[12px] sticky top-0 z-50 transition-all duration-300 border-b border-[#2C2520]/12 dark:border-white/10 w-full">
      <div className="w-full max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 h-full">
        <div className="flex h-full items-center justify-between gap-4">
          {/* =============================================================== */}
          {/* 1. Brand Logo & Identity (Dynamic Logo Image / CSS Monogram)     */}
=======
    <div
      className={`sticky top-0 z-50 w-full h-[72px] bg-[#12100E]/85 backdrop-blur-[12px] border-b border-white/10 transition-all duration-300 flex items-center ${
        pathname !== "/" ? "rounded-b-2xl md:rounded-b-3xl" : ""
      }`}
    >
      <div className="w-full max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 h-full">
        <div className="flex h-full items-center justify-between gap-4">
          {/* =============================================================== */}
          {/* 1. Brand Identity (Logo Monogram & Felna.com Text)              */}
>>>>>>> Stashed changes
          {/* =============================================================== */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
<<<<<<< Updated upstream
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49624]/40 dark:focus-visible:ring-[#F5B83D]/40 rounded-xl py-1 px-1.5"
            >
              {/* Custom Logo Image OR Stylized Amber Monogram */}
              {logoUrl && !logoError ? (
                <div className="h-10 max-w-[180px] flex items-center shrink-0">
                  <img
                    src={logoUrl}
                    alt={siteName}
                    className="h-9 w-auto max-h-10 object-contain group-hover:scale-105 transition-transform"
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D49624] to-[#B8801A] dark:from-[#F5B83D] dark:to-[#E09819] flex items-center justify-center font-bold text-black text-xl shadow-lg shadow-[#D49624]/20 dark:shadow-[#F5B83D]/20 shrink-0 group-hover:scale-105 transition-transform">
                  {siteName ? siteName.charAt(0).toUpperCase() : "F"}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[#2C2520] dark:text-white font-bold text-lg leading-none">
                  {siteName}
                </span>
                <span className="text-[#6E665E] dark:text-neutral-500 text-[11px] font-medium tracking-wide mt-1">
                  {siteTagline}
=======
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B83D]/30 rounded-xl py-1 px-1.5"
            >
              {/* Monogram F */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5B83D] to-[#B88728] flex items-center justify-center font-bold text-black text-xl shadow-[0_0_15px_rgba(245,184,61,0.2)] shrink-0 transition-transform duration-200 group-hover:scale-105">
                F
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white font-bold text-lg leading-none group-hover:text-[#F5B83D] transition-colors">
                  Felna.com
                </span>
                <span className="text-neutral-500 text-[11px] font-medium tracking-wide mt-1">
                  Bulk SMS &amp; OTP Gateway
>>>>>>> Stashed changes
                </span>
              </div>
            </Link>
          </div>

          {/* =============================================================== */}
<<<<<<< Updated upstream
          {/* 2. Streamlined Navigation Links (Desktop)                        */}
=======
          {/* 2. Streamlined Navigation Links (Desktop)                       */}
>>>>>>> Stashed changes
          {/* =============================================================== */}
          <nav
            aria-label="Main Navigation"
            className="hidden xl:flex items-center gap-1 2xl:gap-2"
          >
            {/* 1. Home */}
            <Link
<<<<<<< Updated upstream
              href={getHref("#home")}
              className={`text-[15px] px-3 py-2 rounded-lg font-medium transition-colors ${
                pathname === "/"
                  ? "text-[#D49624] dark:text-[#F5B83D]"
                  : "text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D]"
=======
              href="/"
              className={`text-[15px] px-3.5 py-2 rounded-lg font-medium transition-colors ${
                isHomeActive
                  ? "text-[#F5B83D] font-semibold"
                  : "text-[#E8E3DC] hover:text-[#F5B83D]"
>>>>>>> Stashed changes
              }`}
            >
              Home
            </Link>

            {/* 2. About Us */}
            <Link
              href="/about"
<<<<<<< Updated upstream
              className={`text-[15px] px-3 py-2 rounded-lg font-medium transition-colors ${
                isAboutActive
                  ? "text-[#D49624] dark:text-[#F5B83D]"
                  : "text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D]"
=======
              className={`text-[15px] px-3.5 py-2 rounded-lg font-medium transition-colors ${
                isAboutActive
                  ? "text-[#F5B83D] font-semibold"
                  : "text-[#E8E3DC] hover:text-[#F5B83D]"
>>>>>>> Stashed changes
              }`}
            >
              About Us
            </Link>

<<<<<<< Updated upstream
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
                    ? "text-[#D49624] dark:text-[#F5B83D]"
                    : "text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D]"
                }`}
                aria-haspopup="true"
                aria-expanded={isSisterConcernOpen}
=======
            {/* 3. Sister Concern (Dropdown) */}
            <div
              ref={sisterConcernDropdownRef}
              className="relative group"
              onMouseEnter={() => setIsSisterConcernDropdownOpen(true)}
              onMouseLeave={() => setIsSisterConcernDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSisterConcernDropdownOpen((prev) => !prev);
                }}
                className={`inline-flex items-center gap-1.5 text-[15px] px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer select-none ${
                  isSisterConcernActive
                    ? "text-[#F5B83D] font-semibold"
                    : "text-[#E8E3DC] hover:text-[#F5B83D]"
                }`}
                aria-haspopup="true"
                aria-expanded={isSisterConcernDropdownOpen}
>>>>>>> Stashed changes
              >
                <span>Sister Concern</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
<<<<<<< Updated upstream
                    isSisterConcernOpen
                      ? "rotate-180 text-[#D49624] dark:text-[#F5B83D]"
                      : "text-[#6E665E] dark:text-neutral-400 group-hover:text-[#D49624] dark:group-hover:text-[#F5B83D]"
=======
                    isSisterConcernDropdownOpen
                      ? "rotate-180 text-[#F5B83D]"
                      : "text-neutral-400 group-hover:text-[#F5B83D]"
>>>>>>> Stashed changes
                  }`}
                />
              </button>

<<<<<<< Updated upstream
              {/* Sister Concern Floating Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 w-64 bg-[#E5E2DC] dark:bg-[#1B1815] border border-[#2C2520]/15 dark:border-white/10 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-md transition-all duration-200 before:absolute before:-top-3 before:left-0 before:w-full before:h-3 before:content-[''] ${
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
                    className="block text-[15px] text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:bg-[#2C2520]/5 dark:hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* 4. Our Team */}
            <Link
              href="/about#team"
              className="text-[15px] text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D] font-medium transition-colors px-3 py-2 rounded-lg"
            >
              Our Team
            </Link>

            {/* 5. SMS Services */}
            <Link
              href={getHref("#services")}
              className="text-[15px] text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D] font-medium transition-colors px-3 py-2 rounded-lg"
            >
              SMS Services
            </Link>

            {/* 6. Mobile Bill Solution */}
            <Link
              href={getHref("#benefits")}
              className="text-[15px] text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D] font-medium transition-colors px-3 py-2 rounded-lg"
            >
              Mobile Bill Solution
            </Link>

            {/* 7. Services Dropdown (Without Sister Concern) */}
=======
              {/* Floating Sister Concern Dropdown */}
              <div
                className={`absolute top-full left-0 mt-2 w-64 bg-[#1B1815] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 before:absolute before:-top-3 before:left-0 before:w-full before:h-3 before:content-[''] ${
                  isSisterConcernDropdownOpen
                    ? "!opacity-100 !visible pointer-events-auto"
                    : "pointer-events-none group-hover:pointer-events-auto"
                }`}
                role="menu"
              >
                <div className="space-y-0.5">
                  {SISTER_CONCERN_ITEMS.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setIsSisterConcernDropdownOpen(false)}
                      className="block text-[15px] text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Our Team (Dropdown) */}
            <div
              ref={teamDropdownRef}
              className="relative group"
              onMouseEnter={() => setIsTeamDropdownOpen(true)}
              onMouseLeave={() => setIsTeamDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsTeamDropdownOpen((prev) => !prev);
                }}
                className={`inline-flex items-center gap-1.5 text-[15px] px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer select-none ${
                  isTeamActive
                    ? "text-[#F5B83D] font-semibold"
                    : "text-[#E8E3DC] hover:text-[#F5B83D]"
                }`}
                aria-haspopup="true"
                aria-expanded={isTeamDropdownOpen}
              >
                <span>Our Team</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isTeamDropdownOpen
                      ? "rotate-180 text-[#F5B83D]"
                      : "text-neutral-400 group-hover:text-[#F5B83D]"
                  }`}
                />
              </button>

              {/* Floating Our Team Dropdown */}
              <div
                className={`absolute top-full left-0 mt-2 w-56 bg-[#1B1815] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 before:absolute before:-top-3 before:left-0 before:w-full before:h-3 before:content-[''] ${
                  isTeamDropdownOpen ? "!opacity-100 !visible pointer-events-auto" : "pointer-events-none group-hover:pointer-events-auto"
                }`}
                role="menu"
              >
                <div className="space-y-0.5">
                  {OUR_TEAM_ITEMS.map((item) => {
                    const isItemActive = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        role="menuitem"
                        onClick={() => setIsTeamDropdownOpen(false)}
                        className={`block text-[15px] text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors ${
                          isItemActive
                            ? "bg-white/10 !text-[#F5B83D] font-semibold"
                            : ""
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Services (New Dropdown) */}
>>>>>>> Stashed changes
            <div
              ref={servicesDropdownRef}
              className="relative group"
              onMouseEnter={() => setIsServicesDropdownOpen(true)}
              onMouseLeave={() => setIsServicesDropdownOpen(false)}
            >
              <button
                type="button"
<<<<<<< Updated upstream
                onClick={() => setIsServicesDropdownOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 text-[15px] px-3 py-2 rounded-lg font-medium transition-colors select-none ${
                  isServicesDropdownOpen
                    ? "text-[#D49624] dark:text-[#F5B83D]"
                    : "text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D]"
=======
                onClick={(e) => {
                  e.preventDefault();
                  setIsServicesDropdownOpen((prev) => !prev);
                }}
                className={`inline-flex items-center gap-1.5 text-[15px] px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer select-none ${
                  isServicesActive
                    ? "text-[#F5B83D] font-semibold"
                    : "text-[#E8E3DC] hover:text-[#F5B83D]"
>>>>>>> Stashed changes
                }`}
                aria-haspopup="true"
                aria-expanded={isServicesDropdownOpen}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isServicesDropdownOpen
<<<<<<< Updated upstream
                      ? "rotate-180 text-[#D49624] dark:text-[#F5B83D]"
                      : "text-[#6E665E] dark:text-neutral-400 group-hover:text-[#D49624] dark:group-hover:text-[#F5B83D]"
=======
                      ? "rotate-180 text-[#F5B83D]"
                      : "text-neutral-400 group-hover:text-[#F5B83D]"
>>>>>>> Stashed changes
                  }`}
                />
              </button>

<<<<<<< Updated upstream
              {/* Floating Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 w-64 bg-[#E5E2DC] dark:bg-[#1B1815] border border-[#2C2520]/15 dark:border-white/10 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-md transition-all duration-200 before:absolute before:-top-3 before:left-0 before:w-full before:h-3 before:content-[''] ${
=======
              {/* Floating Services Dropdown */}
              <div
                className={`absolute top-full left-0 mt-2 w-64 bg-[#1B1815] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 transition-all duration-200 before:absolute before:-top-3 before:left-0 before:w-full before:h-3 before:content-[''] ${
>>>>>>> Stashed changes
                  isServicesDropdownOpen
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible pointer-events-none -translate-y-1"
                }`}
                role="menu"
              >
<<<<<<< Updated upstream
                {SERVICES_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={getHref(item.href)}
                      role="menuitem"
                      onClick={() => setIsServicesDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group/item text-[#3D3630] dark:text-neutral-300 hover:bg-[#2C2520]/5 dark:hover:bg-white/5 hover:text-[#D49624] dark:hover:text-[#F5B83D]"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#DEDAD3] dark:bg-[#24201C] border border-[#2C2520]/15 dark:border-white/10 flex items-center justify-center text-[#D49624] dark:text-[#F5B83D] shrink-0 group-hover/item:border-[#D49624]/40 dark:group-hover/item:border-[#F5B83D]/40 transition-colors">
                        <Icon className="w-4 h-4 text-[#D49624] dark:text-[#F5B83D]" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold text-[#2C2520] dark:text-white group-hover/item:text-[#D49624] dark:group-hover/item:text-[#F5B83D] transition-colors leading-tight">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-[#6E665E] dark:text-neutral-400 group-hover/item:text-[#3D3630] dark:group-hover/item:text-neutral-300 transition-colors">
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
              className="text-[15px] text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D] font-medium transition-colors px-3 py-2 rounded-lg"
=======
                <div className="space-y-0.5">
                  {SERVICES_DROPDOWN_ITEMS.map((item) => (
                    <Link
                      key={item.label}
                      href={getHref(item.href)}
                      role="menuitem"
                      onClick={() => setIsServicesDropdownOpen(false)}
                      className="block px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-[#F5B83D] hover:bg-white/5 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Pricing */}
            <Link
              href={getHref("#pricing")}
              className="text-[15px] text-[#E8E3DC] hover:text-[#F5B83D] font-medium px-3.5 py-2 rounded-lg transition-colors"
>>>>>>> Stashed changes
            >
              Pricing
            </Link>

<<<<<<< Updated upstream
            {/* 9. Contact Us Dropdown */}
=======
            {/* 6. Contact Us (Dropdown with Address & Feedback) */}
>>>>>>> Stashed changes
            <div
              ref={contactDropdownRef}
              className="relative group"
              onMouseEnter={() => setIsContactDropdownOpen(true)}
              onMouseLeave={() => setIsContactDropdownOpen(false)}
            >
              <button
                type="button"
<<<<<<< Updated upstream
                onClick={() => setIsContactDropdownOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 text-[15px] px-3 py-2 rounded-lg font-medium transition-colors select-none ${
                  isContactDropdownOpen || isContactActive
                    ? "text-[#D49624] dark:text-[#F5B83D]"
                    : "text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D]"
=======
                onClick={(e) => {
                  e.preventDefault();
                  setIsContactDropdownOpen((prev) => !prev);
                }}
                className={`inline-flex items-center gap-1.5 text-[15px] px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer select-none ${
                  isContactActive
                    ? "text-[#F5B83D] font-semibold"
                    : "text-[#E8E3DC] hover:text-[#F5B83D]"
>>>>>>> Stashed changes
                }`}
                aria-haspopup="true"
                aria-expanded={isContactDropdownOpen}
              >
                <span>Contact Us</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isContactDropdownOpen
<<<<<<< Updated upstream
                      ? "rotate-180 text-[#D49624] dark:text-[#F5B83D]"
                      : "text-[#6E665E] dark:text-neutral-400 group-hover:text-[#D49624] dark:group-hover:text-[#F5B83D]"
=======
                      ? "rotate-180 text-[#F5B83D]"
                      : "text-neutral-400 group-hover:text-[#F5B83D]"
>>>>>>> Stashed changes
                  }`}
                />
              </button>

<<<<<<< Updated upstream
              {/* Floating Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 w-60 bg-[#E5E2DC] dark:bg-[#1B1815] border border-[#2C2520]/15 dark:border-white/10 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-md transition-all duration-200 before:absolute before:-top-3 before:left-0 before:w-full before:h-3 before:content-[''] ${
=======
              {/* Floating Contact Dropdown */}
              <div
                className={`absolute top-full left-0 mt-2 w-60 bg-[#1B1815] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 transition-all duration-200 before:absolute before:-top-3 before:left-0 before:w-full before:h-3 before:content-[''] ${
>>>>>>> Stashed changes
                  isContactDropdownOpen
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible pointer-events-none -translate-y-1"
                }`}
                role="menu"
              >
<<<<<<< Updated upstream
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
                          ? "bg-[#2C2520]/10 dark:bg-white/10 text-[#D49624] dark:text-[#F5B83D] font-semibold"
                          : "text-[#3D3630] dark:text-neutral-300 hover:bg-[#2C2520]/5 dark:hover:bg-white/5 hover:text-[#D49624] dark:hover:text-[#F5B83D]"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#DEDAD3] dark:bg-[#24201C] border border-[#2C2520]/15 dark:border-white/10 flex items-center justify-center text-[#D49624] dark:text-[#F5B83D] shrink-0 group-hover/item:border-[#D49624]/40 dark:group-hover/item:border-[#F5B83D]/40 transition-colors">
                        <Icon className="w-4 h-4 text-[#D49624] dark:text-[#F5B83D]" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold text-[#2C2520] dark:text-white group-hover/item:text-[#D49624] dark:group-hover/item:text-[#F5B83D] transition-colors leading-tight">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-[#6E665E] dark:text-neutral-400 group-hover/item:text-[#3D3630] dark:group-hover/item:text-neutral-300 transition-colors">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  );
                })}
=======
                <Link
                  href="/address"
                  role="menuitem"
                  onClick={() => setIsContactDropdownOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group/item ${
                    isAddressActive
                      ? "bg-white/10 text-[#F5B83D] font-semibold"
                      : "text-neutral-300 hover:bg-white/5 hover:text-[#F5B83D]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#24201C] border border-white/10 flex items-center justify-center text-[#F5B83D] shrink-0 group-hover/item:border-[#F5B83D]/40 transition-colors">
                    <MapPin className="w-4 h-4 text-[#F5B83D]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-white group-hover/item:text-[#F5B83D] transition-colors leading-tight">
                      Address
                    </span>
                    <span className="text-[11px] text-neutral-400 group-hover/item:text-neutral-300 transition-colors">
                      Dhaka &amp; Chittagong offices
                    </span>
                  </div>
                </Link>

                <Link
                  href="/feedback"
                  role="menuitem"
                  onClick={() => setIsContactDropdownOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group/item mt-1 ${
                    isFeedbackActive
                      ? "bg-white/10 text-[#F5B83D] font-semibold"
                      : "text-neutral-300 hover:bg-white/5 hover:text-[#F5B83D]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#24201C] border border-white/10 flex items-center justify-center text-[#F5B83D] shrink-0 group-hover/item:border-[#F5B83D]/40 transition-colors">
                    <MessageSquare className="w-4 h-4 text-[#F5B83D]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-white group-hover/item:text-[#F5B83D] transition-colors leading-tight">
                      Feedback
                    </span>
                    <span className="text-[11px] text-neutral-400 group-hover/item:text-neutral-300 transition-colors">
                      Send an inquiry or message
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            {/* 7. Career (Dropdown) */}
            <div
              ref={careerDropdownRef}
              className="relative group"
              onMouseEnter={() => setIsCareerDropdownOpen(true)}
              onMouseLeave={() => setIsCareerDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsCareerDropdownOpen((prev) => !prev);
                }}
                className={`inline-flex items-center gap-1.5 text-[15px] px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer select-none ${
                  isCareerActive
                    ? "text-[#F5B83D] font-semibold"
                    : "text-[#E8E3DC] hover:text-[#F5B83D]"
                }`}
                aria-haspopup="true"
                aria-expanded={isCareerDropdownOpen}
              >
                <span>Career</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCareerDropdownOpen
                      ? "rotate-180 text-[#F5B83D]"
                      : "text-neutral-400 group-hover:text-[#F5B83D]"
                  }`}
                />
              </button>

              {/* Floating Career Dropdown */}
              <div
                className={`absolute top-full left-0 mt-2 min-w-[200px] bg-[#1B1815] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 before:absolute before:-top-3 before:left-0 before:w-full before:h-3 before:content-[''] ${
                  isCareerDropdownOpen
                    ? "!opacity-100 !visible pointer-events-auto"
                    : "pointer-events-none group-hover:pointer-events-auto"
                }`}
                role="menu"
              >
                <div className="space-y-0.5">
                  {CAREER_ITEMS.map((item) => {
                    const isItemActive = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        role="menuitem"
                        onClick={() => setIsCareerDropdownOpen(false)}
                        className={`block text-[14px] text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap ${
                          isItemActive
                            ? "bg-white/10 !text-[#F5B83D] font-semibold"
                            : ""
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
>>>>>>> Stashed changes
              </div>
            </div>
          </nav>

          {/* =============================================================== */}
<<<<<<< Updated upstream
          {/* 3. Call-to-Action Buttons & Theme Toggle (Desktop)               */}
=======
          {/* 3. Call-to-Action Buttons (Hierarchy Fix)                       */}
>>>>>>> Stashed changes
          {/* =============================================================== */}
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            {/* Desktop Theme Switcher */}
            <ThemeToggle size="md" />

            {isLoadingSession ? (
<<<<<<< Updated upstream
              <div className="h-10 w-44 bg-[#2C2520]/10 dark:bg-white/5 animate-pulse rounded-full" />
=======
              <div className="h-10 w-44 bg-white/5 animate-pulse rounded-full" />
>>>>>>> Stashed changes
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* Member Dashboard Link */}
                <Link
                  href="/dashboard"
<<<<<<< Updated upstream
                  className="inline-flex items-center gap-2 px-4 h-10 text-sm font-medium text-[#2C2520] dark:text-white hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:bg-[#2C2520]/5 dark:hover:bg-white/5 border border-[#2C2520]/20 dark:border-white/20 rounded-full transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#D49624] dark:text-[#F5B83D]" />
=======
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-full text-sm font-medium text-white border border-white/20 hover:bg-white/5 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#F5B83D]" />
>>>>>>> Stashed changes
                  <span>Dashboard</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
<<<<<<< Updated upstream
                    className="inline-flex items-center gap-2 px-4 h-10 text-sm font-semibold text-[#1B1815] dark:text-black bg-[#D49624] dark:bg-[#F5B83D] hover:bg-[#c2861b] dark:hover:bg-[#e5a930] rounded-full transition-all shadow-md shadow-[#D49624]/10 dark:shadow-[#F5B83D]/10"
                  >
                    <Shield className="w-4 h-4 text-[#1B1815] dark:text-black" />
=======
                    className="inline-flex items-center gap-2 h-10 px-5 rounded-full text-sm font-semibold text-black bg-[#F5B83D] hover:bg-[#e5a930] transition-colors shadow-md shadow-[#F5B83D]/10"
                  >
                    <Shield className="w-4 h-4 text-black" />
>>>>>>> Stashed changes
                    <span>Admin</span>
                  </Link>
                )}

<<<<<<< Updated upstream
                {/* User Avatar & Role Badge */}
                <div className="flex items-center gap-2.5 pl-3.5 pr-3 h-10 bg-[#2C2520]/5 dark:bg-white/5 border border-[#2C2520]/12 dark:border-white/10 rounded-full text-sm">
                  <div className="w-6 h-6 rounded-full bg-[#D49624] dark:bg-[#F5B83D] text-[#1B1815] dark:text-black flex items-center justify-center font-bold text-xs uppercase">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                  <span className="font-medium text-[#2C2520] dark:text-white max-w-[120px] truncate">
                    {user.name || "Member"}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2C2520]/10 dark:bg-white/10 text-[#D49624] dark:text-[#F5B83D] border border-[#2C2520]/15 dark:border-white/10">
=======
                {/* User Avatar & Role */}
                <div className="h-10 pl-3 pr-3.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2.5 text-xs text-neutral-300">
                  <div className="w-6 h-6 rounded-full bg-[#F5B83D] text-black flex items-center justify-center font-bold text-xs uppercase">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                  <span className="font-semibold text-white max-w-[120px] truncate">
                    {user.name || "Member"}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-[#F5B83D] border border-white/10">
>>>>>>> Stashed changes
                    {user.role}
                  </span>
                </div>

                {/* Sign Out Button */}
                <LogoutButton variant="navbar" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
<<<<<<< Updated upstream
                {/* Secondary Ghost Button for Sign In */}
                <Link
                  href="/login"
                  className="bg-transparent text-[#2C2520] dark:text-white border border-[#2C2520]/25 dark:border-white/20 hover:bg-[#2C2520]/5 dark:hover:bg-white/5 rounded-full h-10 px-6 font-medium transition-all inline-flex items-center justify-center text-sm"
=======
                {/* Sign In (Secondary: Ghost button style) */}
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center bg-transparent text-white border border-white/20 hover:bg-white/5 rounded-full h-10 px-6 font-medium text-sm transition-all"
>>>>>>> Stashed changes
                >
                  <span>Sign In</span>
                </Link>

<<<<<<< Updated upstream
                {/* Primary Solid Amber Pill for Create Account */}
                <Link
                  href="/register"
                  className="bg-[#D49624] dark:bg-[#F5B83D] text-[#1B1815] dark:text-black font-semibold rounded-full h-10 px-6 hover:bg-[#c2861b] dark:hover:bg-[#e5a930] transition-colors inline-flex items-center justify-center text-sm shadow-md shadow-[#D49624]/15 dark:shadow-[#F5B83D]/15"
=======
                {/* Create Account (Primary: Solid amber pill) */}
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center bg-[#F5B83D] text-black font-semibold rounded-full h-10 px-6 hover:bg-[#e5a930] text-sm transition-colors shadow-md shadow-[#F5B83D]/15"
>>>>>>> Stashed changes
                >
                  <span>Create Account</span>
                </Link>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* 4. Mobile Menu Hamburger Toggle                                 */}
          {/* =============================================================== */}
<<<<<<< Updated upstream
          <div className="flex xl:hidden items-center gap-2">
            <ThemeToggle size="sm" />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D] bg-[#2C2520]/5 dark:bg-white/5 hover:bg-[#2C2520]/10 dark:hover:bg-white/10 border border-[#2C2520]/12 dark:border-white/10 transition"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
=======
          <div className="xl:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/5 transition focus:outline-none"
              aria-label="Open navigation menu"
>>>>>>> Stashed changes
              aria-expanded={isMobileMenuOpen}
            >
<<<<<<< Updated upstream
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
=======
              <Menu className="w-6 h-6 text-white" />
>>>>>>> Stashed changes
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
<<<<<<< Updated upstream
      {/* 5. Mobile Slide-out Menu Drawer                                     */}
      {/* =================================================================== */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 z-40 bg-[#12100E]/75 backdrop-blur-sm xl:hidden transition-opacity"
=======
      {/* 5. Mobile Navigation Drawer (Seamless Dark Theme)                   */}
      {/* =================================================================== */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm xl:hidden animate-in fade-in duration-200"
>>>>>>> Stashed changes
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

<<<<<<< Updated upstream
          {/* Drawer Content */}
          <nav
            id="mobile-navigation-drawer"
            aria-label="Mobile Navigation"
            className="fixed inset-x-0 top-0 z-50 max-h-[100vh] overflow-y-auto border-b border-[#2C2520]/15 dark:border-white/10 bg-[#F4F1EA] dark:bg-[#12100E] px-6 py-6 space-y-6 shadow-2xl xl:hidden animate-in slide-in-from-top-2 duration-200 text-[#2C2520] dark:text-[#E8E3DC]"
          >
            {/* Header row in mobile drawer */}
            <div className="flex items-center justify-between pb-4 border-b border-[#2C2520]/12 dark:border-white/10">
              <div className="flex items-center gap-3">
                {logoUrl && !logoError ? (
                  <div className="h-10 max-w-[150px] flex items-center shrink-0">
                    <img
                      src={logoUrl}
                      alt={siteName}
                      className="h-8 w-auto max-h-9 object-contain"
                      onError={() => setLogoError(true)}
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D49624] to-[#B8801A] dark:from-[#F5B83D] dark:to-[#E09819] flex items-center justify-center font-bold text-black text-xl shadow-lg shadow-[#D49624]/20 dark:shadow-[#F5B83D]/20 shrink-0">
                    {siteName ? siteName.charAt(0).toUpperCase() : "F"}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-[#2C2520] dark:text-white font-bold text-base leading-none">
                    {siteName}
                  </span>
                  <span className="text-[#6E665E] dark:text-neutral-500 text-[10px] font-medium tracking-wide mt-1">
                    {siteTagline}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle size="sm" />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-[#6E665E] dark:text-neutral-400 hover:text-[#2C2520] dark:hover:text-white hover:bg-[#2C2520]/5 dark:hover:bg-white/5 transition"
                  aria-label="Close navigation menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
=======
          {/* Drawer Menu */}
          <nav
            id="mobile-navigation-drawer"
            aria-label="Mobile Navigation"
            className="fixed inset-x-0 top-0 z-50 max-h-[100vh] overflow-y-auto border-b border-white/10 bg-[#12100E] px-6 py-6 space-y-6 shadow-2xl xl:hidden animate-in slide-in-from-top-2 duration-200 text-white"
          >
            {/* Header row in mobile drawer */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5B83D] to-[#B88728] flex items-center justify-center font-bold text-black text-xl shadow-[0_0_15px_rgba(245,184,61,0.2)] shrink-0">
                  F
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-base leading-none">
                    Felna.com
                  </span>
                  <span className="text-[10px] text-neutral-500 font-medium tracking-wide mt-1">
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
                <X className="w-6 h-6 text-white" />
              </button>
>>>>>>> Stashed changes
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
<<<<<<< Updated upstream
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E665E] dark:text-neutral-500 px-3">
=======
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 px-3">
>>>>>>> Stashed changes
                Navigation
              </span>

              <div className="pt-2 space-y-1.5">
                {/* 1. Home */}
                <Link
<<<<<<< Updated upstream
                  href={getHref("#home")}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:bg-[#2C2520]/5 dark:hover:bg-white/5 transition-all"
=======
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base transition-colors ${
                    isHomeActive
                      ? "text-[#F5B83D] font-semibold bg-white/5"
                      : "text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 font-medium"
                  }`}
>>>>>>> Stashed changes
                >
                  <span>Home</span>
                </Link>

                {/* 2. About Us */}
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
<<<<<<< Updated upstream
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:bg-[#2C2520]/5 dark:hover:bg-white/5 transition-all"
=======
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base transition-colors ${
                    isAboutActive
                      ? "text-[#F5B83D] font-semibold bg-white/5"
                      : "text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 font-medium"
                  }`}
>>>>>>> Stashed changes
                >
                  <span>About Us</span>
                </Link>

<<<<<<< Updated upstream
                {/* 3. Sister Concern Accordion */}
=======
                {/* 3. Sister Concern (Accordion) */}
>>>>>>> Stashed changes
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setIsMobileSisterConcernExpanded((prev) => !prev)}
<<<<<<< Updated upstream
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:bg-[#2C2520]/5 dark:hover:bg-white/5 transition-all"
=======
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base transition-colors ${
                      isSisterConcernActive
                        ? "text-[#F5B83D] font-semibold bg-white/5"
                        : "text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 font-medium"
                    }`}
>>>>>>> Stashed changes
                    aria-label="Toggle sister concern options"
                    aria-expanded={isMobileSisterConcernExpanded}
                  >
                    <span>Sister Concern</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
<<<<<<< Updated upstream
                        isMobileSisterConcernExpanded ? "rotate-180 text-[#D49624] dark:text-[#F5B83D]" : "text-[#6E665E] dark:text-neutral-400"
=======
                        isMobileSisterConcernExpanded ? "rotate-180 text-[#F5B83D]" : "text-neutral-400"
>>>>>>> Stashed changes
                      }`}
                    />
                  </button>

                  <div
<<<<<<< Updated upstream
                    className={`pl-4 pr-2 space-y-1 border-l-2 border-[#2C2520]/12 dark:border-white/10 ml-4 transition-all duration-200 ${
                      isMobileSisterConcernExpanded ? "block" : "hidden"
=======
                    className={`pl-4 pr-2 space-y-1 border-l-2 border-white/10 ml-4 transition-all duration-200 ${
                      isMobileSisterConcernExpanded || isSisterConcernActive ? "block" : "hidden"
>>>>>>> Stashed changes
                    }`}
                  >
                    {SISTER_CONCERN_ITEMS.map((item) => (
                      <Link
<<<<<<< Updated upstream
                        key={item.id}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-[15px] text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:bg-[#2C2520]/5 dark:hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors"
=======
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-lg text-sm text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 transition-colors"
>>>>>>> Stashed changes
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

<<<<<<< Updated upstream
                {/* 4. Our Team */}
                <Link
                  href="/about#team"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:bg-[#2C2520]/5 dark:hover:bg-white/5 transition-all"
                >
                  <span>Our Team</span>
                </Link>

                {/* 5. SMS Services */}
                <Link
                  href={getHref("#services")}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:bg-[#2C2520]/5 dark:hover:bg-white/5 transition-all"
                >
                  <span>SMS Services</span>
                </Link>

                {/* 6. Mobile Bill Solution */}
                <Link
                  href={getHref("#benefits")}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:bg-[#2C2520]/5 dark:hover:bg-white/5 transition-all"
                >
                  <span>Mobile Bill Solution</span>
                </Link>

                {/* 7. Services Accordion */}
=======
                {/* 3. Our Team (Accordion) */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setIsMobileTeamExpanded((prev) => !prev)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base transition-colors ${
                      isTeamActive
                        ? "text-[#F5B83D] font-semibold bg-white/5"
                        : "text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 font-medium"
                    }`}
                    aria-label="Toggle team options"
                    aria-expanded={isMobileTeamExpanded}
                  >
                    <span>Our Team</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isMobileTeamExpanded ? "rotate-180 text-[#F5B83D]" : "text-neutral-400"
                      }`}
                    />
                  </button>

                  <div
                    className={`pl-4 pr-2 space-y-1 border-l-2 border-white/10 ml-4 transition-all duration-200 ${
                      isMobileTeamExpanded || isTeamActive ? "block" : "hidden"
                    }`}
                  >
                    {OUR_TEAM_ITEMS.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          pathname === item.href
                            ? "text-[#F5B83D] font-semibold bg-white/10"
                            : "text-neutral-300 hover:text-[#F5B83D] hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 4. Services (Accordion) */}
>>>>>>> Stashed changes
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setIsMobileServicesExpanded((prev) => !prev)}
<<<<<<< Updated upstream
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:bg-[#2C2520]/5 dark:hover:bg-white/5 transition-all"
=======
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base transition-colors ${
                      isServicesActive
                        ? "text-[#F5B83D] font-semibold bg-white/5"
                        : "text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 font-medium"
                    }`}
>>>>>>> Stashed changes
                    aria-label="Toggle services options"
                    aria-expanded={isMobileServicesExpanded}
                  >
                    <span>Services</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
<<<<<<< Updated upstream
                        isMobileServicesExpanded ? "rotate-180 text-[#D49624] dark:text-[#F5B83D]" : "text-[#6E665E] dark:text-neutral-400"
=======
                        isMobileServicesExpanded ? "rotate-180 text-[#F5B83D]" : "text-neutral-400"
>>>>>>> Stashed changes
                      }`}
                    />
                  </button>

                  <div
<<<<<<< Updated upstream
                    className={`pl-4 pr-2 space-y-1 border-l-2 border-[#2C2520]/12 dark:border-white/10 ml-4 transition-all duration-200 ${
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
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#3D3630] dark:text-neutral-300 hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:bg-[#2C2520]/5 dark:hover:bg-white/5 transition-all"
                        >
                          <Icon className="w-4 h-4 text-[#D49624] dark:text-[#F5B83D] shrink-0" />
                          <div className="flex flex-col text-left">
                            <span className="font-semibold text-[#2C2520] dark:text-white leading-tight">{item.label}</span>
                            <span className="text-[10px] text-[#6E665E] dark:text-neutral-400">{item.description}</span>
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
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:bg-[#2C2520]/5 dark:hover:bg-white/5 transition-all"
=======
                    className={`pl-4 pr-2 space-y-1 border-l-2 border-white/10 ml-4 transition-all duration-200 ${
                      isMobileServicesExpanded || isServicesActive ? "block" : "hidden"
                    }`}
                  >
                    {SERVICES_DROPDOWN_ITEMS.map((item) => (
                      <Link
                        key={item.label}
                        href={getHref(item.href)}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-lg text-sm text-neutral-300 hover:text-[#F5B83D] hover:bg-white/5 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 5. Pricing */}
                <Link
                  href={getHref("#pricing")}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-base text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 font-medium transition-colors"
>>>>>>> Stashed changes
                >
                  <span>Pricing</span>
                </Link>

<<<<<<< Updated upstream
                {/* 9. Contact Us Accordion */}
=======
                {/* 6. Contact Us (Accordion) */}
>>>>>>> Stashed changes
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setIsMobileContactExpanded((prev) => !prev)}
<<<<<<< Updated upstream
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-[#3D3630] dark:text-[#E8E3DC] hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:bg-[#2C2520]/5 dark:hover:bg-white/5 transition-all"
=======
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base transition-colors ${
                      isContactActive
                        ? "text-[#F5B83D] font-semibold bg-white/5"
                        : "text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 font-medium"
                    }`}
>>>>>>> Stashed changes
                    aria-label="Toggle contact options"
                    aria-expanded={isMobileContactExpanded}
                  >
                    <span>Contact Us</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
<<<<<<< Updated upstream
                        isMobileContactExpanded ? "rotate-180 text-[#D49624] dark:text-[#F5B83D]" : "text-[#6E665E] dark:text-neutral-400"
=======
                        isMobileContactExpanded ? "rotate-180 text-[#F5B83D]" : "text-neutral-400"
>>>>>>> Stashed changes
                      }`}
                    />
                  </button>

                  <div
<<<<<<< Updated upstream
                    className={`pl-4 pr-2 space-y-1 border-l-2 border-[#2C2520]/12 dark:border-white/10 ml-4 transition-all duration-200 ${
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
                              ? "text-[#D49624] dark:text-[#F5B83D] font-semibold bg-[#2C2520]/10 dark:bg-white/10"
                              : "text-[#3D3630] dark:text-neutral-300 hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:bg-[#2C2520]/5 dark:hover:bg-white/5"
                          }`}
                        >
                          <Icon className="w-4 h-4 text-[#D49624] dark:text-[#F5B83D] shrink-0" />
                          <div className="flex flex-col text-left">
                            <span className="font-semibold text-[#2C2520] dark:text-white leading-tight">{item.label}</span>
                            <span className="text-[10px] text-[#6E665E] dark:text-neutral-400">{item.description}</span>
                          </div>
                        </Link>
                      );
                    })}
=======
                    className={`pl-4 pr-2 space-y-1 border-l-2 border-white/10 ml-4 transition-all duration-200 ${
                      isMobileContactExpanded || isContactActive ? "block" : "hidden"
                    }`}
                  >
                    <Link
                      href="/address"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        isAddressActive
                          ? "text-[#F5B83D] font-semibold bg-white/10"
                          : "text-neutral-300 hover:text-[#F5B83D] hover:bg-white/5"
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-[#F5B83D]" />
                      <div className="flex flex-col text-left">
                        <span className="font-semibold leading-tight">Address</span>
                        <span className="text-[10px] text-neutral-400">Dhaka &amp; Chittagong offices</span>
                      </div>
                    </Link>

                    <Link
                      href="/feedback"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        isFeedbackActive
                          ? "text-[#F5B83D] font-semibold bg-white/10"
                          : "text-neutral-300 hover:text-[#F5B83D] hover:bg-white/5"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 text-[#F5B83D]" />
                      <div className="flex flex-col text-left">
                        <span className="font-semibold leading-tight">Feedback</span>
                        <span className="text-[10px] text-neutral-400">Send an inquiry or message</span>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* 7. Career (Accordion) */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setIsMobileCareerExpanded((prev) => !prev)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base transition-colors ${
                      isCareerActive
                        ? "text-[#F5B83D] font-semibold bg-white/5"
                        : "text-[#E8E3DC] hover:text-[#F5B83D] hover:bg-white/5 font-medium"
                    }`}
                    aria-label="Toggle career options"
                    aria-expanded={isMobileCareerExpanded}
                  >
                    <span>Career</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isMobileCareerExpanded ? "rotate-180 text-[#F5B83D]" : "text-neutral-400"
                      }`}
                    />
                  </button>

                  <div
                    className={`pl-4 pr-2 space-y-1 border-l-2 border-white/10 ml-4 transition-all duration-200 ${
                      isMobileCareerExpanded || isCareerActive ? "block" : "hidden"
                    }`}
                  >
                    {CAREER_ITEMS.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          pathname === item.href
                            ? "text-[#F5B83D] font-semibold bg-white/10"
                            : "text-neutral-300 hover:text-[#F5B83D] hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
>>>>>>> Stashed changes
                  </div>
                </div>
              </div>
            </div>

<<<<<<< Updated upstream
            {/* Auth Actions Section in Mobile Drawer */}
            <div className="pt-4 border-t border-[#2C2520]/12 dark:border-white/10">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#2C2520]/5 dark:bg-white/5 border border-[#2C2520]/12 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#D49624] dark:bg-[#F5B83D] text-[#1B1815] dark:text-black flex items-center justify-center font-bold text-xs uppercase">
                        {user.name ? user.name.charAt(0) : "U"}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#2C2520] dark:text-white">
                          {user.name || "Member"}
                        </div>
                        <div className="text-xs text-[#6E665E] dark:text-neutral-400">{user.phone}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#2C2520]/10 dark:bg-white/10 text-[#D49624] dark:text-[#F5B83D] border border-[#2C2520]/15 dark:border-white/10">
=======
            {/* Auth Actions Section */}
            <div className="pt-4 border-t border-white/10">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F5B83D] text-black flex items-center justify-center font-bold text-xs uppercase">
                        {user.name ? user.name.charAt(0) : "U"}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">
                          {user.name || "Member"}
                        </div>
                        <div className="text-xs text-neutral-400">{user.phone}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-[#F5B83D] border border-white/10">
>>>>>>> Stashed changes
                      {user.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
<<<<<<< Updated upstream
                      className="flex items-center justify-center gap-2 py-3 px-3 text-sm font-medium text-[#2C2520] dark:text-white bg-[#2C2520]/5 dark:bg-white/5 hover:bg-[#2C2520]/10 dark:hover:bg-white/10 border border-[#2C2520]/12 dark:border-white/10 rounded-full transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#D49624] dark:text-[#F5B83D]" />
=======
                      className="flex items-center justify-center gap-2 py-3 px-3 text-sm font-bold text-white bg-white/10 hover:bg-white/15 border border-white/10 rounded-full transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#F5B83D]" />
>>>>>>> Stashed changes
                      <span>Dashboard</span>
                    </Link>

                    {isAdmin ? (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
<<<<<<< Updated upstream
                        className="flex items-center justify-center gap-2 py-3 px-3 text-sm font-semibold text-[#1B1815] dark:text-black bg-[#D49624] dark:bg-[#F5B83D] hover:bg-[#c2861b] dark:hover:bg-[#e5a930] rounded-full transition shadow-md"
                      >
                        <Shield className="w-4 h-4 text-[#1B1815] dark:text-black" />
=======
                        className="flex items-center justify-center gap-2 py-3 px-3 text-sm font-bold text-black bg-[#F5B83D] hover:bg-[#e5a930] rounded-full transition"
                      >
                        <Shield className="w-4 h-4 text-black" />
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E665E] dark:text-neutral-500 px-3">
=======
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 px-3">
>>>>>>> Stashed changes
                    Account Access
                  </span>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* Sign In (Secondary: Ghost button) */}
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
<<<<<<< Updated upstream
                      className="flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium text-[#2C2520] dark:text-white border border-[#2C2520]/25 dark:border-white/20 hover:bg-[#2C2520]/5 dark:hover:bg-white/5 rounded-full transition"
=======
                      className="flex items-center justify-center bg-transparent text-white border border-white/20 hover:bg-white/5 rounded-full h-11 px-4 font-medium text-sm transition-all"
>>>>>>> Stashed changes
                    >
                      <span>Sign In</span>
                    </Link>

                    {/* Create Account (Primary: Solid amber pill) */}
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
<<<<<<< Updated upstream
                      className="flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-[#1B1815] dark:text-black bg-[#D49624] dark:bg-[#F5B83D] hover:bg-[#c2861b] dark:hover:bg-[#e5a930] rounded-full transition shadow-md shadow-[#D49624]/15 dark:shadow-[#F5B83D]/15"
=======
                      className="flex items-center justify-center bg-[#F5B83D] text-black font-semibold rounded-full h-11 px-4 hover:bg-[#e5a930] text-sm transition-colors shadow-md shadow-[#F5B83D]/15"
>>>>>>> Stashed changes
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
    </div>
  );
}
