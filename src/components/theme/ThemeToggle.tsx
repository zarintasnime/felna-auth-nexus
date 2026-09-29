"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export default function ThemeToggle({
  className = "",
  size = "md",
  showLabel = false,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid hydration mismatch by rendering a neutral placeholder matching button dimensions
    const isSm = size === "sm";
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl border border-white/10 bg-[#24201C] ${
          isSm ? "w-8 h-8" : "w-10 h-10"
        } ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  const isSm = size === "sm";
  const iconSize = isSm ? "w-4 h-4" : "w-4 h-4 sm:w-5 sm:h-5";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`group relative inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B83D] active:scale-95 ${
        isDark
          ? "bg-[#24201C] hover:bg-[#2e2924] text-[#F5B83D] border border-white/10 hover:border-[#F5B83D]/40 shadow-xs"
          : "bg-[#E8E4DD] hover:bg-[#dedad3] text-[#D49624] border border-[#2C2520]/15 hover:border-[#D49624]/50 shadow-xs"
      } ${isSm ? "h-8 px-2.5" : "h-10 px-3"} ${className}`}
    >
      {isDark ? (
        <Sun className={`${iconSize} text-[#F5B83D] group-hover:rotate-45 transition-transform duration-300`} />
      ) : (
        <Moon className={`${iconSize} text-[#D49624] group-hover:-rotate-12 transition-transform duration-300`} />
      )}

      {showLabel && (
        <span
          className={`text-xs font-semibold ${
            isDark ? "text-neutral-200" : "text-[#2C2520]"
          }`}
        >
          {isDark ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}
