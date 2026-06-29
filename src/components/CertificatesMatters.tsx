import Link from "next/link";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const CertificatesMatters = () => {
  return (
    <section
      className={`${montserrat.className} flex flex-col items-center justify-center px-4 py-16 bg-[#fcf5e8] text-center`}
    >
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-semibold text-[#0a0a0a] mb-6">
        Why These Certifications Matter
      </h2>

      {/* Description Text */}
      <div className="max-w-3xl text-[#5A5E55] leading-relaxed space-y-4 mb-10">
        <p className="text-lg">
          These certifications show our commitment to quality. They ensure that
          you receive genuine laptops and accessories backed by manufacturer
          warranty. When you choose MM Laptop Center, you can trust that you
          are getting authentic tech products.
        </p>
        <p className="text-lg">
          Explore our certified laptop collection and see the difference
          quality makes.
        </p>
      </div>

      {/* Button Container */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/certificates"
          className="px-10 py-3 bg-[#f6a45d] text-[#fcf5e8] font-medium rounded-md hover:bg-[#d8861f] transition-colors min-w-[160px]"
        >
          Read More
        </Link>
        <Link
          href="/products"
          className="px-10 py-3 bg-[#f6a45d] text-[#fcf5e8] font-medium rounded-md hover:bg-[#d8861f] transition-colors min-w-[160px]"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
};

export default CertificatesMatters;

