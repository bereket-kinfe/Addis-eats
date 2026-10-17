import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">404</p>
      <h1 className="mt-2 text-3xl font-black text-slate-900">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-slate-600">The page may have moved. Return to the menu to keep browsing.</p>
      <Link href="/menu" className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700">
        Browse the menu
      </Link>
    </main>
  );
}
