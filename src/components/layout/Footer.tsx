import React from "react";
import Link from "next/link";
import Image from "next/image";

// =============================================================================
// Social Icons (Facebook, YouTube, LinkedIn)
// =============================================================================
function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.33a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
    </svg>
  );
}

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
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-[#2C2520]/5 dark:bg-white/5 border border-[#2C2520]/12 dark:border-white/10 flex items-center justify-center text-[#6E665E] dark:text-neutral-400 hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:border-[#D49624]/40 dark:hover:border-[#F5B83D]/40 hover:bg-[#2C2520]/10 dark:hover:bg-white/10 transition-all duration-300"
              >
                <FacebookIcon className="w-4 h-4 fill-current" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-lg bg-[#2C2520]/5 dark:bg-white/5 border border-[#2C2520]/12 dark:border-white/10 flex items-center justify-center text-[#6E665E] dark:text-neutral-400 hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:border-[#D49624]/40 dark:hover:border-[#F5B83D]/40 hover:bg-[#2C2520]/10 dark:hover:bg-white/10 transition-all duration-300"
              >
                <YoutubeIcon className="w-4 h-4 fill-current" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-[#2C2520]/5 dark:bg-white/5 border border-[#2C2520]/12 dark:border-white/10 flex items-center justify-center text-[#6E665E] dark:text-neutral-400 hover:text-[#D49624] dark:hover:text-[#F5B83D] hover:border-[#D49624]/40 dark:hover:border-[#F5B83D]/40 hover:bg-[#2C2520]/10 dark:hover:bg-white/10 transition-all duration-300"
              >
                <LinkedinIcon className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

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
                >
                  Who we are
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
                  className="text-[#6E665E] dark:text-[#B9B0A5] hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300 text-[15px] block"
                >
                  Our services
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#6E665E] dark:text-[#B9B0A5] hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300 text-[15px] block"
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Column 3: Sister Concerns (Batch 1)                           */}
          {/* ------------------------------------------------------------- */}
          <div>
            <h3 className="text-[#2C2520] dark:text-white font-semibold text-lg mb-6">Sister Concerns</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://iglweb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6E665E] dark:text-[#B9B0A5] hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300 text-[15px] block"
                >
                  IGL Web
                </a>
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
              </li>
            </ul>
          </div>

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
              </li>
            </ul>
          </div>

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
                >
                  +880-1958-666999
                </a>
              </div>

              <div>
                <span className="text-[#6E665E] dark:text-[#B9B0A5] text-sm block">Need support?</span>
                <a
                  href="mailto:support@iglweb.com"
                  className="text-[#2C2520] dark:text-white font-bold block mt-1 hover:text-[#D49624] dark:hover:text-[#F5B83D] transition-colors duration-300 text-[16px]"
                >
                  support@iglweb.com
                </a>
              </div>
            </div>
          </div>
        </div>

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
            >
              Terms and conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
