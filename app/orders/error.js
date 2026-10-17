"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function OrdersError({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
        <main id="main-content" tabIndex={-1} className="mx-auto max-w-2xl rounded-2xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-red-200 sm:px-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Order history</p>
      <h1 className="mt-3 text-3xl font-black text-slate-900">We couldn&apos;t load your orders</h1>
      <p className="mt-3 text-slate-600">
        Something went wrong while retrieving your order history. Try again, or return to the menu.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="min-h-12 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
        >
          Try again
        </button>
        <Link
          href="/menu"
          className="inline-flex min-h-12 items-center rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to menu
        </Link>
      </div>
    </main>
  );
}
