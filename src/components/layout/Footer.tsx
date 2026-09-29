<<<<<<< Updated upstream
import React from "react";
import Link from "next/link";
import Image from "next/image";

// =============================================================================
// Social Icons (Facebook, YouTube, LinkedIn)
// =============================================================================
=======
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Pixel-perfect native SVG icons styled identically to Lucide
>>>>>>> Stashed changes
function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
<<<<<<< Updated upstream
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
=======
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
>>>>>>> Stashed changes
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
<<<<<<< Updated upstream
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
=======
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
>>>>>>> Stashed changes
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
<<<<<<< Updated upstream
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.33a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
=======
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
>>>>>>> Stashed changes
    </svg>
  );
}

<<<<<<< Updated upstream
// =============================================================================
// Footer Component Interface
// =============================================================================
export interface FooterProps {
  className?: string;
  settings?: any;
  socialLinks?: any[];
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer
      className={`w-full bg-[#E5E2DC] dark:bg-[#12100E] border-t border-[#2C2520]/12 dark:border-white/10 text-[#3D3630] dark:text-stone-300 relative z-10 transition-colors ${className}`}
    >
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        {/* ================================================================= */}
        {/* Top Section (Grid Layout: 1 col mobile, 2 col tablet, 5 col desktop) */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* ------------------------------------------------------------- */}
          {/* Column 1: About Us                                            */}
          {/* ------------------------------------------------------------- */}
          <div className="space-y-4">
            <h3 className="text-[#2C2520] dark:text-white font-semibold text-lg mb-6">About Us</h3>

            {/* IGL Group Logo */}
            <div className="mb-4">
              <Link href="/" className="inline-block group">
                <Image
                  src="/images/logo/IGL_logo.png"
                  alt="IGL Group Logo"
                  width={140}
                  height={40}
                  className="h-9 w-auto object-contain brightness-105 group-hover:opacity-90 transition-opacity"
                  priority={false}
                />
              </Link>
            </div>

