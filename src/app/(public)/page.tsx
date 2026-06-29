import { Card, CardContent } from "@esmate/shadcn/components/ui/card";
import { Laptop, Gamepad2, Briefcase } from "@esmate/shadcn/pkgs/lucide-react";
import BlogSection from "@/components/blog-section";
import EssenceSection from "@/components/EssenceSection";
import Testimonials from "@/components/Testimonials";
import Hero from "@/components/Hero";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { HomeProducts } from "@/components/home-products";

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
  const [categories, featuredProducts, featuredCollections, featuredBlogs, essenceSection, featuredReviews] = await Promise.all([
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
        take: 3,
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
    safeHomeQuery(
      "featured reviews",
      () => prisma.review.findMany({
        where: { isFeatured: true, status: "approved" },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, authorName: true, rating: true, content: true },
      }),
      [],
    ),
  ]);

return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      <div className="flex flex-col gap-4 bg-[#fcf5e8]">
        <Hero />
        <h1 className="sr-only">MM Laptop Center – Premium Laptops, Gaming Gear & Tech Accessories</h1>
       <HomeProducts categories={categories} products={featuredProducts} collections={featuredCollections} />

      {/* Why Choose Us Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[#0a0a0a] sm:text-4xl">
            Why Choose MM Laptop Center
          </h2>
          <p className="mt-4 text-lg text-[#5A5E55]">
            Your trusted destination for genuine laptops and tech accessories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white border-[#d8a928]/30 hover:border-[#f6a45d]/60 transition-colors duration-300">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-[#fcf5e8] flex items-center justify-center text-[#f6a45d]">
                <Gamepad2 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0a0a0a]">Gaming Laptops</h3>
              <ul className="space-y-2 text-[#5A5E55] list-disc pl-4">
                <li>Latest NVIDIA RTX & AMD GPUs</li>
                <li>High-refresh rate displays up to 165Hz</li>
                <li>Advanced cooling for extended sessions</li>
                <li>RGB keyboards and premium audio</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#d8a928]/30 hover:border-[#f6a45d]/60 transition-colors duration-300">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-[#fcf5e8] flex items-center justify-center text-[#f6a45d]">
                <Briefcase className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0a0a0a]">Business Laptops</h3>
              <ul className="space-y-2 text-[#5A5E55] list-disc pl-4">
                <li>Enterprise-grade security features</li>
                <li>All-day battery life for remote work</li>
                <li>Lightweight designs under 1.5kg</li>
                <li>Premium build with MIL-STD durability</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#d8a928]/30 hover:border-[#f6a45d]/60 transition-colors duration-300">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-[#fcf5e8] flex items-center justify-center text-[#f6a45d]">
                <Laptop className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0a0a0a]">Accessories & More</h3>
              <ul className="space-y-2 text-[#5A5E55] list-disc pl-4">
                <li>Monitors, keyboards, and mice</li>
                <li>Laptop bags and protective sleeves</li>
                <li>USB-C hubs and docking stations</li>
                <li>Genuine warranty on all products</li>
              </ul>
            </CardContent>
          </Card>
        </div>
       </section>

       {/* Essence */}
      <EssenceSection initialData={essenceSection ? {
        title: essenceSection.title,
        subtitle: essenceSection.subtitle,
        content: essenceSection.content as any,
      } : undefined} />

      {/* Reviews */}
      {featuredReviews && featuredReviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-[#0a0a0a] sm:text-4xl">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-6 border border-[#d8a928]/20">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-lg ${i < review.rating ? "text-[#d8a928]" : "text-gray-200"}`}>★</span>
                  ))}
                </div>
                <p className="text-[#5A5E55] mb-4">"{review.content}"</p>
                <p className="font-semibold text-[#0a0a0a]">{review.authorName}</p>
              </div>
            ))}
          </div>
        </section>
      )}

       {/* Blog */}
       <BlogSection articles={featuredBlogs.map(b => ({
         id: b.id,
         title: b.title,
         handle: b.slug,
         publishedAt: b.publishedAt?.toISOString() ?? "",
         content: b.content ?? "",
         image: b.featuredImage ? { url: b.featuredImage } : null,
         blogHandle: "news"
       }))} />

       {/* Testimonials */}
       <Testimonials />
    </div>
    </>
  );
}

