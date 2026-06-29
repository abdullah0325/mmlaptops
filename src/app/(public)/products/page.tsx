import { Metadata } from "next";
import { ProductList } from "./product-list";
import { getCategoriesForFilters, getProductList, getProductsAdvanced, getAllProductsForFilter } from "./service";
import { ProductsFiltered } from "@/components/products-filtered";

export const revalidate = 60;

/* ---------------- SEO METADATA ---------------- */

export const metadata: Metadata = {
  title: "Shop Laptops – MM Laptop Center",
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
  ],

  openGraph: {
    title: "Shop Laptops – MM Laptop Center",
    description:
      "Browse gaming laptops, business ultrabooks, accessories and more at MM Laptop Center.",
    url: "https://mmlaptopcenter.com/products",
    siteName: "MM Laptop Center",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Shop Laptops – MM Laptop Center",
    description:
      "Discover premium laptops, gaming gear and tech accessories at MM Laptop Center.",
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://mmlaptopcenter.com/products",
  },
};

/* ---------------- PAGE ---------------- */

export default async function Page({
  searchParams,
}: {
  searchParams?: { q?: string; category?: string; subcategory?: string; tag?: string; min?: string; max?: string };
}) {
  const initialCategorySlug = (searchParams?.category ?? "").trim();

  let categories: Array<{ id: string; name: string; slug: string; subcategories: Array<{ id: string; name: string; slug: string; parentId: string | null }> }> = [];
  let allProducts: Array<{ id: string; handle: string; title: string; price: number; compareAtPrice: number | null; featuredImage: string | null; images: any; tags: any; categoryId: string | null; subcategoryId: string | null; isFeatured: boolean }> = [];

  try {
    [categories, allProducts] = await Promise.all([
      getCategoriesForFilters(),
      getAllProductsForFilter(),
    ]);
  } catch (error) {
    console.error("Failed to load products:", error);
  }

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <ProductsFiltered 
          categories={categories.map(c => ({ ...c, image: null }))}
          initialProducts={allProducts}
          initialCategorySlug={initialCategorySlug}
        />

        {/* SEO Content Section */}
        <section className="mt-16 border-t border-[#d8a928]/20 pt-12">
          <h2 className="text-2xl font-bold text-[#0a0a0a]">
            Premium Laptops, Gaming Gear & Natural Wellness Products
          </h2>

          <p className="mt-4 max-w-4xl text-[#5A5E55]">
            MM Laptop Center specializes in authentic Premium laptops products,
            responsibly sourced and minimally processed to retain their natural
            mineral composition. Our range includes edible laptops for cooking,
            bath and wellness salt, decorative and functional laptops lamps, and
            premium-grade Gaming Gear known for its traditional use in vitality and
            strength.
          </p>

          <p className="mt-4 max-w-4xl text-[#5A5E55]">
            Each product is selected with quality, purity, and sustainability in
            mind. We work closely with trusted suppliers to ensure our customers
            receive genuine Premium products suitable for daily use, wellness
            routines, and natural living.
          </p>
        </section>
      </div>
    </main>
  );
}

