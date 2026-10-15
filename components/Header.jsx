"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CartLink from "@/components/CartLink";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/admin", label: "Admin" },
  { href: "/checkout", label: "Checkout" },
  { href: "/orders", label: "Orders" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <header className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="inline-flex shrink-0 items-center" aria-label="Addis Eats home">
          <Image
            src="/images/logo1.png"
            alt="Addis Eats"
            width={56}
            height={56}
            sizes="(min-width: 640px) 56px, 48px"
            priority
            className="h-12 w-12 object-contain sm:h-14 sm:w-14"
          />
        </Link>

        <div className="hidden items-center gap-3 text-sm font-semibold text-slate-700 sm:flex sm:gap-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="inline-flex min-h-11 items-center transition hover:text-red-600">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/account"
            className="hidden min-h-11 items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:inline-flex sm:shrink-0"
          >
            Account
          </Link>
          <CartLink />

          <button
            ref={menuButtonRef}
            type="button"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-50 sm:hidden"
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isMenuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav id="mobile-nav" className="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-3 sm:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="min-h-11 rounded-lg px-2 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-red-600"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/account"
            onClick={() => setIsMenuOpen(false)}
            className="min-h-11 rounded-lg border border-slate-200 px-2 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Account
          </Link>
        </nav>
      )}
    </header>
  );
}
