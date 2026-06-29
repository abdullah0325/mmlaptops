import React from "react";
import Image from "next/image";

const PureOfferings = () => {
  const offerings = [
    {
      title: "High Performance",
      description:
        "Powerful processors and discrete GPUs for gaming and heavy workloads.",
      image: "https://placehold.co/600x400?text=Gaming+Laptops",
    },
    {
      title: "Long Battery Life",
      description:
        "Optimized efficiency for all-day productivity on the move.",
      image: "https://placehold.co/600x400?text=Ultrabooks",
    },
    {
      title: "Lightweight Design",
      description:
        "Slim and portable laptops ideal for business travel and commuting.",
      image: "https://placehold.co/600x400?text=Business+Laptops",
    },
    {
      title: "Reliable Support",
      description:
        "Warranty-backed products and responsive customer service for peace of mind.",
      image: "https://placehold.co/600x400?text=Warranty+Support",
    },
    {
      title: "Accessories",
      description:
        "Top-quality mice, keyboards, bags and monitors to complete your setup.",
      image: "https://placehold.co/600x400?text=Accessories",
    },
    {
      title: "Affordable Options",
      description:
        "Budget-friendly machines that don't compromise on essential performance.",
      image: "https://placehold.co/600x400?text=Budget+Laptops",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4  font-sans text-[#0a0a0a] bg-[#fcf5e8]">
      {/* Header Section */}
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-[#0a0a0a]">
        Discover Our Pure Offerings
      </h2>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {offerings.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center bg-white rounded-lg overflow-hidden shadow-sm border border-[#d8a928]/30 p-6"
          >
            <div className="relative w-full h-48 mb-6">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover rounded-sm"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h3 className="text-lg font-bold mb-3 uppercase tracking-wide text-[#0a0a0a]">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-[#5A5E55] px-2">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <hr className="border-[#d8a928]/30 mb-20" />

      {/* Hero Content Section */}
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="relative w-full md:w-1/2 h-[400px]">
          <Image
            src="https://placehold.co/1400x600?text=MM+Laptop+Center"
            alt="MM Laptop Center Hero"
            fill
            className="object-cover rounded-lg shadow-md"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-4xl font-bold mb-6 text-[#0a0a0a]">
            MM Laptop Center
          </h2>
          <div className="space-y-4 text-[#5A5E55] leading-relaxed">
            <p>
              Your Trusted Tech Destination for premium laptops, gaming rigs, and essential accessories. Explore curated picks for productivity and play.
            </p>
            <p className="pt-4">
              <span className="font-bold text-[#0a0a0a]">Tip:</span> Filter by category to find the perfect laptop for work, gaming, or travel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PureOfferings;
