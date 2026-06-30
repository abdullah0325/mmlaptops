import HeroCarousel from "@/components/HeroCarousel";
import { getActiveHeroSlides } from "@/lib/hero-service";

export const dynamic = "force-dynamic";

export default async function HeroSection() {
  const slides = await getActiveHeroSlides();

  if (slides.length === 0) {
    return null;
  }

  return <HeroCarousel slides={slides} />;
}
