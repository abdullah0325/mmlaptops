"use client";

import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { Money, useCart } from "@/lib/commerce";
import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";
import { addToCart as trackAddToCart } from "@/lib/pixel";

// ─── Types ───────────────────────────────────────────────────────────────────

type ProductCardProps = {
  handle: string;
  title: string;
  featuredImageUrl: string;
  imageUrls?: string[];
  price: { amount: string; currencyCode: string };
  compareAtPrice?: { amount: string; currencyCode: string } | null;
  tag?: string;
  variantId?: string;
  productId?: string;
};

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const FALLBACK_IMAGE = "/logo/mmlaptop.png";

function discountPercent(compare: string, current: string): number | null {
  const c = parseFloat(compare);
  const p = parseFloat(current);
  if (!c || !p || c <= p) return null;
  return Math.round(((c - p) / c) * 100);
}

function formatPrice(amount: string) {
  const n = parseFloat(amount);
  return `Rs.${n.toLocaleString("en-PK")}`;
}

// ─── Star Rating ─────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-yellow-400 text-sm leading-none">★</span>
      <span className="text-xs font-semibold text-[#0a0a0a]">
        {rating.toFixed(2)}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function StoreProductCard({
  handle,
  title,
  featuredImageUrl,
  imageUrls,
  price,
  compareAtPrice,
  tag,
  variantId,
  productId,
}: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const { linesAdd } = useCart();

  // ── Slide transition state ──
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const [incomingImg, setIncomingImg] = useState<string | null>(null);
  const [slideIn, setSlideIn] = useState(false);

  const productImages = useMemo(() => {
    const urls = [featuredImageUrl, ...(imageUrls || [])]
      .filter((url): url is string => typeof url === "string" && url.trim().length > 0)
      .filter((url, index, all) => all.indexOf(url) === index)
      .filter((url) => !failedImages.includes(url));

    return urls.length > 0 ? urls : [FALLBACK_IMAGE];
  }, [featuredImageUrl, imageUrls, failedImages]);

  const displayImageIndex = activeImageIndex % productImages.length;
  const displayImage = productImages[displayImageIndex] || FALLBACK_IMAGE;

  const effectiveVariantId = variantId || productId;

  const discount = compareAtPrice
    ? discountPercent(compareAtPrice.amount, price.amount)
    : null;

  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}?text=${encodeURIComponent(
    `Hi, I want to order ${title}`
  )}`;

  // ── Fetch review stats ──
  useEffect(() => {
    async function fetchReviewStats() {
      try {
        const res = await fetch(`/api/reviews?productHandle=${handle}&limit=1`);
        const data = await res.json();
        if (data.statistics) setReviewStats(data.statistics);
      } catch {
        // silently fail
      }
    }
    fetchReviewStats();
  }, [handle]);

  useEffect(() => {
    setActiveImageIndex(0);
    setFailedImages([]);
  }, [featuredImageUrl, imageUrls]);

  // ── Slide transition: new image glides in from the right, old one glides out to the left ──
  useEffect(() => {
    // First image ever — just set it, no animation needed.
    if (currentImg === null) {
      setCurrentImg(displayImage);
      return;
    }
    if (displayImage === currentImg || displayImage === incomingImg) return;

    setIncomingImg(displayImage);
    setSlideIn(false);

    // Kick the animation off on the next paint so the browser registers the
    // starting (off-screen) position before we transition to the ending
    // position — otherwise it can appear to "snap" instead of sliding.
    const raf = requestAnimationFrame(() => {
      // Force a layout read so the browser commits the starting transform
      // before we flip the class that starts the transition.
      void document.body.offsetHeight;
      setSlideIn(true);
    });

    // Match this to the transition duration below (ms). Kept in sync with
    // the Tailwind `duration-700` class used on the sliding layers.
    const SLIDE_DURATION = 700;
    const timeout = setTimeout(() => {
      setCurrentImg(displayImage);
      setIncomingImg(null);
      setSlideIn(false);
    }, SLIDE_DURATION);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayImage]);

  useEffect(() => {
    if (productImages.length <= 1 || isImageHovered) return;

    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % productImages.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [productImages.length, isImageHovered]);

  // ── Add to cart ──
  const handleAddToCart = async () => {
    if (!effectiveVariantId) return;
    setLoading(true);
    try {
      await linesAdd([
        {
          merchandiseId: effectiveVariantId,
          quantity: 1,
          title,
          price,
          imageUrl: featuredImageUrl,
        },
      ]);
      toast.success("Added to cart", { description: title });
      trackAddToCart(title, effectiveVariantId, parseFloat(price.amount));
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative flex flex-col border border-black rounded-2xl bg-white overflow-hidden transition-shadow duration-200 hover:shadow-lg">

      {/* ── Tag badge ─────────────────────────────────────── */}
      {tag && (
        <span className="absolute top-3 left-3 z-10 text-[10px] font-bold tracking-widest uppercase text-[#c47fd4]">
          {tag}
        </span>
      )}

      {/* ── WhatsApp floating button ───────────────────────── */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-[88px] right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#25d366] text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-label="Order on WhatsApp"
      >
        <FaWhatsapp className="h-4 w-4" />
      </a>

      {/* ── Product image ──────────────────────────────────── */}
      <Link
        href={`/products/${handle}`}
        className="block relative aspect-square w-full overflow-hidden bg-white"
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
        onFocus={() => setIsImageHovered(true)}
        onBlur={() => setIsImageHovered(false)}
      >
        {/* Current image — slides out to the left once a new image starts coming in */}
        <div
          className={`absolute inset-0 transition-transform duration-700 ease-in-out will-change-transform ${
            incomingImg && slideIn ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          {currentImg && (
            <Image
              src={currentImg}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-5 transition duration-300 group-hover:scale-105"
              onError={() =>
                setFailedImages((current) =>
                  current.includes(currentImg) ? current : [...current, currentImg]
                )
              }
            />
          )}
        </div>

        {/* Incoming image — starts fully off-screen to the right, glides in slowly */}
        {incomingImg && (
          <div
            className={`absolute inset-0 transition-transform duration-700 ease-in-out will-change-transform ${
              slideIn ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <Image
              src={incomingImg}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-5"
              onError={() =>
                setFailedImages((current) =>
                  current.includes(incomingImg) ? current : [...current, incomingImg]
                )
              }
            />
          </div>
        )}
      </Link>

      {/* ── Card body ─────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 px-4 pt-3 pb-4">

        {/* Title + discount % */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${handle}`}>
            <h3 className="text-base font-bold text-[#0a0a0a] leading-tight hover:underline line-clamp-1">
              {title}
            </h3>
          </Link>
          {discount !== null && (
            <span className="shrink-0 text-xs font-bold text-[#f6a45d] whitespace-nowrap">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Rating row */}
        <div className="flex items-center justify-between">
          {reviewStats && reviewStats.totalReviews > 0 ? (
            <StarRating rating={reviewStats.averageRating} />
          ) : (
            <span className="text-[11px] text-gray-400">No reviews yet</span>
          )}
        </div>

        {/* Prices + Buy Now button */}
        <div className="flex items-center justify-between mt-1 gap-2">
          <div className="flex flex-col leading-tight">
            {compareAtPrice && (
              <span className="text-xs text-gray-400 line-through">
                <Money data={compareAtPrice} />
              </span>
            )}
            <span className="text-base font-extrabold text-[#0a0a0a]">
              <Money data={price} />
            </span>
          </div>

          {/* Buy Now — add to cart if variantId exists, else link to PDP */}
          {effectiveVariantId ? (
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="rounded-full bg-[#8b1a1a] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#a52020] active:scale-95 disabled:opacity-60 whitespace-nowrap"
            >
              {loading ? "Adding…" : "Buy Now"}
            </button>
          ) : (
            <Link
              href={`/products/${handle}`}
              className="rounded-full bg-[#8b1a1a] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#a52020] active:scale-95 whitespace-nowrap"
            >
              Buy Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}