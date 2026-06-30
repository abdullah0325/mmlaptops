// "use client";

// import {
//   useCallback,
//   useEffect,
//   useLayoutEffect,
//   useRef,
//   useState,
// } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   ArrowRight,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

// export interface HeroSlide {
//   id: string;
//   imageUrl: string;
//   imageAlt: string;
//   eyebrow?: string;
//   title: string;
//   titleHighlight?: string;
//   description?: string;
//   ctaLabel?: string;
//   ctaHref?: string;

//   /**
//    * Controls which part of the background image stays visible.
//    *
//    * Examples:
//    * "center"
//    * "center right"
//    * "70% center"
//    * "80% 40%"
//    */
//     imagePosition?: string;
// }

// interface HeroSectionProps {
//   slides: HeroSlide[];
//   autoplayDuration?: number;
// }

// const DEFAULT_AUTOPLAY_DURATION = 6000;

// export default function HeroSection({
//   slides,
//   autoplayDuration = DEFAULT_AUTOPLAY_DURATION,
// }: HeroSectionProps) {
//   const sectionRef = useRef<HTMLElement | null>(null);

//   const [activeSlide, setActiveSlide] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const [heroHeight, setHeroHeight] = useState<number | null>(
//     null
//   );

//   /**
//    * Dynamically calculates the available space below the header.
//    *
//    * This means:
//    * viewport height - hero's top position = hero height
//    *
//    * Therefore, the complete hero remains visible without adding
//    * unnecessary page scrolling.
//    */
//   const calculateHeroHeight = useCallback(() => {
//     const section = sectionRef.current;

//     if (!section) return;

//     const viewportHeight =
//       window.visualViewport?.height || window.innerHeight;

//     const sectionTop = section.getBoundingClientRect().top;

//     const availableHeight = viewportHeight - sectionTop;

//     setHeroHeight(Math.max(availableHeight, 0));
//   }, []);

//   useLayoutEffect(() => {
//     calculateHeroHeight();

//     const animationFrame = window.requestAnimationFrame(
//       calculateHeroHeight
//     );

//     const resizeObserver = new ResizeObserver(() => {
//       calculateHeroHeight();
//     });

//     resizeObserver.observe(document.body);

//     window.addEventListener("resize", calculateHeroHeight);

//     window.visualViewport?.addEventListener(
//       "resize",
//       calculateHeroHeight
//     );

//     return () => {
//       window.cancelAnimationFrame(animationFrame);
//       resizeObserver.disconnect();

//       window.removeEventListener(
//         "resize",
//         calculateHeroHeight
//       );

//       window.visualViewport?.removeEventListener(
//         "resize",
//         calculateHeroHeight
//       );
//     };
//   }, [calculateHeroHeight]);

//   /**
//    * Ensures the active slide remains valid when dynamic database
//    * slides are added or removed.
//    */
//   useEffect(() => {
//     if (slides.length === 0) return;

//     if (activeSlide >= slides.length) {
//       setActiveSlide(0);
//     }
//   }, [activeSlide, slides.length]);

//   const goToSlide = useCallback(
//     (index: number) => {
//       if (slides.length === 0) return;

//       const safeIndex =
//         ((index % slides.length) + slides.length) %
//         slides.length;

//       setActiveSlide(safeIndex);
//     },
//     [slides.length]
//   );

//   const showNextSlide = useCallback(() => {
//     if (slides.length <= 1) return;

//     setActiveSlide(
//       (currentSlide) =>
//         (currentSlide + 1) % slides.length
//     );
//   }, [slides.length]);

//   const showPreviousSlide = useCallback(() => {
//     if (slides.length <= 1) return;

//     setActiveSlide(
//       (currentSlide) =>
//         (currentSlide - 1 + slides.length) %
//         slides.length
//     );
//   }, [slides.length]);

//   /**
//    * Autoplay uses setTimeout instead of setInterval.
//    *
//    * This prevents multiple intervals from being created when the
//    * user repeatedly enters and leaves the hero.
//    */
//   useEffect(() => {
//     if (
//       slides.length <= 1 ||
//       isPaused ||
//       autoplayDuration <= 0
//     ) {
//       return;
//     }

