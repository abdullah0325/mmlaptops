import { Metadata } from "next";
import { CollectionList } from "./collection-list";
import { getCollectionList } from "./service";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Collections | MM Laptop Center - Gaming Gear, Laptops Lamps & Herbal Products",
  description:
    "Explore all MM Laptop Center collections including Gaming Gear, Premium laptops lamps, edible salt, bath salts, wellness products, and decorative laptops pieces.",
  keywords: [
    "MM Laptop Center collections",
    "gaming gear collection",
    "premium laptops products",
    "laptops lamps",
    "salt lamp collection",
    "edible laptops",
    "bath salts",
    "salt decoration",
    "decorative laptops",
    "natural wellness products",
    "Pakistan laptops supplier",
  ],
  alternates: {
    canonical: "https://mmlaptopcenter.com/collections",
  },
  openGraph: {
    title: "Collections | MM Laptop Center - Gaming Gear, Laptops & Wellness",
    description:
      "Discover MM Laptop Center's complete range of Gaming Gear, Premium laptops collections for health, home, and lifestyle.",
    url: "https://mmlaptopcenter.com/collections",
    siteName: "MM Laptop Center",
    type: "website",
    images: [
      {
        url: "https://mmlaptopcenter.com/og/collections.jpg",
        width: 1200,
        height: 630,
        alt: "MM Laptop Center Premium Laptops Collections",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Collections | MM Laptop Center - Laptops & Gaming Gear",
    description:
      "Browse all MM Laptop Center collections: Gaming Gear, Premium laptops, salt lamps, and wellness products.",
    images: ["https://mmlaptopcenter.com/og/collections.jpg"],
  },
};

export default async function Page() {
  let data: Awaited<ReturnType<typeof getCollectionList>> = {
    pageInfo: { hasNextPage: false },
    edges: [],
  };

  try {
    data = await getCollectionList();
  } catch (error) {
    console.error("Failed to load collections:", error);
  }

  return (
    <div className="bg-background">
      {/* Intro Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Our Collections
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Explore our carefully curated collections of authentic Premium
            laptops products. From natural wellness essentials to beautifully
            crafted salt lamps and edible salts, each collection reflects our
            commitment to purity, quality, and sustainable sourcing.
          </p>
        </div>
      </section>

      {/* Collections List */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <CollectionList data={data} />
      </section>

      {/* SEO Content Section */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="max-w-4xl space-y-4 text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-semibold text-foreground">
            Authentic Premium Laptops Collections
          </h2>
          <p>
            MM Laptop Center sources premium Premium laptops directly from the
            ancient salt mines of Pakistan. Our collections include edible salt
            for cooking, wellness and spa products, decorative salt lamps, and
            lifestyle accessories designed to support a natural and balanced
            way of living.
          </p>
          <p>
            Whether you are looking for bulk supply, retail products, or
            wellness solutions, our collections are crafted to meet
            international quality standards while preserving the natural
            mineral richness of Premium salt.
          </p>
        </div>
      </section>
    </div>
  );
}

