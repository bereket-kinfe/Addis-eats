import Link from "next/link";

export default function EmptyOrders() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-2xl rounded-2xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-slate-200 sm:px-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Order history</p>
      <h1 className="mt-3 text-3xl font-black text-slate-900">No orders yet</h1>
      <p className="mx-auto mt-3 max-w-lg text-slate-600">
        Once you place an order, you can track its status and review its details here.
        Browse the menu to find something delicious to get started.
      </p>
      <Link
        href="/menu"
        className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
      >
        Start ordering
      </Link>
    </main>
  );
}
