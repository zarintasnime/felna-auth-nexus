"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Zap, Clock, LifeBuoy, Globe, ChevronDown, Check } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";

export interface TopBarProps {
  announcementText?: string;
  announcementLinkText?: string;
  announcementHref?: string;
  scheduleText?: string;
  supportHref?: string;
}

export default function TopBar({
  announcementText = "Fast & Reliable Bulk SMS Services.",
  announcementLinkText = "Join Now",
  announcementHref = "/register",
  scheduleText = "9 am to 6 pm [mon-sat]",
  supportHref = "#contact",
}: TopBarProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<"English" | "Bangla">("English");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Close dropdown on ESC
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  return (
    <aside
      aria-label="Utility Announcement and Quick Actions"
      className="w-full bg-[#E8E4DD]/95 dark:bg-[#12100E]/95 text-[13px] text-[#3D3630] dark:text-neutral-400 border-b border-[#2C2520]/12 dark:border-white/10 select-none rounded-t-2xl md:rounded-t-3xl transition-colors"
    >
      <div className="w-full max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="flex min-h-[42px] py-2 sm:py-2.5 items-center justify-between gap-4">
          {/* =============================================================== */}
          {/* Left Side: Announcement Text with Lightning/Zap Icon            */}
          {/* =============================================================== */}
          <div className="flex items-center gap-2.5 truncate">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#D49624]/15 dark:bg-[#F5B83D]/10 text-[#D49624] dark:text-[#F5B83D] shrink-0">
              <Zap className="w-3 h-3 fill-[#D49624] dark:fill-[#F5B83D] text-[#D49624] dark:text-[#F5B83D]" />
            </span>
            <p className="text-[13px] text-[#3D3630] dark:text-neutral-400 truncate font-normal leading-none flex items-center gap-1.5">
              <span>{announcementText}</span>
              {announcementLinkText && (
                <Link
                  href={announcementHref}
                  className="text-[#D49624] dark:text-[#F5B83D] font-bold hover:underline transition-colors"
                >
                  {announcementLinkText}
                </Link>
              )}
            </p>
          </div>

          {/* =============================================================== */}
          {/* Right Side: Inline Utility Items (Time, Support, Lang, Theme)   */}
          {/* =============================================================== */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-[13px] text-[#3D3630] dark:text-neutral-400 shrink-0">
            {/* Item 1: Clock Icon + Schedule */}
            <div className="hidden sm:flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-[#D49624] dark:text-[#F5B83D] shrink-0" />
              <span className="tracking-tight">{scheduleText}</span>
            </div>

            {/* Separator on tablet+ */}
            <span className="hidden sm:inline-block text-[#2C2520]/20 dark:text-white/10" aria-hidden="true">
              |
            </span>

            {/* Item 2: Support / Lifebuoy Icon + Support */}
            <Link
              href={supportHref}
              className="flex items-center gap-2 hover:text-[#2C2520] dark:hover:text-white font-medium transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D49624] dark:focus-visible:ring-[#F5B83D] rounded px-1 py-0.5"
            >
              <LifeBuoy className="w-4 h-4 text-[#D49624] dark:text-[#F5B83D] shrink-0" />
              <span>Support</span>
            </Link>

            {/* Separator */}
            <span className="text-[#2C2520]/20 dark:text-white/10" aria-hidden="true">
              |
            </span>

            {/* Item 3: Globe Icon + Language Dropdown */}
            <div className="relative flex items-center" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 sm:gap-2 text-[#3D3630] dark:text-neutral-400 hover:text-[#2C2520] dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D49624] dark:focus-visible:ring-[#F5B83D] rounded px-1.5 py-0.5"
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                aria-label="Select display language"
              >
                <Globe className="w-4 h-4 text-[#D49624] dark:text-[#F5B83D] shrink-0" />
                <span className="font-semibold text-[#2C2520] dark:text-neutral-300">{selectedLanguage}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#6E665E] dark:text-neutral-400 transition-transform duration-150 ${
                    isDropdownOpen ? "rotate-180 text-[#D49624] dark:text-[#F5B83D]" : ""
                  }`}
                />
              </button>

              {/* Language Selection Popover */}
              {isDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 top-full mt-1.5 w-36 py-1.5 bg-[#E5E2DC] dark:bg-[#1B1815] border border-[#2C2520]/15 dark:border-white/10 rounded-xl shadow-xl z-50 animate-in fade-in-50 zoom-in-95 duration-100"
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={selectedLanguage === "English"}
                    onClick={() => {
                      setSelectedLanguage("English");
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs sm:text-sm transition-colors ${
                      selectedLanguage === "English"
                        ? "bg-[#2C2520]/10 dark:bg-white/10 text-[#D49624] dark:text-[#F5B83D] font-bold"
                        : "text-[#2C2520] dark:text-neutral-300 hover:bg-[#2C2520]/5 dark:hover:bg-white/5 hover:text-[#2C2520] dark:hover:text-white"
                    }`}
                  >
                    <span>English</span>
                    {selectedLanguage === "English" && (
                      <Check className="w-4 h-4 text-[#D49624] dark:text-[#F5B83D]" />
                    )}
                  </button>

                  <button
                    type="button"
                    role="option"
                    aria-selected={selectedLanguage === "Bangla"}
                    onClick={() => {
                      setSelectedLanguage("Bangla");
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs sm:text-sm transition-colors ${
                      selectedLanguage === "Bangla"
                        ? "bg-[#2C2520]/10 dark:bg-white/10 text-[#D49624] dark:text-[#F5B83D] font-bold"
                        : "text-[#2C2520] dark:text-neutral-300 hover:bg-[#2C2520]/5 dark:hover:bg-white/5 hover:text-[#2C2520] dark:hover:text-white"
                    }`}
                  >
                    <span>বাংলা (Bangla)</span>
                    {selectedLanguage === "Bangla" && (
                      <Check className="w-4 h-4 text-[#D49624] dark:text-[#F5B83D]" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Separator */}
            <span className="text-[#2C2520]/20 dark:text-white/10" aria-hidden="true">
              |
            </span>

            {/* Item 4: Dark / Light Mode Switcher */}
            <ThemeToggle size="sm" />
          </div>
        </div>
      </div>
    </aside>
  );
}
