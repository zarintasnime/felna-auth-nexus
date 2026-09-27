"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Zap, Clock, LifeBuoy, Globe, ChevronDown, Check } from "lucide-react";

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
      className="w-full bg-[#201915] text-[#e5ded4] border-b border-[#382b24] text-sm select-none"
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[42px] py-2 sm:py-2.5 items-center justify-between gap-4">
          {/* =============================================================== */}
          {/* Left Side: Announcement Text with Lightning/Zap Icon            */}
          {/* =============================================================== */}
          <div className="flex items-center gap-2.5 truncate">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 shrink-0">
              <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
            </span>
            <p className="text-xs sm:text-sm text-[#e5ded4] truncate font-normal leading-none flex items-center gap-1.5">
              <span>{announcementText}</span>
              {announcementLinkText && (
                <Link
                  href={announcementHref}
                  className="font-bold text-amber-300 hover:text-amber-200 underline underline-offset-2 decoration-amber-400/60 hover:decoration-amber-300 transition-colors"
                >
                  {announcementLinkText}
                </Link>
              )}
            </p>
          </div>

          {/* =============================================================== */}
          {/* Right Side: 3 Inline Utility Items (Time, Support, Language)    */}
          {/* =============================================================== */}
          <div className="flex items-center gap-4 sm:gap-5 md:gap-6 text-xs sm:text-sm shrink-0">
            {/* Item 1: Clock Icon + Schedule */}
            <div className="hidden sm:flex items-center gap-2 text-stone-300 font-medium">
              <Clock className="w-4 h-4 text-amber-400/90 shrink-0" />
              <span className="tracking-tight">{scheduleText}</span>
            </div>

            {/* Separator on tablet+ */}
            <span className="hidden sm:inline-block text-[#523e32]" aria-hidden="true">
              |
            </span>

            {/* Item 2: Support / Lifebuoy Icon + Support */}
            <Link
              href={supportHref}
              className="flex items-center gap-2 text-stone-300 hover:text-[#fcfbf9] font-medium transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded px-1 py-0.5"
            >
              <LifeBuoy className="w-4 h-4 text-amber-400/90 shrink-0" />
              <span>Support</span>
            </Link>

            {/* Separator */}
            <span className="text-[#523e32]" aria-hidden="true">
              |
            </span>

            {/* Item 3: Globe Icon + Language Dropdown */}
            <div className="relative flex items-center" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 text-stone-300 hover:text-[#fcfbf9] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded px-1.5 py-0.5"
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                aria-label="Select display language"
              >
                <Globe className="w-4 h-4 text-amber-400/90 shrink-0" />
                <span className="font-semibold">{selectedLanguage}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-150 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Language Selection Popover (Strictly NO plain white bg-white) */}
              {isDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 top-full mt-1.5 w-36 py-1.5 bg-[#2a221d] border border-[#4a3b32] rounded-xl shadow-xl z-50 animate-in fade-in-50 zoom-in-95 duration-100"
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={selectedLanguage === "English"}
                    onClick={() => {
                      setSelectedLanguage("English");
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-sm transition-colors ${
                      selectedLanguage === "English"
                        ? "bg-[#3d3028] text-amber-300 font-bold"
                        : "text-stone-300 hover:bg-[#3d3028]/60 hover:text-[#fcfbf9]"
                    }`}
                  >
                    <span>English</span>
                    {selectedLanguage === "English" && (
                      <Check className="w-4 h-4 text-amber-400" />
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
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-sm transition-colors ${
                      selectedLanguage === "Bangla"
                        ? "bg-[#3d3028] text-amber-300 font-bold"
                        : "text-stone-300 hover:bg-[#3d3028]/60 hover:text-[#fcfbf9]"
                    }`}
                  >
                    <span>বাংলা (Bangla)</span>
                    {selectedLanguage === "Bangla" && (
                      <Check className="w-4 h-4 text-amber-400" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
