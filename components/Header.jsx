import Link from "next/link";
import CartLink from "@/components/CartLink";

export default function Header() {
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

      <CartLink />
    </header>
  );
}
