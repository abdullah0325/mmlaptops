"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useForm } from "@formspree/react";
import {
  Phone,
  Mail,
  MapPin,
  Truck,
  CheckCircle,
  Package,
} from "@esmate/shadcn/pkgs/lucide-react";

import { Button } from "@esmate/shadcn/components/ui/button";
import { Input } from "@esmate/shadcn/components/ui/input";
import { Textarea } from "@esmate/shadcn/components/ui/textarea";
import { Card, CardContent } from "@esmate/shadcn/components/ui/card";
import { lead } from "@/lib/pixel";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "";
const EMAIL = process.env.NEXT_PUBLIC_SALES_EMAIL ?? "";
const EMAIL_ALT = process.env.NEXT_PUBLIC_SALES_EMAIL_ALT ?? "";
const ADDRESS_1 = process.env.NEXT_PUBLIC_OFFICE_ADDRESS_LINE1 ?? "";
const ADDRESS_2 = process.env.NEXT_PUBLIC_OFFICE_ADDRESS_LINE2 ?? "";

export default function BulkOrderPage() {
  const [state, handleSubmit] = FORMSPREE_ID
    ? useForm(FORMSPREE_ID)
    : [null, (_e: any) => {}];

  useEffect(() => {
    if (state && (state as any).succeeded) {
      lead();
    }
  }, [state]);

  return (
    <div className="bg-[#fcf5e8]">
      {/* Hero */}
      <section className="bg-white/70 py-28">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-4xl font-bold sm:text-6xl text-[#0a0a0a]">
            Bulk & Wholesale Orders
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#5A5E55]">
            Factory-direct Premium Laptops supplies for importers, retailers,
            and distributors worldwide.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg bg-[#f6a45d] px-6 py-3 text-sm font-semibold text-[#fcf5e8] hover:bg-[#d8861f]"
            >
              <Phone className="h-4 w-4" />
              WhatsApp Sales
            </Link>

            <Link
              href="#contact"
              className="inline-flex items-center rounded-lg border border-[#d8a928]/30 bg-white px-6 py-3 text-sm font-semibold hover:bg-[#fcf5e8]/70 text-[#0a0a0a]"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-sm font-semibold text-[#f6a45d]">
              Why Work With Us
            </h2>
            <p className="mt-2 text-3xl font-bold sm:text-4xl text-[#0a0a0a]">
              Built for Serious Buyers
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            <Feature
              icon={<CheckCircle className="h-6 w-6 text-[#f6a45d]" />}
              title="Direct Manufacturer"
              desc="In-house mining, processing, and export. No traders, no inflated margins."
            />
            <Feature
              icon={<Truck className="h-6 w-6 text-[#f6a45d]" />}
              title="Worldwide Logistics"
              desc="FOB, CIF, and DDP options via sea or air freight."
            />
            <Feature
              icon={<Package className="h-6 w-6 text-[#f6a45d]" />}
              title="Private Label Ready"
              desc="Custom packaging, branding, and compliance support."
            />
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="bg-white/70 py-28">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl text-[#0a0a0a]">
            Bulk Product Range
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <CatalogItem
              title="Edible Salt"
              desc="Food-grade fine to coarse salt in 25kg and 50kg export bags."
            />
            <CatalogItem
              title="Salt Lamps"
              desc="Natural and crafted shapes packed in export-grade cartons."
            />
            <CatalogItem
              title="Animal Lick Salt"
              desc="High-mineral blocks for livestock and farms."
            />
            <CatalogItem
              title="Spa & Wellness"
              desc="Bath salts, chunks, and massage stones."
            />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl text-[#0a0a0a]">
              Request a Quote
            </h2>
            <p className="mt-3 text-lg text-[#5A5E55]">
              Share your requirements. Our export team will respond within 24 hours.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-10 lg:grid-cols-2">
            {/* Form */}
            <Card className="rounded-2xl border border-[#d8a928]/30 bg-white">
              <CardContent className="p-8">
                {state && (state as any).succeeded ? (
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-[#0a0a0a]">
                      Inquiry Received
                    </h3>
                    <p className="mt-2 text-[#5A5E55]">
                      Our team will contact you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <Input name="company" placeholder="Company Name" required />
                    <Input name="name" placeholder="Your Name" required />
                    <Input
                      type="email"
                      name="email"
                      placeholder="Business Email"
                      required
                    />
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Phone / WhatsApp"
                    />
                    <Textarea
                      name="message"
                      rows={4}
                      placeholder="Products, quantities, destination country, packaging needs"
                      required
                    />
                    <Button
                      type="submit"
                      className="w-full bg-[#f6a45d] hover:bg-[#d8861f] text-[#fcf5e8]"
                       disabled={state ? (state as any).submitting : false}
                    >
                      {(state && (state as any).submitting) ? "Sending..." : "Submit Request"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <ContactCard
                icon={<Phone className="h-6 w-6 text-[#f6a45d]" />}
                title="WhatsApp / Phone"
                lines={[`+${WHATSAPP}`]}
              />
              <ContactCard
                icon={<Mail className="h-6 w-6 text-[#f6a45d]" />}
                title="Email"
                lines={[EMAIL, EMAIL_ALT]}
              />
              <ContactCard
                icon={<MapPin className="h-6 w-6 text-[#f6a45d]" />}
                title="Head Office"
                lines={[ADDRESS_1, ADDRESS_2]}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Components */

function Feature({ icon, title, desc }: any) {
  return (
    <div className="rounded-2xl border border-[#d8a928]/30 bg-white p-8 transition hover:bg-[#fcf5e8]/60">
      <div className="mb-4 flex items-center gap-3">
        {icon}
        <h3 className="text-lg font-semibold text-[#0a0a0a]">{title}</h3>
      </div>
      <p className="text-[#5A5E55]">{desc}</p>
    </div>
  );
}

function CatalogItem({ title, desc }: any) {
  return (
    <div className="rounded-xl border border-[#d8a928]/30 bg-white p-6 transition hover:bg-[#fcf5e8]/60">
      <h3 className="mb-2 text-lg font-semibold text-[#0a0a0a]">{title}</h3>
      <p className="text-sm text-[#5A5E55]">{desc}</p>
    </div>
  );
}

function ContactCard({ icon, title, lines }: any) {
  return (
    <div className="rounded-2xl border border-[#d8a928]/30 bg-white p-8 text-center">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold text-[#0a0a0a]">{title}</h3>
      {lines.map((line: string, i: number) => (
        <p key={i} className="mt-1 text-[#5A5E55]">
          {line}
        </p>
      ))}
    </div>
  );
}

