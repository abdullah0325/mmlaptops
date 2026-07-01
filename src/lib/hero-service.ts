import { HeroSlide } from "@/types/hero";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = "data/hero-slides.json";

async function readData(): Promise<HeroSlide[]> {
  try {
    const content = await fs.readFile(path.join(process.cwd(), DATA_FILE), "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to read hero slides data:", { path: DATA_FILE, error });
    return [];
  }
}

async function writeData(slides: HeroSlide[]): Promise<void> {
  const fullPath = path.join(process.cwd(), DATA_FILE);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, JSON.stringify(slides, null, 2), "utf-8");
}

export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  const slides = await readData();
  return slides
    .filter((slide) => slide.isActive)
    .sort((a, b) => a.order - b.order);
}

export async function getAllHeroSlides(): Promise<HeroSlide[]> {
  const slides = await readData();
  return slides.sort((a, b) => a.order - b.order);
}

export async function createHeroSlide(
  slide: Omit<HeroSlide, "id" | "order">,
): Promise<HeroSlide> {
  const slides = await readData();
  const maxOrder = Math.max(0, ...slides.map((s) => s.order));
  const newSlide: HeroSlide = {
    ...slide,
    id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    order: maxOrder + 1,
  };
  slides.push(newSlide);
  await writeData(slides);
  return newSlide;
}

export async function updateHeroSlide(
  id: string,
  data: Partial<Omit<HeroSlide, "id">>,
): Promise<HeroSlide | null> {
  const slides = await readData();
  const index = slides.findIndex((s) => s.id === id);
  if (index === -1) return null;
  slides[index] = { ...slides[index], ...data };
  await writeData(slides);
  return slides[index];
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
  const slides = await readData();
  const filtered = slides.filter((s) => s.id !== id);
  if (filtered.length === slides.length) return false;
  await writeData(filtered);
  return true;
}

export async function reorderHeroSlides(
  orderedIds: string[],
): Promise<HeroSlide[]> {
  const slides = await readData();
  const ordered: HeroSlide[] = [];
  for (let i = 0; i < orderedIds.length; i++) {
    const slide = slides.find((s) => s.id === orderedIds[i]);
    if (slide) {
      slide.order = i + 1;
      ordered.push(slide);
    }
  }
  for (const slide of slides.filter((s) => !orderedIds.includes(s.id))) {
    slide.order = orderedIds.length + 1;
    ordered.push(slide);
  }
  await writeData(ordered);
  return ordered;
}