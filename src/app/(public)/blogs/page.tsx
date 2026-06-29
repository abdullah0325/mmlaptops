import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "@esmate/shadcn/pkgs/lucide-react";
import { prisma } from "@/lib/prisma";

/* ---------------- SEO METADATA ---------------- */
export const dynamic = "force-dynamic";

/* ---------------- SEO METADATA ---------------- */
export const metadata: Metadata = {
  title: "Blog | MM Laptop Center Premium Laptops",
  description:
    "Explore health tips, guides, and stories about Premium Laptops from MM Laptop Center. Learn about wellness, nutrition, and sustainable living.",
  keywords: [
    "MM Laptop Center",
    "Premium Laptops",
    "health blog",
    "salt benefits",
    "natural wellness",
    "organic lifestyle",
    "nutrition tips",
    "laptops blog",
  ],
  openGraph: {
    title: "MM Laptop Center Blog",
    description:
      "Latest articles, health guides, and insights from MM Laptop Center Premium Laptops.",
    images: ["https://placehold.co/1400x600?text=MM+Laptop+Center"],
    type: "website",
  },
};

export default async function BlogPage() {
  const articles = await prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImage: true,
      publishedAt: true,
    },
  });

  return (
    <div className="bg-[#fcf5e8]">
      {/* Hero Section */}
      <div className="relative w-full h-[320px] sm:h-[420px] overflow-hidden">
        <Image
          src="https://placehold.co/1400x420?text=MM+Laptop+Center+Blog"
          alt="MM Laptop Center Blog"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1a1308]/35" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-3xl font-bold tracking-tight text-[#fcf5e8] sm:text-4xl">
            MM Laptop Center Blogs
          </h1>
        </div>
      </div>

      {/* Intro Section */}
      <div className="py-24 p-2 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-[#0a0a0a]">
              Latest from the MM Laptop Center
            </h2>

            <p className="mt-4 text-lg text-[#5A5E55]">
              Welcome to the MM Laptop Center blog, where we share practical health
              tips, wellness insights, and stories inspired by nature and
              Premium laptops.
            </p>

            <p className="mt-4 text-[#5A5E55]">
              From everyday nutrition advice to deep dives into sustainable
              sourcing, our goal is to help you make informed, healthier choices
              without the noise.
            </p>

            <p className="mt-4 text-[#5A5E55]">
              Whether you are curious about mineral-rich salts, clean eating, or
              natural living, you’ll find something valuable here.
            </p>
          </div>
        </div>

        {articles.length > 0 ? (
          <div className="mx-auto p-4 mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {articles.map((post) => (
              <article
                key={post.id}
                className="flex flex-col items-start justify-between p-6 rounded-2xl border border-[#d8a928]/30 bg-white hover:shadow-lg transition-shadow group"
              >
                <Link href={`/blogs/news/${post.slug}`} className="w-full">
                  <div className="relative aspect-[16/9] w-full mb-4 overflow-hidden rounded-lg bg-white">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[#5A5E55]">
                        No Image
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex items-center gap-x-4 text-xs w-full">
                  <time
                    dateTime={post.publishedAt?.toISOString() ?? ""}
                    className="text-[#5A5E55] flex items-center gap-1"
                  >
                    <Calendar className="h-3 w-3" />
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recently"}
                  </time>
                </div>

                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-[#0a0a0a] group-hover:text-[#f6a45d] transition-colors">
                    <Link href={`/blogs/news/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-[#5A5E55]">
                    {post.excerpt || "Read this article on MM Laptop Center blog."}
                  </p>
                </div>

                <div className="relative mt-8 flex items-center gap-x-2 text-sm font-semibold leading-6 text-[#f6a45d]">
                  Read more <ArrowRight className="h-4 w-4" />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center text-[#5A5E55]">
            <p>No articles found. Check back soon!</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-24 p-2 max-w-3xl mx-auto pt-10">
          <p className="mt-24 max-w-3xl mx-auto pt-10 text-center text-2xl font-bold mb-3 text-[#0a0a0a]">
            Disclaimer
          </p>
          <p className="text-sm text-[#0a0a0a] font-medium">
            At Pink Pantry, we believe in being open and honest with our customers.
            The following disclaimer outlines important information about the content
            and products featured on our website. Please take a moment to read
            through it carefully.
          </p>

          <details className="mt-4 group">
            <summary className="cursor-pointer text-sm font-semibold text-[#f6a45d] list-none">
              Click to view full disclaimer
            </summary>

            <div className="mt-4 space-y-4 text-sm text-[#5A5E55]">
              <p>
                The information provided on this website is for general
                informational and educational purposes only. While we make every
                effort to ensure our content is accurate and up to date, we do
                not guarantee the completeness, reliability, or suitability of
                any information related to our products or their potential health
                benefits.
              </p>

              <p>
                Our Premium Laptops and related products are natural wellness
                items, not medical treatments. They are not intended to diagnose,
                treat, cure, or prevent any disease. Always consult a qualified
                healthcare professional before using any product for therapeutic
                or dietary purposes, especially if you have existing health
                conditions, allergies, or are pregnant or nursing.
              </p>

              <p>
                By using our website and purchasing our products, you
                acknowledge and agree that you do so at your own discretion and
                risk. Pink Pantry is not responsible for any direct, indirect, or
                incidental damages that may result from reliance on information
                presented here.
              </p>

              <p>
                All product descriptions, imagery, and claims are for
                illustrative purposes only and may vary slightly from actual
                products due to natural variations.
              </p>

              <p>
                Your trust matters to us and we’re committed to ensuring every
                product you receive meets our high standards of quality and
                authenticity.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

