"use client"

import Link from "next/link"
import { Autoplay, Pagination, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

// If you get TS errors on these imports, add  "types": ["swiper"]  to your tsconfig,
// or create a file  swiper.d.ts  with:  declare module 'swiper/css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import "swiper/css"
// @ts-ignore
import "swiper/css/navigation"
// @ts-ignore
import "swiper/css/pagination"

const slides = [
  {
    id: 1,
    eyebrow: "Your Trusted Tech Destination",
    title: "Premium Laptops",
    titleGold: "& Tech",
    subtitle: "Power. Performance. Portability.",
    description:
      "Discover the latest gaming laptops, business ultrabooks, and budget-friendly machines — all backed by genuine warranty at MM Laptop Center.",
  },
  {
    id: 2,
    eyebrow: "Gaming Laptops",
    title: "Dominate",
    titleGold: "Every Game",
    subtitle: "RTX-powered performance",
    description:
      "High-refresh displays, latest NVIDIA GPUs, and powerful processors — built for gamers who demand the best.",
  },
  {
    id: 3,
    eyebrow: "Business & Ultrabooks",
    title: "Work Smarter,",
    titleGold: "Anywhere",
    subtitle: "Lightweight. All-day battery.",
    description:
      "Premium business laptops and ultrabooks designed for professionals who need reliability on the go.",
  },
  {
    id: 4,
    eyebrow: "Hot Deals",
    title: "Accessories",
    titleGold: "& Peripherals",
    subtitle: "Complete your setup",
    description:
      "Monitors, keyboards, mice, bags, and more — everything you need to upgrade your laptop experience.",
  },
]

const Hero = () => {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');

        /* ── root tokens (matching reference HTML) ── */
        .mm-hero-wrap {
          --gold:        #d8a928;
          --gold-light:  #f4d77a;
          --orange:      #f6a45d;
          --orange-light:#ffd2aa;
          --cream:       #fff9f0;
          --black:       #0a0a0a;
          --brown-dark:  #1a1308;
          --brown-text:  #4d3d28;
          --brown-muted: #6b5d3e;
          --brown-deep:  #8b6f2a;
          font-family: "Manrope", sans-serif;
        }

        /* ── Section / background ── */
        .mm-hero-section {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 77% 18%, rgba(246,164,93,.18), transparent 27%),
            radial-gradient(circle at 12% 78%, rgba(216,169,40,.15), transparent 28%),
            linear-gradient(145deg, #fcf5e8 0%, #f5e8d0 100%);
        }

        /* floating gold rings (::before / ::after via pseudo divs) */
        .mm-hero-ring-1,
        .mm-hero-ring-2 {
          pointer-events: none;
          position: absolute;
          border: 1px solid rgba(216,169,40,.15);
          border-radius: 50%;
          animation: mmFloatRing 8s ease-in-out infinite;
        }
        .mm-hero-ring-1 { width: 470px; height: 470px; right: -100px; top: 60px; }
        .mm-hero-ring-2 { width: 260px; height: 260px; left: -90px; bottom: 45px; animation-delay: -3s; }

        @keyframes mmFloatRing {
          50% { transform: translateY(-20px) scale(1.04); }
        }

        /* ── Slide inner layout ── */
        .mm-slide-inner {
          min-height: 560px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 52px;
          max-width: 1180px;
          margin: 0 auto;
          padding: 80px 24px;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 768px) {
          .mm-slide-inner {
            grid-template-columns: 1fr;
            min-height: auto;
            padding: 60px 20px 48px;
            gap: 32px;
            text-align: center;
          }
          .mm-visual { display: none; }
          .mm-hero-actions { justify-content: center; }
        }

        /* ── Eyebrow ── */
        .mm-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 9px 16px;
          border: 1px solid rgba(216,169,40,.3);
          background: rgba(255,255,255,.55);
          border-radius: 999px;
          color: #8b6f2a;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 22px;
        }
        .mm-eyebrow-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #f6a45d;
          box-shadow: 0 0 14px #f6a45d;
          flex-shrink: 0;
        }

        /* ── Title ── */
        .mm-title {
          font-family: "Playfair Display", serif;
          font-size: clamp(40px, 5.5vw, 80px);
          line-height: .98;
          letter-spacing: -2.5px;
          color: #1a1308;
          margin: 0 0 16px;
        }
        .mm-title-gold {
          background: linear-gradient(90deg, #b8860b, #d8a928, #f6a45d);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          display: block;
        }

        /* ── Subtitle ── */
        .mm-subtitle {
          font-size: 15px;
          font-weight: 700;
          color: #f6a45d;
          letter-spacing: .4px;
          margin-bottom: 14px;
        }

        /* ── Description ── */
        .mm-desc {
          color: #4d3d28;
          font-size: 15px;
          line-height: 1.8;
          font-weight: 400;
          max-width: 520px;
          margin-bottom: 32px;
        }

        /* ── Buttons ── */
        .mm-hero-actions { display: flex; flex-wrap: wrap; gap: 14px; }

        .mm-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #f4d77a, #d8a928, #f6a45d);
          color: #0d0d0d;
          padding: 14px 28px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 800;
          font-family: "Manrope", sans-serif;
          letter-spacing: .4px;
          text-decoration: none;
          box-shadow: 0 14px 32px rgba(216,169,40,.28);
          transition: transform .28s ease, box-shadow .28s ease;
        }
        .mm-btn-primary:hover {
          transform: translateY(-4px);
          box-shadow: 0 22px 42px rgba(216,169,40,.38);
          color: #0d0d0d;
        }

        .mm-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,.55);
          color: #2d2416;
          padding: 13px 28px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 800;
          font-family: "Manrope", sans-serif;
          letter-spacing: .4px;
          text-decoration: none;
          border: 1px solid rgba(216,169,40,.3);
          transition: transform .28s ease, border-color .28s ease, color .28s ease;
        }
        .mm-btn-outline:hover {
          transform: translateY(-4px);
          border-color: #d8a928;
          color: #8b6f2a;
        }

        /* ── Visual panel (right side) ── */
        .mm-visual {
          position: relative;
          display: grid;
          place-items: center;
        }

        .mm-visual-card {
          width: min(480px, 100%);
          border-radius: 32px;
          overflow: hidden;
          background: linear-gradient(145deg, #f5e8d0, #e8d5b5);
          border: 2px solid rgba(216,169,40,.22);
          box-shadow: 0 35px 90px rgba(0,0,0,.10);
          transform: perspective(1100px) rotateY(-5deg) rotateX(2deg);
          animation: mmFloatCard 5s ease-in-out infinite;
          aspect-ratio: 4/3;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes mmFloatCard {
          0%, 100% { transform: perspective(1100px) rotateY(-5deg) rotateX(2deg) translateY(0); }
          50%       { transform: perspective(1100px) rotateY(-5deg) rotateX(2deg) translateY(-14px); }
        }

        .mm-visual-inner {
          font-family: "Playfair Display", serif;
          font-size: 28px;
          font-weight: 800;
          color: #8b6f2a;
          text-align: center;
          padding: 32px;
          letter-spacing: -0.5px;
        }

        .mm-visual-inner span {
          display: block;
          font-family: "Manrope", sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #b8860b;
          margin-top: 8px;
        }

        /* badge floating */
        .mm-badge {
          position: absolute;
          background: linear-gradient(135deg, #f4d77a, #d8a928);
          color: #0a0a0a;
          font-family: "Manrope", sans-serif;
          font-size: 11px;
          font-weight: 800;
          padding: 10px 16px;
          border-radius: 14px;
          box-shadow: 0 8px 24px rgba(216,169,40,.3);
          white-space: nowrap;
        }
        .mm-badge-tl { top: 24px;  left: -16px; }
        .mm-badge-br { bottom: 24px; right: -16px; }

        /* ── Pagination ── */
        .mm-heroSwiper .swiper-pagination {
          bottom: 20px;
        }
        .mm-heroSwiper .swiper-pagination-bullet {
          width: 7px; height: 7px;
          background: rgba(26,19,8,.25);
          opacity: 1;
          transition: all .3s;
        }
        .mm-heroSwiper .swiper-pagination-bullet-active {
          background: #d8a928;
          width: 24px;
          border-radius: 4px;
        }

        /* ── Nav arrows ── */
        .mm-heroSwiper .swiper-button-prev,
        .mm-heroSwiper .swiper-button-next {
          width: 46px; height: 46px;
          border-radius: 50%;
          background: rgba(255,255,255,.7);
          border: 1px solid rgba(216,169,40,.3);
          color: #8b6f2a;
          backdrop-filter: blur(8px);
          transition: .25s ease;
        }
        .mm-heroSwiper .swiper-button-prev:hover,
        .mm-heroSwiper .swiper-button-next:hover {
          background: #fff;
          border-color: #d8a928;
          color: #b8860b;
        }
        .mm-heroSwiper .swiper-button-prev::after,
        .mm-heroSwiper .swiper-button-next::after {
          font-size: 14px; font-weight: 900;
        }

        @media (max-width: 768px) {
          .mm-heroSwiper .swiper-button-prev,
          .mm-heroSwiper .swiper-button-next { display: none; }
        }
      `}</style>

      <div className="mm-hero-wrap">
        <section className="mm-hero-section">
          {/* decorative rings */}
          <div className="mm-hero-ring-1" />
          <div className="mm-hero-ring-2" />

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            slidesPerView={1}
            loop
            speed={900}
            autoplay={{ delay: 5500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            className="mm-heroSwiper"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="mm-slide-inner">

                  {/* ── LEFT: text content ── */}
                  <div>
                    <div className="mm-eyebrow">
                      <span className="mm-eyebrow-dot" />
                      {slide.eyebrow}
                    </div>

                    <h1 className="mm-title">
                      {slide.title}
                      <span className="mm-title-gold">{slide.titleGold}</span>
                    </h1>

                    <p className="mm-subtitle">{slide.subtitle}</p>

                    <p className="mm-desc">{slide.description}</p>

                    <div className="mm-hero-actions">
                      <Link href="/products" className="mm-btn-primary">
                        Shop Now →
                      </Link>
                      <Link href="/collections/hot-deals" className="mm-btn-outline">
                        View Deals
                      </Link>
                    </div>
                  </div>

                  {/* ── RIGHT: visual card ── */}
                  <div className="mm-visual">
                    <div style={{ position: "relative" }}>
                      <div className="mm-badge mm-badge-tl">✦ Genuine Warranty</div>
                      <div className="mm-visual-card">
                        <div className="mm-visual-inner">
                          MM Laptop Center
                          <span>Premium Technology</span>
                        </div>
                      </div>
                      <div className="mm-badge mm-badge-br">🚀 Fast Delivery</div>
                    </div>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>
    </>
  )
}

export default Hero