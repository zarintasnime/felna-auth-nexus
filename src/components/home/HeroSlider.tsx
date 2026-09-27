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
        className="relative w-full overflow-hidden bg-[#2a221d] text-[#fcfbf9]"
      >
        <div className="relative w-full h-[440px] sm:h-[500px] lg:h-[540px]">
          {/* LCP-Optimized Static Image */}
          <Image
            src={single.imageUrl}
            alt={single.title}
            fill
            priority={true}
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center opacity-40 filter brightness-90"
          />

          {/* Deep Espresso Vignette & Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#201915]/95 via-[#2d221c]/80 to-[#201915]/50" />

          {/* Banner Content Container */}
          <div className="relative h-full w-full max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 flex flex-col justify-center items-start">
            <div className="max-w-2xl space-y-4">
              {single.badge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#4a3b32]/90 text-[#fcfbf9] border border-[#7c6a5e] shadow-sm backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#e5ded4]" />
                  <span>{single.badge}</span>
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#fcfbf9] leading-[1.18]">
                {single.title}
              </h1>

              {single.subtitle && (
                <p className="text-sm sm:text-base text-[#e5ded4] leading-relaxed max-w-xl font-normal">
                  {single.subtitle}
                </p>
              )}

              {/* Slider CTA Block: Explore Services (Rounded Full) + Hotline (Animated Underline) */}
              <div className="pt-3 flex flex-wrap items-center gap-4 sm:gap-6">
                <Link
                  href={single.linkUrl && single.linkUrl !== "/register" ? single.linkUrl : "#services"}
                  className="group inline-flex items-center justify-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 bg-[#f4f0e6] hover:bg-[#382b24] text-[#4a3b32] hover:text-[#fcfbf9] font-bold text-sm sm:text-base rounded-full border border-[#d4ccc0] hover:border-[#7c6a5e] shadow-md shadow-[#201915]/30 hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
                >
                  <span>Explore Services</span>
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4a3b32]/10 group-hover:bg-[#fcfbf9]/15 transition-colors duration-300">
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:-rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>

                <a
                  href="tel:+8801958666951"
                  className="group inline-flex items-center gap-3 px-3 py-2 text-stone-200 hover:text-[#fcfbf9] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-2xl"
                  aria-label="Call Felna Hotline +880-1958-666951"
                >
                  <div className="w-10 h-10 rounded-full bg-[#4a3b32]/90 border border-[#7c6a5e] text-amber-400 flex items-center justify-center shadow-sm group-hover:bg-amber-400 group-hover:text-[#201915] group-hover:border-amber-400 group-hover:scale-105 transition-all duration-200 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 group-hover:text-stone-300 transition-colors">
                      24/7 Helpline
                    </span>
                    <span className="relative inline-block text-sm sm:text-base font-extrabold text-[#fcfbf9] tracking-tight group-hover:text-amber-300 transition-colors pb-0.5">
                      <span>+880-1958-666951</span>
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-400 transition-all duration-300 ease-out group-hover:w-full"
                      />
                    </span>
                  </div>
                </a>
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
      className="relative w-full overflow-hidden bg-[#2a221d] text-[#fcfbf9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ebe5da]"
    >
      {/* Slider Viewport Container */}
      <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[560px]">
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
                className="object-cover object-center filter brightness-90"
              />

              {/* Deep Espresso Multi-Layer Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#201915]/95 via-[#2d221c]/80 to-[#201915]/40" />

              {/* Text & Content Overlay */}
              <div className="relative h-full w-full max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 flex flex-col justify-center items-start">
                <div className="max-w-2xl space-y-4">
                  {slide.badge && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#4a3b32]/90 text-[#fcfbf9] border border-[#7c6a5e] shadow-sm backdrop-blur-xs">
                      <Sparkles className="w-3.5 h-3.5 text-[#e5ded4]" />
                      <span>{slide.badge}</span>
                    </div>
                  )}

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#fcfbf9] leading-[1.18]">
                    {slide.title}
                  </h2>

                  {slide.subtitle && (
                    <p className="text-sm sm:text-base text-[#e5ded4] leading-relaxed max-w-xl font-normal">
                      {slide.subtitle}
                    </p>
                  )}

                  {/* Slider CTA Block: Explore Services (Rounded Full) + Hotline (Animated Underline) */}
                  <div className="pt-3 flex flex-wrap items-center gap-4 sm:gap-6">
                    <Link
                      href={slide.linkUrl && slide.linkUrl !== "/register" ? slide.linkUrl : "#services"}
                      className="group inline-flex items-center justify-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 bg-[#f4f0e6] hover:bg-[#382b24] text-[#4a3b32] hover:text-[#fcfbf9] font-bold text-sm sm:text-base rounded-full border border-[#d4ccc0] hover:border-[#7c6a5e] shadow-md shadow-[#201915]/30 hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
                    >
                      <span>Explore Services</span>
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4a3b32]/10 group-hover:bg-[#fcfbf9]/15 transition-colors duration-300">
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:-rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </Link>

                    <a
                      href="tel:+8801958666951"
                      className="group inline-flex items-center gap-3 px-3 py-2 text-stone-200 hover:text-[#fcfbf9] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-2xl"
                      aria-label="Call Felna Hotline +880-1958-666951"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#4a3b32]/90 border border-[#7c6a5e] text-amber-400 flex items-center justify-center shadow-sm group-hover:bg-amber-400 group-hover:text-[#201915] group-hover:border-amber-400 group-hover:scale-105 transition-all duration-200 shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 group-hover:text-stone-300 transition-colors">
                          24/7 Helpline
                        </span>
                        <span className="relative inline-block text-sm sm:text-base font-extrabold text-[#fcfbf9] tracking-tight group-hover:text-amber-300 transition-colors pb-0.5">
                          <span>+880-1958-666951</span>
                          <span
                            aria-hidden="true"
                            className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-400 transition-all duration-300 ease-out group-hover:w-full"
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
        {/* Navigation Arrow Controls                                         */}
        {/* ================================================================= */}
        <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-3 sm:px-6 pointer-events-none">
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous slide"
            className="pointer-events-auto p-2.5 sm:p-3 rounded-2xl bg-[#201915]/60 hover:bg-[#201915]/90 text-[#fcfbf9] border border-[#7c6a5e]/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-md focus:outline-none focus:ring-2 focus:ring-[#ebe5da]"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#fcfbf9]" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next slide"
            className="pointer-events-auto p-2.5 sm:p-3 rounded-2xl bg-[#201915]/60 hover:bg-[#201915]/90 text-[#fcfbf9] border border-[#7c6a5e]/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-md focus:outline-none focus:ring-2 focus:ring-[#ebe5da]"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#fcfbf9]" />
          </button>
        </div>

        {/* ================================================================= */}
        {/* Bottom Dot Indicators & Progress Bar                             */}
        {/* ================================================================= */}
        <div className="absolute bottom-5 inset-x-0 z-20 flex items-center justify-center gap-2 pointer-events-none">
          <div className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#201915]/70 border border-[#7c6a5e]/60 backdrop-blur-md shadow-sm">
            {slides.map((slide, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={isActive ? "true" : "false"}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ebe5da] ${
                    isActive
                      ? "w-7 bg-[#f4f0e6]"
                      : "w-2 bg-[#7c6a5e] hover:bg-[#a8998c]"
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
