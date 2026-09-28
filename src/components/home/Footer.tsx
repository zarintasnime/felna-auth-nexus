import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-[#382b24] py-8 px-4 pb-24 sm:pb-8 bg-[#201915] text-center text-xs text-stone-400 mt-auto relative z-10"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Attribution */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 rounded-xl bg-[#181310] border border-neutral-700/60 p-1 flex items-center justify-center shrink-0 group-hover:border-[#F5B83D]/40 transition-colors">
              <Image
                src="/images/igl-logo.png"
                alt="IGL Group Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap justify-center md:justify-start text-left">
              <span className="font-bold text-white tracking-tight">
                IGL Group<span className="text-[#F5B83D]">.</span>
              </span>
              <span className="text-stone-500">&bull;</span>
              <span className="font-semibold text-neutral-300">Felna.com</span>
              <span className="hidden sm:inline text-stone-400">&mdash; Secure Authentication &amp; Bulk SMS</span>
            </div>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium">
          <Link href="/" className="hover:text-[#F5B83D] transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-[#F5B83D] transition-colors">
            About Us
          </Link>
          <Link href="/address" className="hover:text-[#F5B83D] transition-colors">
            Address
          </Link>
          <Link href="/feedback" className="hover:text-[#F5B83D] transition-colors">
            Feedback
          </Link>
          <Link href="/login" className="hover:text-[#F5B83D] transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="hover:text-[#F5B83D] transition-colors">
            Register
          </Link>
          <Link href="/dashboard" className="hover:text-[#F5B83D] transition-colors">
            Dashboard
          </Link>
          <span className="hidden md:inline text-stone-600">|</span>
          <span className="text-stone-500 block w-full md:w-auto mt-1 md:mt-0">
            &copy; {new Date().getFullYear()} IGL Group &amp; Felna Inc.
          </span>
        </div>
      </div>
    </footer>
  );
}
