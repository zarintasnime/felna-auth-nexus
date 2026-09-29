import React from "react";
import Link from "next/link";
import { CmsSiteSettings, CmsSocialLink } from "@prisma/client";
import { ExternalLink } from "lucide-react";

export interface FooterProps {
  settings?: CmsSiteSettings | null;
  socialLinks?: CmsSocialLink[];
}

export default function Footer({ settings, socialLinks = [] }: FooterProps) {
  const siteName = settings?.siteName || "Felna.com";
  const copyrightText =
    settings?.copyrightText || `© ${new Date().getFullYear()} ${siteName}`;

  return (
    <footer
      id="contact"
      className="border-t border-[#382b24] py-8 px-4 pb-24 sm:pb-8 bg-[#201915] text-center text-xs text-stone-400 mt-auto relative z-10"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand Logo & Monogram */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F5B83D] to-[#d99b26] flex items-center justify-center font-bold text-slate-950 text-sm shadow-md group-hover:scale-105 transition-transform">
                {siteName.charAt(0).toUpperCase()}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap justify-center md:justify-start text-left">
                <span className="font-bold text-white tracking-tight">
                  {siteName}<span className="text-[#F5B83D]">.</span>
                </span>
                <span className="text-stone-500">&bull;</span>
                <span className="text-stone-400">Carrier-Grade Bulk SMS &amp; OTP</span>
              </div>
            </Link>
          </div>

          {/* Social Links from DB */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-[#F5B83D]/40 text-neutral-300 hover:text-white text-[11px] capitalize transition-colors flex items-center gap-1"
                >
                  <span>{link.label || link.platform}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-[#F5B83D]" />
                </a>
              ))}
            </div>
          )}

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
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-stone-500 text-[11px]">
          <div>{copyrightText}</div>
          <div>BTRC Licensed Telecom Aggregator in Bangladesh</div>
        </div>
      </div>
    </footer>
  );
}
