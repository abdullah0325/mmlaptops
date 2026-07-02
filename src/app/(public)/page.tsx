import { Laptop, Gamepad2, Briefcase } from "@esmate/shadcn/pkgs/lucide-react";
import BlogSection from "@/components/blog-section";
import Testimonials from "@/components/Testimonials";
import HeroSection from "@/components/HeroSection";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CategoriesSection, ProductsSection } from "@/components/home-products";

export const dynamic = "force-dynamic";

async function safeHomeQuery<T>(
  label: string,
  query: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.warn(`Using fallback for home page ${label}: ${message}`);
    return fallback;
  }
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MM Laptop Center",
  "url": "https://mmlaptopcenter.com",
  "logo": "https://mmlaptopcenter.com/images/logo.png",
  "sameAs": [
    "https://www.facebook.com/mmlaptopcenter",
    "https://www.instagram.com/mmlaptopcenter",
    "https://twitter.com/mmlaptopcenter"
  ]
};

export const metadata: Metadata = {
  title: "MM Laptop Center – Premium Laptops & Tech",
  description:
    "MM Laptop Center – Shop premium laptops, gaming gear and accessories",
  keywords: [
    "laptops",
    "gaming laptops",
    "business laptops",
    "ultrabooks",
    "budget laptops",
    "laptop accessories",
    "monitors",
    "keyboards",
    "mice",
    "laptop bags",
    "MM Laptop Center",
    "tech store Pakistan",
  ],
  openGraph: {
    title: "MM Laptop Center – Premium Laptops & Tech",
    description:
      "Shop premium laptops, gaming gear and accessories at MM Laptop Center.",
    url: "https://mmlaptopcenter.com",
    siteName: "MM Laptop Center",
    type: "website",
    images: ["https://placehold.co/1400x600?text=MM+Laptop+Center"],
  },
  alternates: {
    canonical: "https://mmlaptopcenter.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Page() {
  const [categories, featuredProducts, featuredCollections, featuredBlogs, essenceSection] = await Promise.all([
    safeHomeQuery(
      "categories",
      () => prisma.category.findMany({
        where: { parentId: null },
        orderBy: { order: "asc" },
        select: { id: true, name: true, slug: true, image: true },
      }),
      [],
    ),
    safeHomeQuery(
      "featured products",
      () => prisma.product.findMany({
        where: { status: "ACTIVE", isFeatured: true },
        orderBy: { updatedAt: "desc" },
        take: 20,
        select: { id: true, handle: true, title: true, price: true, compareAtPrice: true, featuredImage: true, images: true, tags: true, categoryId: true, subcategoryId: true, isFeatured: true },
      }),
      [],
    ),
    safeHomeQuery(
      "featured collections",
      () => prisma.collection.findMany({
        where: { isFeatured: true },
        orderBy: { updatedAt: "desc" },
        take: 20,
        select: { id: true, handle: true, title: true, image: true },
      }),
      [],
    ),
    safeHomeQuery(
      "featured blogs",
      () => prisma.blogPost.findMany({
        where: { status: "published", isFeatured: true },
        orderBy: { publishedAt: "desc" },
        take: 20,
        select: { id: true, title: true, slug: true, excerpt: true, featuredImage: true, publishedAt: true, content: true },
      }),
      [],
    ),
    safeHomeQuery(
      "essence section",
      () => prisma.homepageSection.findUnique({
        where: { sectionKey: "essence" },
      }),
      null,
    ),

  ]);

return (
       <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        <div className="flex flex-col bg-gray-50">
          <HeroSection />
          <h1 className="sr-only">MM Laptop Center – Premium Laptops, Gaming Gear & Tech Accessories</h1>
         
          <CategoriesSection categories={categories} />

          <ProductsSection categories={categories} products={featuredProducts} collections={featuredCollections} />
       
        {/* Why Choose Us Section - matching About page styling */}
       <section className="bg-white px-6 py-10 lg:px-4 lg:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-5 space-y-4">
              <span className="inline-flex rounded-full bg-[#ffedd5] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                Why Choose Us
              </span>
              <h2 className="font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
                Why Choose MM Laptop Center
              </h2>
              <p className="text-gray-600 text-base sm:text-lg">
                Your trusted destination for genuine laptops and tech accessories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="rounded-3xl bg-white p-8 border border-[#d8a928]/20 shadow-lg hover:border-[#f6a45d] transition-all">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffedd5] text-[#ea580c]">
                  <Gamepad2 className="h-5 w-5" />
                </div>
                <h3 className="font-serif mt-4 text-xl font-bold text-gray-950">Gaming Laptops</h3>
                <ul className="mt-3 space-y-2 text-gray-600 leading-relaxed text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#d8a928] font-bold">•</span>
                    Latest NVIDIA RTX & AMD GPUs
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d8a928] font-bold">•</span>
                    High-refresh rate displays up to 165Hz
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d8a928] font-bold">•</span>
                    Advanced cooling for extended sessions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d8a928] font-bold">•</span>
                    RGB keyboards and premium audio
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl bg-white p-8 border border-[#d8a928]/20 shadow-lg hover:border-[#f6a45d] transition-all">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffedd5] text-[#ea580c]">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="font-serif mt-4 text-xl font-bold text-gray-950">Business Laptops</h3>
                <ul className="mt-3 space-y-2 text-gray-600 leading-relaxed text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#d8a928] font-bold">•</span>
                    Enterprise-grade security features
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d8a928] font-bold">•</span>
                    All-day battery life for remote work
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d8a928] font-bold">•</span>
                    Lightweight designs under 1.5kg
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d8a928] font-bold">•</span>
                    Premium build with MIL-STD durability
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl bg-white p-8 border border-[#d8a928]/20 shadow-lg hover:border-[#f6a45d] transition-all">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffedd5] text-[#ea580c]">
                  <Laptop className="h-5 w-5" />
                </div>
                <h3 className="font-serif mt-4 text-xl font-bold text-gray-950">Accessories & More</h3>
                <ul className="mt-3 space-y-2 text-gray-600 leading-relaxed text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#d8a928] font-bold">•</span>
                    Monitors, keyboards, and mice
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d8a928] font-bold">•</span>
                    Laptop bags and protective sleeves
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d8a928] font-bold">•</span>
                    USB-C hubs and docking stations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d8a928] font-bold">•</span>
                    Genuine warranty on all products
                  </li>
                </ul>
              </div>
            </div>
         </div>
        </section>

{/* Blog Section - matching About page styling */}
         <section className="bg-white px-6 py-10 lg:px-4 lg:py-14">
          <div className="mx-auto max-w-7xl">
            <BlogSection articles={featuredBlogs.map(b => ({
              id: b.id,
              title: b.title,
              handle: b.slug,
              publishedAt: b.publishedAt?.toISOString() ?? "",
              content: b.content ?? "",
              image: b.featuredImage ? { url: b.featuredImage } : null,
              blogHandle: "news"
            }))} />
          </div>
        </section>


        {/* Testimonials Section */}
        <section className="bg-gray-150 px-6 py-10 lg:px-4 lg:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="inline-flex rounded-full bg-[#ffedd5] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                Customer Voices
              </span>

             
            </div>

            <Testimonials />
          </div>
        </section>
      </div>
    </>
  );
}