//     const autoplayTimer = window.setTimeout(() => {
//       showNextSlide();
//     }, autoplayDuration);

//     return () => {
//       window.clearTimeout(autoplayTimer);
//     };
//   }, [
//     activeSlide,
//     autoplayDuration,
//     isPaused,
//     showNextSlide,
//     slides.length,
//   ]);

//   /**
//    * Keyboard navigation.
//    */
//   const handleKeyboardNavigation = (
//     event: React.KeyboardEvent<HTMLElement>
//   ) => {
//     if (event.key === "ArrowLeft") {
//       showPreviousSlide();
//     }

//     if (event.key === "ArrowRight") {
//       showNextSlide();
//     }
//   };

//   if (slides.length === 0) {
//     return null;
//   }

//   return (
//     <>
//       <section
//         ref={sectionRef}
//         aria-label="Featured collections"
//         aria-roledescription="carousel"
//         tabIndex={0}
//         style={{
//           height:
//             heroHeight !== null
//               ? `${heroHeight}px`
//               : "calc(100svh - 164px)",
//         }}
//         className="hero-section relative w-full overflow-hidden bg-gray-100 outline-none"
//         onKeyDown={handleKeyboardNavigation}
//         onMouseEnter={() => setIsPaused(true)}
//         onMouseLeave={() => setIsPaused(false)}
//         onFocusCapture={() => setIsPaused(true)}
//         onBlurCapture={() => setIsPaused(false)}
//         onTouchStart={() => setIsPaused(true)}
//         onTouchEnd={() => setIsPaused(false)}
//       >
//         {/* Full-width dynamic background images */}
//         {slides.map((slide, index) => {
//           const isActive = index === activeSlide;

//           return (
//             <div
//               key={slide.id}
//               aria-hidden={!isActive}
//               className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//                 isActive
//                   ? "z-0 opacity-100"
//                   : "pointer-events-none opacity-0"
//               }`}
//             >
//               <Image
//                 src={slide.imageUrl}
//                 alt={slide.imageAlt}
//                 fill
//                 priority={index === 0}
//                 sizes="100vw"
//                 style={{
//                   objectPosition:
//                     slide.imagePosition ||
//                     "center center",
//                 }}
//                 className={`object-cover ${
//                   isActive
//                     ? "hero-ken-burns-animation"
//                     : ""
//                 }`}
//               />
//             </div>
//           );
//         })}

//         {/* Soft color tint like the reference screenshot */}
//         <div className="pointer-events-none absolute inset-0 z-[1] bg-rose-200/10" />

//         {/* Left readability gradient */}
//         <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(255,237,240,0.96)_0%,rgba(255,232,236,0.87)_24%,rgba(255,234,237,0.56)_42%,rgba(255,255,255,0.12)_64%,transparent_82%)]" />

//         {/* Dynamic slide text content */}
//         <div className="absolute inset-0 z-10">
//           {slides.map((slide, index) => {
//             const isActive = index === activeSlide;

//             return (
//               <div
//                 key={slide.id}
//                 aria-hidden={!isActive}
//                 className={`absolute inset-0 flex items-center px-7 transition-all duration-700 ease-out sm:px-10 md:px-12 lg:px-[68px] ${
//                   isActive
//                     ? "translate-y-0 opacity-100"
//                     : "pointer-events-none translate-y-6 opacity-0"
//                 }`}
//               >
//                 <div className="w-full max-w-[780px]">
//                   {slide.eyebrow && (
//                     <div className="mb-5 sm:mb-6 lg:mb-8">
//                       <span className="inline-flex items-center rounded-full border border-orange-400/80 bg-orange-200/50 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-orange-600 backdrop-blur-sm sm:px-6 sm:py-3 sm:text-sm lg:text-base">
//                         {slide.eyebrow}
//                       </span>
//                     </div>
//                   )}

//                   <h1 className="max-w-[760px] text-[42px] font-extrabold leading-[0.98] tracking-[-0.045em] text-slate-950 sm:text-[56px] md:text-[66px] lg:text-[82px]">
//                     <span>{slide.title}</span>

