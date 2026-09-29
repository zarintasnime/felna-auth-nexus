"use client";

import React from "react";
import Link from "next/link";
import { Phone, UserPlus } from "lucide-react";

export default function MobileBottomBar() {
  return (
    <aside
      aria-label="Mobile Quick Actions"
      className="fixed bottom-0 left-0 w-full z-50 bg-[#E5E2DC]/95 dark:bg-[#12100E]/90 backdrop-blur-md border-t border-[#2C2520]/15 dark:border-white/10 p-3 flex gap-3 sm:hidden shadow-2xl shadow-black/20 dark:shadow-black/80 transition-colors duration-300"
    >
      {/* Ghost Button: Call with phone icon */}
      <a
        href="tel:+8801977771234"
        className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-[#2C2520]/20 dark:border-white/20 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[#2C2520] dark:text-white font-semibold text-sm transition-all duration-200 active:scale-[0.98]"
      >
        <Phone className="w-4 h-4 text-[#D49624] dark:text-[#F5B83D]" />
        <span>Call</span>
      </a>

      {/* Solid Amber Button: Create Account */}
      <Link
        href="/register"
        className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#D49624] hover:bg-[#c3861c] dark:bg-[#F5B83D] dark:hover:bg-[#e5aa32] text-[#1B1815] dark:text-black font-semibold text-sm transition-all duration-200 shadow-md shadow-[#D49624]/20 dark:shadow-[#F5B83D]/20 active:scale-[0.98]"
      >
        <UserPlus className="w-4 h-4 text-[#1B1815] dark:text-black" />
        <span>Create Account</span>
      </Link>
    </aside>
  );
}
