"use client";

import React from "react";
import Link from "next/link";
import { Phone, UserPlus } from "lucide-react";

export default function MobileBottomBar() {
  return (
    <aside
      aria-label="Mobile Quick Actions"
      className="fixed bottom-0 left-0 w-full z-50 bg-[#12100E]/90 backdrop-blur-md border-t border-white/10 p-3 flex gap-3 sm:hidden shadow-2xl shadow-black/80"
    >
      {/* Ghost Button: Call with phone icon */}
      <a
        href="tel:+8801977771234"
        className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all duration-200 active:scale-[0.98]"
      >
        <Phone className="w-4 h-4 text-[#F5B83D]" />
        <span>Call</span>
      </a>

      {/* Solid Amber Button: Create Account */}
      <Link
        href="/register"
        className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#F5B83D] hover:bg-[#e5aa32] text-black font-semibold text-sm transition-all duration-200 shadow-md shadow-[#F5B83D]/20 active:scale-[0.98]"
      >
        <UserPlus className="w-4 h-4 text-black" />
        <span>Create Account</span>
      </Link>
    </aside>
  );
}