//                     {slide.titleHighlight && (
//                       <>
//                         <br />
//                         <span>{slide.titleHighlight}</span>
//                       </>
//                     )}
//                   </h1>

//                   {slide.description && (
//                     <p className="mt-5 max-w-[690px] text-base leading-relaxed text-slate-700 sm:mt-6 sm:text-lg md:text-xl lg:mt-8 lg:text-[27px] lg:leading-[1.4]">
//                       {slide.description}
//                     </p>
//                   )}

//                   {slide.ctaLabel && (
//                     <Link
//                       href={slide.ctaHref || "#"}
//                       tabIndex={isActive ? 0 : -1}
//                       className="group mt-7 inline-flex min-h-[58px] items-center justify-center gap-3 bg-orange-500 px-7 text-base font-bold text-white shadow-[0_14px_30px_rgba(249,115,22,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 sm:mt-9 sm:min-h-[64px] sm:px-9 sm:text-lg lg:mt-10 lg:min-h-[72px]"
//                     >
//                       <span>{slide.ctaLabel}</span>

//                       <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 sm:h-6 sm:w-6" />
//                     </Link>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Left and right navigation arrows */}
//         {slides.length > 1 && (
//           <>
//             <button
//               type="button"
//               aria-label="Show previous slide"
//               onClick={showPreviousSlide}
//               className="group absolute left-0 top-1/2 z-30 flex h-20 w-11 -translate-y-1/2 items-center justify-center rounded-r-2xl border border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-[3px] transition-all duration-300 hover:w-14 hover:bg-white/35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 sm:h-24 sm:w-14 lg:h-28 lg:w-[68px]"
//             >
//               <ChevronLeft className="h-7 w-7 transition-transform duration-300 group-hover:-translate-x-1 sm:h-8 sm:w-8 lg:h-9 lg:w-9" />
//             </button>

//             <button
//               type="button"
//               aria-label="Show next slide"
//               onClick={showNextSlide}
//               className="group absolute right-0 top-1/2 z-30 flex h-20 w-11 -translate-y-1/2 items-center justify-center rounded-l-2xl border border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-[3px] transition-all duration-300 hover:w-14 hover:bg-white/35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 sm:h-24 sm:w-14 lg:h-28 lg:w-[68px]"
//             >
//               <ChevronRight className="h-7 w-7 transition-transform duration-300 group-hover:translate-x-1 sm:h-8 sm:w-8 lg:h-9 lg:w-9" />
//             </button>
//           </>
//         )}

//         {/* Indicators positioned inside the hero at the bottom */}
//         {slides.length > 1 && (
//           <div
//             role="tablist"
//             aria-label="Choose hero slide"
//             className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 sm:bottom-7 sm:gap-3"
//           >
//             {slides.map((slide, index) => {
//               const isActive = index === activeSlide;

//               return (
//                 <button
//                   key={slide.id}
//                   type="button"
//                   role="tab"
//                   aria-label={`Show slide ${index + 1}`}
//                   aria-selected={isActive}
//                   onClick={() => goToSlide(index)}
//                   className={`h-2 rounded-full shadow-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 sm:h-2.5 ${
//                     isActive
//                       ? "w-12 bg-orange-10 sm:w-16"
//                       : "w-8 bg-white/70 hover:bg-white sm:w-11"
//                   }`}
//                 />
//               );
//             })}
//           </div>
//         )}
//       </section>

//       {/* Component animation — no Tailwind config required */}
//       <style jsx global>{`
//         @keyframes heroKenBurns {
//           0% {
//             transform: scale(1);
//           }

//           100% {
//             transform: scale(1.1);
//           }
//         }

//         .hero-ken-burns-animation {
//           animation: heroKenBurns 7s ease-out forwards;
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .hero-section *,
//           .hero-section *::before,
//           .hero-section *::after {
//             scroll-behavior: auto !important;
//             animation-duration: 0.01ms !important;
//             animation-iteration-count: 1 !important;
//             transition-duration: 0.01ms !important;
//           }
//         }
//       `}</style>
//     </>
//   );
// }