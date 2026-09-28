"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Phone,
  Sparkles,
} from "lucide-react";
import { HeroSlide } from "@/types/homepage";

export interface HeroSliderProps {
  slides?: HeroSlide[];
  autoPlayInterval?: number; // In milliseconds, default 5000ms
}

export default function HeroSlider({
  slides = [],
  autoPlayInterval = 5000,
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const totalSlides = slides.length;

  const goToNext = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const goToIndex = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentIndex(index);
    }
  };

  // Auto-play interval with pause-on-hover & pause-on-focus
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [totalSlides, isPaused, autoPlayInterval, goToNext]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goToNext();
    }
  };

  // Touch / Swipe handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50; // Minimum swipe distance in px

    if (diff > threshold) {
      goToNext();
    } else if (diff < -threshold) {
      goToPrev();
    }
    touchStartX.current = null;
  };

  // ---------------------------------------------------------------------------
  // Case A: No Slides
  // ---------------------------------------------------------------------------
  if (totalSlides === 0) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Case B: Graceful Degradation (Single Slide -> Static Banner)
  // ---------------------------------------------------------------------------
  if (totalSlides === 1) {
    const single = slides[0];
    return (
      <section
        aria-label="Promotional Showcase Banner"
        className="relative w-full overflow-hidden bg-[#181310] text-[#fcfbf9]"
      >
        <div className="relative w-full h-[480px] sm:h-[540px] lg:h-[580px]">
          {/* LCP-Optimized Static Image */}
          <Image
            src={single.imageUrl}
            alt={single.title}
            fill
            priority={true}
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center opacity-35 filter brightness-90"
          />

          {/* Deep Dark Vignette & Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#12100E]/95 via-[#12100E]/80 to-transparent" />

          {/* Ambient Radial Amber Glow */}
          <div
            className="absolute top-1/4 -left-20 w-96 h-96 bg-[#F5B83D]/10 rounded-full blur-[100px] pointer-events-none"
            aria-hidden="true"
          />

          {/* Banner Content Container (Left-aligned) */}
          <div className="relative h-full w-full max-w-[1880px] mx-auto px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 flex flex-col justify-center items-start z-10 pb-16">
            <div className="max-w-2xl space-y-4">
              {single.badge && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#F5B83D]/10 text-[#F5B83D] border border-[#F5B83D]/30 shadow-sm backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#F5B83D]" />
                  <span>{single.badge}</span>
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold tracking-tight text-white leading-[1.15]">
                {single.title}
              </h1>

              {single.subtitle && (
                <p className="text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed max-w-xl font-normal">
                  {single.subtitle}
                </p>
              )}

              {/* Slider CTA Block: Solid Amber Explore Services + 24/7 Hotline */}
              <div className="pt-3 flex flex-wrap items-center gap-4 sm:gap-6">
                <Link
                  href={single.linkUrl && single.linkUrl !== "/register" ? single.linkUrl : "#services"}
                  className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 bg-[#F5B83D] hover:bg-[#e5aa32] text-black font-bold text-sm sm:text-base rounded-full shadow-lg shadow-[#F5B83D]/25 transition-all duration-300 active:scale-[0.98]"
                >
                  <span>Explore Services</span>
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black/10 group-hover:bg-black/20 transition-colors duration-300">
                    <ArrowRight className="w-4 h-4 text-black transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
                  </span>
                </Link>

                <a
                  href="tel:+8801958666951"
                  className="group inline-flex items-center gap-3 px-3 py-2 text-stone-200 hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B83D] rounded-2xl"
                  aria-label="Call Felna Hotline +880-1958-666951"
                >
                  <div className="w-10 h-10 rounded-full bg-[#24201C] border border-white/10 text-[#F5B83D] flex items-center justify-center shadow-sm group-hover:bg-[#F5B83D] group-hover:text-black group-hover:border-[#F5B83D] group-hover:scale-105 transition-all duration-200 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 group-hover:text-stone-300 transition-colors">
                      24/7 Helpline
                    </span>
                    <span className="relative inline-block text-sm sm:text-base font-extrabold text-white tracking-tight group-hover:text-[#F5B83D] transition-colors pb-0.5">
                      <span>+880-1958-666951</span>
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#F5B83D] transition-all duration-300 ease-out group-hover:w-full"
                      />
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* Dynamic Animated Wave (Bottom Divider - Seamless #12100E)       */}
          {/* =============================================================== */}
          <div
            className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none select-none"
            aria-hidden="true"
          >
            <div className="relative w-full h-12 sm:h-16 md:h-20 overflow-hidden">
              {/* Wave Layer 1: Background Flowing Wave (50% Opacity) */}
              <div className="absolute bottom-0 left-0 w-[200%] h-full flex animate-wave-slow opacity-50">
                <svg
                  viewBox="0 0 2880 120"
                  fill="none"
                  preserveAspectRatio="none"
                  className="w-full h-full block"
                >
                  <path
                    d="M0,45 C360,85 720,10 1080,65 C1260,90 1350,30 1440,45 C1800,85 2160,10 2520,65 C2700,90 2790,30 2880,45 L2880,120 L0,120 Z"
                    fill="#12100E"
                  />
                </svg>
              </div>

              {/* Wave Layer 2: Foreground Flowing Wave (100% Opacity) */}
              <div className="absolute bottom-0 left-0 w-[200%] h-full flex animate-wave">
                <svg
                  viewBox="0 0 2880 120"
                  fill="none"
                  preserveAspectRatio="none"
                  className="w-full h-full block"
                >
                  <path
                    d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 C1680,100 1920,20 2160,60 C2400,100 2640,20 2880,60 L2880,120 L0,120 Z"
                    fill="#12100E"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Case C: Multi-Slide Interactive Carousel
  // ---------------------------------------------------------------------------
  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured Highlights Slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      className="relative w-full overflow-hidden bg-[#181310] text-[#fcfbf9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B83D]"
    >
      {/* Slider Viewport Container */}
      <div className="relative w-full h-[480px] sm:h-[540px] lg:h-[580px]">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          const isLcpCandidate = index === 0;

          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${totalSlides}: ${slide.title}`}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Slide Background Image */}
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                priority={isLcpCandidate}
                fetchPriority={isLcpCandidate ? "high" : "auto"}
                loading={isLcpCandidate ? "eager" : "lazy"}
                sizes="100vw"
                className="object-cover object-center opacity-35 filter brightness-90"
              />

              {/* Deep Dark Multi-Layer Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#12100E]/95 via-[#12100E]/80 to-transparent" />

              {/* Ambient Radial Amber Glow */}
              <div
                className="absolute top-1/4 -left-20 w-96 h-96 bg-[#F5B83D]/10 rounded-full blur-[100px] pointer-events-none"
                aria-hidden="true"
              />

              {/* Text & Content Overlay (Left-aligned with smooth slide-up transition) */}
              <div className="relative h-full w-full max-w-[1880px] mx-auto px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 flex flex-col justify-center items-start z-10 pb-16">
                <div
                  className={`max-w-2xl space-y-4 transition-all duration-700 ease-out transform ${
                    isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-5 pointer-events-none"
                  }`}
                >
                  {slide.badge && (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#F5B83D]/10 text-[#F5B83D] border border-[#F5B83D]/30 shadow-sm backdrop-blur-xs">
                      <Sparkles className="w-3.5 h-3.5 text-[#F5B83D]" />
                      <span>{slide.badge}</span>
                    </div>
                  )}

                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold tracking-tight text-white leading-[1.15]">
                    {slide.title}
                  </h2>

                  {slide.subtitle && (
                    <p className="text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed max-w-xl font-normal">
                      {slide.subtitle}
                    </p>
                  )}

                  {/* Slider CTA Block: Solid Amber Explore Services + 24/7 Hotline */}
                  <div className="pt-3 flex flex-wrap items-center gap-4 sm:gap-6">
                    <Link
                      href={slide.linkUrl && slide.linkUrl !== "/register" ? slide.linkUrl : "#services"}
                      className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 bg-[#F5B83D] hover:bg-[#e5aa32] text-black font-bold text-sm sm:text-base rounded-full shadow-lg shadow-[#F5B83D]/25 transition-all duration-300 active:scale-[0.98]"
                    >
                      <span>Explore Services</span>
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black/10 group-hover:bg-black/20 transition-colors duration-300">
                        <ArrowRight className="w-4 h-4 text-black transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
                      </span>
                    </Link>

                    <a
                      href="tel:+8801958666951"
                      className="group inline-flex items-center gap-3 px-3 py-2 text-stone-200 hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B83D] rounded-2xl"
                      aria-label="Call Felna Hotline +880-1958-666951"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#24201C] border border-white/10 text-[#F5B83D] flex items-center justify-center shadow-sm group-hover:bg-[#F5B83D] group-hover:text-black group-hover:border-[#F5B83D] group-hover:scale-105 transition-all duration-200 shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 group-hover:text-stone-300 transition-colors">
                          24/7 Helpline
                        </span>
                        <span className="relative inline-block text-sm sm:text-base font-extrabold text-white tracking-tight group-hover:text-[#F5B83D] transition-colors pb-0.5">
                          <span>+880-1958-666951</span>
                          <span
                            aria-hidden="true"
                            className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#F5B83D] transition-all duration-300 ease-out group-hover:w-full"
                          />
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* ================================================================= */}
        {/* Dynamic Animated Wave (Bottom Divider - Seamless #12100E)         */}
        {/* ================================================================= */}
        <div
          className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none select-none"
          aria-hidden="true"
        >
          <div className="relative w-full h-12 sm:h-16 md:h-20 overflow-hidden">
            {/* Wave Layer 1: Background Flowing Wave (50% Opacity) */}
            <div className="absolute bottom-0 left-0 w-[200%] h-full flex animate-wave-slow opacity-50">
              <svg
                viewBox="0 0 2880 120"
                fill="none"
                preserveAspectRatio="none"
                className="w-full h-full block"
              >
                <path
                  d="M0,45 C360,85 720,10 1080,65 C1260,90 1350,30 1440,45 C1800,85 2160,10 2520,65 C2700,90 2790,30 2880,45 L2880,120 L0,120 Z"
                  fill="#12100E"
                />
              </svg>
            </div>

            {/* Wave Layer 2: Foreground Flowing Wave (100% Opacity) */}
            <div className="absolute bottom-0 left-0 w-[200%] h-full flex animate-wave">
              <svg
                viewBox="0 0 2880 120"
                fill="none"
                preserveAspectRatio="none"
                className="w-full h-full block"
              >
                <path
                  d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 C1680,100 1920,20 2160,60 C2400,100 2640,20 2880,60 L2880,120 L0,120 Z"
                  fill="#12100E"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Navigation Arrow Controls                                         */}
        {/* ================================================================= */}
        <div className="absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-4 md:px-8 pointer-events-none">
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous slide"
            className="pointer-events-auto p-2.5 sm:p-3 rounded-2xl bg-[#12100E]/80 hover:bg-[#12100E] text-white border border-white/10 hover:border-[#F5B83D]/40 backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F5B83D]"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next slide"
            className="pointer-events-auto p-2.5 sm:p-3 rounded-2xl bg-[#12100E]/80 hover:bg-[#12100E] text-white border border-white/10 hover:border-[#F5B83D]/40 backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F5B83D]"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>

        {/* ================================================================= */}
        {/* Bottom Dot Indicators                                             */}
        {/* ================================================================= */}
        <div className="absolute bottom-6 sm:bottom-8 inset-x-0 z-30 flex items-center justify-center gap-2 pointer-events-none">
          <div className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12100E]/80 border border-white/10 backdrop-blur-md shadow-sm">
            {slides.map((slide, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={isActive ? "true" : "false"}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F5B83D] ${
                    isActive
                      ? "w-7 bg-[#F5B83D]"
                      : "w-2 bg-neutral-600 hover:bg-neutral-400"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
