"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroSlide } from "@/types/hero";

interface HeroCarouselProps {
  slides: HeroSlide[];
}

const AUTOPLAY_MS = 6000;

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [heroHeight, setHeroHeight] = useState<string>("100dvh");

/**
 * Calculates the exact visible space remaining below the website header.
     * This keeps the complete hero inside the current screen without requiring
     * a fixed header-height value or adding extra page scroll.
     */
  const updateHeroHeight = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const viewportHeight =
      window.visualViewport?.height ?? window.innerHeight;
    const sectionTop = section.getBoundingClientRect().top;
    const availableHeight = Math.max(viewportHeight - sectionTop, 100);

    setHeroHeight(`${Math.round(availableHeight)}px`);
  }, []);

  useLayoutEffect(() => {
    // Set initial height synchronously to prevent layout shift
    setHeroHeight("100dvh");
    
    // Small delay to ensure DOM is ready
    const rafId = window.requestAnimationFrame(() => {
      updateHeroHeight();
    });

    const timeoutId = window.setTimeout(() => {
      updateHeroHeight();
    }, 100);

    window.addEventListener("resize", updateHeroHeight);
    window.addEventListener("orientationchange", updateHeroHeight);
    window.visualViewport?.addEventListener("resize", updateHeroHeight);

    const parent = sectionRef.current?.parentElement;
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            window.requestAnimationFrame(updateHeroHeight);
          })
        : null;

    if (parent) resizeObserver?.observe(parent);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      window.removeEventListener("resize", updateHeroHeight);
      window.removeEventListener("orientationchange", updateHeroHeight);
      window.visualViewport?.removeEventListener("resize", updateHeroHeight);
      resizeObserver?.disconnect();
    };
  }, [updateHeroHeight]);

  useEffect(() => {
    if (slides.length === 0) return;

    if (active >= slides.length) {
      setActive(0);
    }
  }, [active, slides.length]);

  const goTo = useCallback(
    (index: number) => {
      if (slides.length === 0) return;

      setActive(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  const next = useCallback(() => {
    if (slides.length <= 1) return;

    setActive((current) => (current + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length <= 1) return;

    setActive(
      (current) => (current - 1 + slides.length) % slides.length
    );
  }, [slides.length]);

  /**
   * A timeout is recreated after every slide change. This avoids duplicate
   * intervals when autoplay is paused and resumed multiple times.
   */
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, isPaused, next, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      aria-label="Featured collections"
      aria-roledescription="carousel"
      style={{ height: heroHeight }}
      className="relative w-full overflow-hidden bg-slate-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {/* Full-width dynamic background images */}
      {slides.map((slide, index) => {
        const isActive = index === active;

        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive
                ? "z-0 opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover object-center ${
                isActive ? "hero-image-zoom" : ""
              }`}
            />
          </div>
        );
      })}

      {/* Pink/light overlay similar to the provided reference */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-rose-200/10" />

      {/* Keeps text readable while the image remains the full hero background */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(255,240,242,0.97)_0%,rgba(255,232,236,0.88)_25%,rgba(255,235,238,0.55)_43%,rgba(255,255,255,0.12)_66%,transparent_84%)]" />

      {/* Dynamic text content layered over the background image */}
      <div className="absolute inset-0 z-10">
        {slides.map((slide, index) => {
          const isActive = index === active;

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 flex items-center px-7 pb-14 pt-6 transition-all duration-700 ease-out sm:px-10 md:px-12 lg:px-[68px] ${
                isActive
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-5 opacity-0"
              }`}
            >
              <div className="w-full max-w-[760px]">
                {slide.eyebrow && (
                  <span className="mb-5 inline-flex items-center rounded-full border border-orange-400/70 bg-orange-200/45 px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-orange-600 backdrop-blur-sm sm:mb-6 sm:px-6 sm:py-2.5 sm:text-sm lg:mb-7 lg:text-base">
                    {slide.eyebrow}
                  </span>
                )}

                <h1 className="max-w-[760px] text-[clamp(2.35rem,5vw,5.15rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-slate-950">
                  {slide.title}

                  {slide.titleHighlight && (
                    <span className="block">{slide.titleHighlight}</span>
                  )}
                </h1>

                {slide.description && (
                  <p className="mt-5 max-w-[680px] text-[clamp(1rem,1.55vw,1.7rem)] leading-relaxed text-slate-700 sm:mt-6">
                    {slide.description}
                  </p>
                )}

                {(slide.ctaPrimaryLabel || slide.ctaSecondaryLabel) && (
                  <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4 lg:mt-9">
                    {slide.ctaPrimaryLabel && (
                      <Link
                        href={slide.ctaPrimaryHref || "#"}
                        tabIndex={isActive ? 0 : -1}
                        className="group inline-flex min-h-14 items-center justify-center gap-3 bg-orange-500 px-7 text-sm font-bold text-white shadow-[0_14px_30px_rgba(249,115,22,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 sm:min-h-16 sm:px-9 sm:text-base lg:text-lg"
                      >
                        {slide.ctaPrimaryLabel}
                        <span
                          aria-hidden="true"
                          className="text-2xl leading-none transition-transform duration-300 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </Link>
                    )}

                    {slide.ctaSecondaryLabel && (
                      <Link
                        href={slide.ctaSecondaryHref || "#"}
                        tabIndex={isActive ? 0 : -1}
                        className="inline-flex min-h-14 items-center justify-center border border-white/60 bg-white/65 px-7 text-sm font-bold text-slate-800 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 sm:min-h-16 sm:px-9 sm:text-base"
                      >
                        {slide.ctaSecondaryLabel}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Left and right edge navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="group absolute left-0 top-1/2 z-30 flex h-20 w-11 -translate-y-1/2 items-center justify-center rounded-r-2xl border border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-[3px] transition-all duration-300 hover:bg-white/35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 sm:h-24 sm:w-14 lg:h-28 lg:w-[68px]"
          >
            <ChevronLeft className="h-7 w-7 transition-transform duration-300 group-hover:-translate-x-1 sm:h-8 sm:w-8 lg:h-9 lg:w-9" />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="group absolute right-0 top-1/2 z-30 flex h-20 w-11 -translate-y-1/2 items-center justify-center rounded-l-2xl border border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-[3px] transition-all duration-300 hover:bg-white/35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 sm:h-24 sm:w-14 lg:h-28 lg:w-[68px]"
          >
            <ChevronRight className="h-7 w-7 transition-transform duration-300 group-hover:translate-x-1 sm:h-8 sm:w-8 lg:h-9 lg:w-9" />
          </button>
        </>
      )}

      {/* Indicators stay inside the hero and do not increase section height */}
      {slides.length > 1 && (
        <div
          role="tablist"
          aria-label="Hero slides"
          className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 sm:bottom-7 sm:gap-3"
        >
          {slides.map((slide, index) => {
            const isActive = index === active;

            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={isActive}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full shadow-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 sm:h-2.5 ${
                  isActive
                    ? "w-12 bg-orange-500 sm:w-16"
                    : "w-8 bg-white/70 hover:bg-white sm:w-11"
                }`}
              />
            );
          })}
        </div>
      )}

      {/* Self-contained animation: no Tailwind config update is required */}
      <style jsx global>{`
        @keyframes hero-image-ken-burns {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.08);
          }
        }

        .hero-image-zoom {
          animation: hero-image-ken-burns 7s ease-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-image-zoom {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
