import { getActiveHeroSlides } from "@/lib/hero-service";
import HeroCarousel from "@/components/HeroCarousel";

export const dynamic = "force-dynamic";

export default async function HeroSection() {
  const slides = await getActiveHeroSlides();

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full" style={{ height: "100dvh" }}>
      <HeroCarousel slides={slides} />
    </div>
  );
}