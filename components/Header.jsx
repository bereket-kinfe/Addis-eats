"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <Link href="/" className="text-lg font-black text-red-600">Addis Eats</Link>
        <nav className="flex items-center gap-3 text-sm font-semibold text-slate-700 sm:gap-4">
          <Link href="/" className="transition hover:text-red-600">Home</Link>
          <Link href="/menu" className="transition hover:text-red-600">Menu</Link>
          <Link href="/checkout" className="transition hover:text-red-600">Checkout</Link>
          <Link href="/account" className="transition hover:text-red-600">Account</Link>
        </nav>
      </div>

      <Link href="/cart" className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 sm:shrink-0">
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
