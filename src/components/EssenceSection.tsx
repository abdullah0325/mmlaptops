"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface EssenceCard {
  title: string;
  description: string;
  image: string;
}

interface EssenceSectionProps {
  initialData?: {
    title?: string | null;
    subtitle?: string | null;
    content?: EssenceCard[];
  };
}

export default function EssenceSection({ initialData }: EssenceSectionProps) {
  const [data, setData] = useState<{
    title: string;
    subtitle: string;
    cards: EssenceCard[];
  }>({
    title: "Experience the Essence",
    subtitle: "Elevate Your Culinary & Wellness Rituals",
    cards: [
      {
        title: "Power Your Work",
        description: "Business laptops built for productivity and reliability.",
        image: "/graphics/about-one.png",
      },
      {
        title: "Dominate the Game",
        description: "High-refresh gaming laptops with the latest GPUs.",
        image: "/graphics/about-two.png",
      },
    ],
  });

  useEffect(() => {
    if (initialData && initialData.content && initialData.content.length > 0) {
      setData({
        title: initialData.title || "Experience the Essence",
        subtitle: initialData.subtitle || "Elevate Your Culinary & Wellness Rituals",
        cards: initialData.content,
      });
    }
  }, [initialData]);

  if (data.cards.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 font-sans text-gray-800">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-light mb-2">{data.title}</h2>
        <p className="text-gray-500 uppercase tracking-widest text-sm">
          {data.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-24">
        {data.cards.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-sm"
          >
            <div className="relative w-full h-[400px]">
              <Image
                src={item.image || "/graphics/essence-one.png"}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="p-8">
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex flex-col md:flex-row items-center">
        <div className="bg-[#C99688] text-white p-10 md:p-16 md:w-1/2 md:absolute left-0 z-10">
          <span className="uppercase tracking-tighter text-xs opacity-80 block mb-2">
            Where Performance Meets Reliability.
          </span>
          <h2 className="text-3xl md:text-4xl font-medium mb-6">
            Our Promise to You
          </h2>
          <p className="text-sm md:text-base leading-loose opacity-90">
            MM Laptop Center provides rigorously tested laptops with dependable warranty and after-sales support for a premium ownership experience.
          </p>
        </div>

        <div className="relative w-full md:w-2/3 ml-auto h-[500px]">
          <Image
            src="/logo/mmlaptop.png"
            alt="Our Promise"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        </div>
      </div>
    </section>
  );
}
