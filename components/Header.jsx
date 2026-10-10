"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-lg font-black text-red-600">Addis Eats</Link>
        <nav className="flex items-center gap-4 text-sm font-semibold text-slate-700">
          <Link href="/" className="transition hover:text-red-600">Home</Link>
          <Link href="/menu" className="transition hover:text-red-600">Menu</Link>
          <Link href="/checkout" className="transition hover:text-red-600">Checkout</Link>
        </nav>
      </div>

      <Link href="/cart" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
        Cart
        {itemCount > 0 && (
          <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
            {itemCount}
          </span>
        )}
      </Link>
    </header>
  );
}