            <p className="text-[#6E665E] dark:text-[#B9B0A5] text-[15px] leading-relaxed mb-6">
              IGL is an IT solutions company specializing in web development, domain registration,
              and hosting services. They offer tailored technology solutions to help businesses grow
              and succeed in the digital space.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
=======
export default function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <footer
      id="contact"
      className={`bg-[#0a0a0a] border-t border-white/10 text-stone-400 relative z-10 w-full mt-auto ${
        isAdmin ? "md:pl-64" : ""
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 py-16 pb-28 sm:pb-16">
        {/* 1. Top Section (Grid Layout: 1 col on mobile, 2 col tablet, 5 col desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Col 1 (About Us) */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-6">About Us</h3>

            {/* Official IGL Group Logo from public/images/logo/ */}
            <div className="mb-4">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="relative w-11 h-11 rounded-xl bg-white/5 border border-white/10 p-1.5 flex items-center justify-center shrink-0 group-hover:border-[#F5B83D]/40 transition-colors">
                  <Image
                    src="/images/logo/IGL_logo.png"
                    alt="IGL Group Logo"
                    width={44}
                    height={44}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base text-white tracking-tight leading-tight group-hover:text-[#F5B83D] transition-colors">
                    IGL Group<span className="text-[#F5B83D]">.</span>
                  </span>
                  <span className="text-[11px] text-[#B9B0A5]/80 font-medium tracking-wide">
                    Technology &amp; Solutions
                  </span>
                </div>
              </Link>
            </div>

            <p className="text-[#B9B0A5] text-[15px] leading-relaxed mb-6">
              IGL is an IT solutions company specializing in web development, domain registration, and hosting services. They offer tailored technology solutions to help businesses grow and succeed in the digital space.
            </p>

            {/* Social Icons with Amber Hover */}
            <div className="flex items-center gap-3">
>>>>>>> Stashed changes
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
<<<<<<< Updated upstream
                className="w-9 h-9 rounded-lg bg-[#2C2520]/5 dark:bg-white/5 border border-[#2C2520]/12 dark:border-white/10 flex items-center justify-center text-[#6E665E] dark:text-neutral-400 hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:border-[#D49624]/40 dark:hover:border-[#F5B83D]/40 hover:bg-[#2C2520]/10 dark:hover:bg-white/10 transition-all duration-300"
              >
                <FacebookIcon className="w-4 h-4 fill-current" />
=======
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#F5B83D] hover:border-[#F5B83D]/40 hover:bg-[#F5B83D]/10 transition-all duration-300"
              >
                <FacebookIcon className="w-4 h-4" />
>>>>>>> Stashed changes
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
<<<<<<< Updated upstream
                className="w-9 h-9 rounded-lg bg-[#2C2520]/5 dark:bg-white/5 border border-[#2C2520]/12 dark:border-white/10 flex items-center justify-center text-[#6E665E] dark:text-neutral-400 hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:border-[#D49624]/40 dark:hover:border-[#F5B83D]/40 hover:bg-[#2C2520]/10 dark:hover:bg-white/10 transition-all duration-300"
              >
                <YoutubeIcon className="w-4 h-4 fill-current" />
=======
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#F5B83D] hover:border-[#F5B83D]/40 hover:bg-[#F5B83D]/10 transition-all duration-300"
              >
                <YoutubeIcon className="w-4 h-4" />
>>>>>>> Stashed changes
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
<<<<<<< Updated upstream
                className="w-9 h-9 rounded-lg bg-[#2C2520]/5 dark:bg-white/5 border border-[#2C2520]/12 dark:border-white/10 flex items-center justify-center text-[#6E665E] dark:text-neutral-400 hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:border-[#D49624]/40 dark:hover:border-[#F5B83D]/40 hover:bg-[#2C2520]/10 dark:hover:bg-white/10 transition-all duration-300"
              >
                <LinkedinIcon className="w-4 h-4 fill-current" />
=======
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#F5B83D] hover:border-[#F5B83D]/40 hover:bg-[#F5B83D]/10 transition-all duration-300"
              >
                <LinkedinIcon className="w-4 h-4" />
>>>>>>> Stashed changes
              </a>
            </div>
          </div>

<<<<<<< Updated upstream
          {/* ------------------------------------------------------------- */}
          {/* Column 2: Company                                             */}
          {/* ------------------------------------------------------------- */}
          <div>
            <h3 className="text-[#2C2520] dark:text-white font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-[#6E665E] dark:text-[#B9B0A5] hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300 text-[15px] block"
=======
          {/* Col 2 (Company) */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-3.5">
              <li>
                <Link
                  href="/about"
                  className="text-[#B9B0A5] hover:text-[#F5B83D] transition-colors duration-300 text-[15px] inline-block"
>>>>>>> Stashed changes
                >
                  Who we are
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
<<<<<<< Updated upstream
                  className="text-[#6E665E] dark:text-[#B9B0A5] hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300 text-[15px] block"
=======
                  className="text-[#B9B0A5] hover:text-[#F5B83D] transition-colors duration-300 text-[15px] inline-block"
>>>>>>> Stashed changes
                >
                  Our services
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
<<<<<<< Updated upstream
                  className="text-[#6E665E] dark:text-[#B9B0A5] hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300 text-[15px] block"
=======
                  className="text-[#B9B0A5] hover:text-[#F5B83D] transition-colors duration-300 text-[15px] inline-block"
>>>>>>> Stashed changes
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

<<<<<<< Updated upstream
          {/* ------------------------------------------------------------- */}
          {/* Column 3: Sister Concerns (Batch 1)                           */}
          {/* ------------------------------------------------------------- */}
          <div>
            <h3 className="text-[#2C2520] dark:text-white font-semibold text-lg mb-6">Sister Concerns</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/igl-web"
                  className="text-[#6E665E] dark:text-[#B9B0A5] hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300 text-[15px] block"
                >
                  IGL Web
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#6E665E] dark:text-[#B9B0A5] hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300 text-[15px] block"
                >
                  Felna Digital Marketing Agency
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#6E665E] dark:text-[#B9B0A5] hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300 text-[15px] block"
                >
                  Felna Online
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#6E665E] dark:text-[#B9B0A5] hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300 text-[15px] block"
                >
                  IGL Host LLC
                </Link>
=======
          {/* Col 3 (Sister Concerns 1) */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Sister Concerns</h3>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="https://iglweb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B9B0A5] hover:text-[#F5B83D] transition-colors duration-300 text-[15px] inline-block"
                >
                  IGL Web
                </a>
              </li>
              <li>
                <a
                  href="https://felna.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B9B0A5] hover:text-[#F5B83D] transition-colors duration-300 text-[15px] inline-block"
                >
                  Felna Digital Marketing Agency
                </a>
              </li>
              <li>
                <a
                  href="https://felna.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B9B0A5] hover:text-[#F5B83D] transition-colors duration-300 text-[15px] inline-block"
                >
                  Felna Online
                </a>
              </li>
              <li>
                <a
                  href="https://iglhost.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B9B0A5] hover:text-[#F5B83D] transition-colors duration-300 text-[15px] inline-block"
                >
                  IGL Host LLC
                </a>
>>>>>>> Stashed changes
              </li>
            </ul>
          </div>

<<<<<<< Updated upstream
          {/* ------------------------------------------------------------- */}
          {/* Column 4: Sister Concerns (Batch 2)                           */}
          {/* ------------------------------------------------------------- */}
          <div>
            <h3 className="text-[#2C2520] dark:text-white font-semibold text-lg mb-6">Sister Concerns</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-[#6E665E] dark:text-[#B9B0A5] hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300 text-[15px] block"
                >
                  IGL Tours and Travels
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#6E665E] dark:text-[#B9B0A5] hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300 text-[15px] block"
                >
                  IGL Network
                </Link>
              </li>
              <li>
                <Link
                  href="/student-visa"
                  className="text-[#6E665E] dark:text-[#B9B0A5] hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300 text-[15px] block"
                >
                  Student Visa
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#6E665E] dark:text-[#B9B0A5] hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300 text-[15px] block"
                >
                  FelnaTech
                </Link>
=======
          {/* Col 4 (Sister Concerns 2) */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Sister Concerns</h3>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="https://igltours.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B9B0A5] hover:text-[#F5B83D] transition-colors duration-300 text-[15px] inline-block"
                >
                  IGL Tours and Travels
                </a>
              </li>
              <li>
                <a
                  href="https://iglnetwork.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B9B0A5] hover:text-[#F5B83D] transition-colors duration-300 text-[15px] inline-block"
                >
                  IGL Network
                </a>
              </li>
              <li>
                <a
                  href="https://studentvisa.com.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B9B0A5] hover:text-[#F5B83D] transition-colors duration-300 text-[15px] inline-block"
                >
                  Student Visa
                </a>
              </li>
              <li>
                <a
                  href="https://felnatech.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B9B0A5] hover:text-[#F5B83D] transition-colors duration-300 text-[15px] inline-block"
                >
                  FelnaTech
                </a>
>>>>>>> Stashed changes
              </li>
            </ul>
          </div>

<<<<<<< Updated upstream
          {/* ------------------------------------------------------------- */}
          {/* Column 5: Need help?                                          */}
          {/* ------------------------------------------------------------- */}
          <div>
            <h3 className="text-[#2C2520] dark:text-white font-semibold text-lg mb-6">Need help?</h3>
            <div className="space-y-6">
              <div>
                <span className="text-[#6E665E] dark:text-[#B9B0A5] text-sm block">Call us directly?</span>
                <a
                  href="tel:+8801958666999"
                  className="text-[#2C2520] dark:text-white font-bold block mt-1 hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300 text-[16px]"
=======
          {/* Col 5 (Need help?) */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Need help?</h3>
            <div className="space-y-6">
              <div>
                <span className="text-[#B9B0A5] text-sm">Call us directly?</span>
                <a
                  href="tel:+8801958666999"
                  className="text-white font-bold block mt-1 hover:text-[#F5B83D] transition-colors duration-300 text-base"
>>>>>>> Stashed changes
                >
                  +880-1958-666999
                </a>
              </div>

<<<<<<< Updated upstream
              <div>
                <span className="text-[#6E665E] dark:text-[#B9B0A5] text-sm block">Need support?</span>
                <a
                  href="mailto:support@iglweb.com"
                  className="text-[#2C2520] dark:text-white font-bold block mt-1 hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300 text-[16px]"
=======
              <div className="mt-6">
                <span className="text-[#B9B0A5] text-sm">Need support?</span>
                <a
                  href="mailto:support@iglweb.com"
                  className="text-white font-bold block mt-1 hover:text-[#F5B83D] transition-colors duration-300 text-base break-all"
>>>>>>> Stashed changes
                >
                  support@iglweb.com
                </a>
              </div>
            </div>
          </div>
        </div>

<<<<<<< Updated upstream
        {/* ================================================================= */}
        {/* Bottom Bar Separator & Legal                                      */}
        {/* ================================================================= */}
        <div className="border-t border-[#2C2520]/12 dark:border-white/10 pt-8 mt-16 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#6E665E] dark:text-neutral-500">
          <div className="text-center md:text-left">
            <p className="text-[#6E665E] dark:text-neutral-400">
              &copy; Copyright &copy; 2007- 2026{" "}
              <span className="text-[#D49624] dark:text-[#F5B83D] font-bold">IGL Group</span>
            </p>
            <p className="text-[#6E665E]/80 dark:text-neutral-500 text-xs mt-2 leading-relaxed">
              Domain Registered By IGL Web Ltd | Hosting Service Provided by IGL Host Llc.com | Web
              Design &amp; Development by IGL Web Ltd
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-[#6E665E] dark:text-neutral-400 shrink-0">
            <Link
              href="/privacy"
              className="hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300"
            >
              Privacy policy
            </Link>
            <span className="text-[#2C2520]/20 dark:text-neutral-700" aria-hidden="true">
              &bull;
            </span>
            <Link
              href="/terms"
              className="hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300"
=======
        {/* 2. Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-16 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-neutral-500 text-center md:text-left">
          {/* Left Side */}
          <div>
            <p>
              &copy; Copyright &copy; 2007- 2026{" "}
              <strong className="text-[#F5B83D] font-bold">IGL Group</strong>
            </p>
            <p className="text-xs text-neutral-500/80 mt-2">
              Domain Registered By IGL Web Ltd | Hosting Service Provided by IGL Host Llc.com | Web Design &amp; Development by IGL Web Ltd
            </p>
          </div>

          {/* Right Side */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-6">
            <Link
              href="/privacy"
              className="hover:text-[#F5B83D] transition-colors duration-300"
            >
              Privacy policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#F5B83D] transition-colors duration-300"
>>>>>>> Stashed changes
            >
              Terms and conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
