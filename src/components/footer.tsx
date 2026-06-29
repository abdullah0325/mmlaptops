import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "@esmate/shadcn/pkgs/lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#1a1308] border-t border-[#d8a928]/30">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand / Logo */}
          <div className="space-y-4">
            <Link href="/" className="-m-1.5 p-1.5 block">
              <span className="sr-only">MM Laptop Center</span>
              <Image
                src="/logo/mmlaptop.png"
                alt="MM Laptop Center"
                width={150}
                height={150}
                className="max-w-[150px] h-auto"
              />
            </Link>

            <p className="text-sm text-[#fcf5e8] leading-relaxed max-w-xs">
              Your Trusted Tech Destination — premium laptops, gaming gear, and accessories with genuine warranty support.
            </p>

            <div className="flex space-x-4">
              <Link href="#" className="text-[#fcf5e8] hover:text-[#d8a928] transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-[#fcf5e8] hover:text-[#d8a928] transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-[#fcf5e8] hover:text-[#d8a928] transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-[#fcf5e8]">Shop</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li>
                <Link href="/collections" className="text-sm text-[#fcf5e8]/85 hover:text-[#fcf5e8] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/gaming-laptops" className="text-sm text-[#fcf5e8]/85 hover:text-[#d8a928] transition-colors">
                  Gaming Laptops
                </Link>
              </li>
              <li>
                <Link href="/category/business-laptops" className="text-sm text-[#fcf5e8]/85 hover:text-[#d8a928] transition-colors">
                  Business Laptops
                </Link>
              </li>
              <li>
                <Link href="/category/accessories" className="text-sm text-[#fcf5e8]/85 hover:text-[#d8a928] transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/collections/hot-deals" className="text-sm text-[#fcf5e8]/85 hover:text-[#d8a928] transition-colors">
                  Hot Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-[#fcf5e8]">Customer Care</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li>
                <Link href="/admin/login" className="text-sm text-[#fcf5e8]/85 hover:text-[#d8a928] transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-[#fcf5e8]/85 hover:text-[#d8a928] transition-colors">
                  Contact Us
                </Link>
              </li>
               
              <li>
                <Link href="/about-us" className="text-sm text-[#fcf5e8]/85 hover:text-[#d8a928] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-[#fcf5e8]/85 hover:text-[#d8a928] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-[#fcf5e8]/85 hover:text-[#d8a928] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-[#fcf5e8]/85 hover:text-[#d8a928] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-sm text-[#fcf5e8]/85 hover:text-[#d8a928] transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-[#fcf5e8] mb-4">Contact Us</h3>
            <div className="space-y-4 text-sm text-[#fcf5e8]/85">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#d8a928] shrink-0" />
                <span>Swabi Topi Road, Pakistan</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#d8a928] shrink-0" />
                <span>+92 317 1707418</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#d8a928] shrink-0" />
                <span>info@mmlaptopcenter.com</span>
              </div>
            </div>
        </div>
        </div>

        <div className="mt-12 border-t border-[#d8a928]/30 pt-8">
          <p className="text-center text-xs leading-5 text-[#fcf5e8]/75">
            &copy; {new Date().getFullYear()} MM Laptop Center. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
