import type { Metadata } from "next";
import { Cart } from "./cart";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your shopping cart",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#fcf5e8]">
      <Cart />
    </main>
  );
}

