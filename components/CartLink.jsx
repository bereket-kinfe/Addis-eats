"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartLink() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 sm:shrink-0">
      Cart
      {itemCount > 0 && (
        <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
