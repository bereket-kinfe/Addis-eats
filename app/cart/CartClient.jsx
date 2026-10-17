"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useCart } from "@/context/CartContext";

const formatPrice = (price) => `${Number(price).toLocaleString()} ETB`;

export default function CartClient() {
  const router = useRouter();
  const { items, total, removeItem, updateQuantity } = useCart();
  const removeButtonRefs = useRef(new Map());
  const browseMenuRef = useRef(null);

  const handleProceedToCheckout = () => {
    router.push("/checkout");
  };

  const handleRemoveItem = (itemId) => {
    const index = items.findIndex((item) => item.id === itemId);
    const nextFocusId = items[index + 1]?.id ?? items[index - 1]?.id;
    removeItem(itemId);
    requestAnimationFrame(() => {
      if (nextFocusId) removeButtonRefs.current.get(nextFocusId)?.focus();
      else browseMenuRef.current?.focus();
    });
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity === 1) handleRemoveItem(item.id);
    else updateQuantity(item.id, item.quantity - 1);
  };

  if (items.length === 0) {
    return (
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-xl"><section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Your Shopping Cart</h1>
        <p className="mb-6 text-gray-600">Your cart is empty. Add a few dishes from the menu.</p>
        <button
          type="button"
          ref={browseMenuRef}
          onClick={() => router.push("/menu")}
          className="min-h-11 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
        >
          Browse Menu
        </button>
      </section></main>
    );
  }

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-xl"><section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Your Shopping Cart</h1>
      <div className="mb-6 divide-y border-y border-slate-200 py-4">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-slate-900">{item.name}</p>
              <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                aria-label={`Decrease quantity of ${item.name}`}
                onClick={() => handleDecreaseQuantity(item)}
                className="h-11 w-11 rounded border border-slate-300"
              >
                -
              </button>
              <span className="min-w-6 text-center text-slate-800" aria-hidden="true">{item.quantity}</span>
              <span className="sr-only" aria-live="polite">{item.name}: quantity {item.quantity}.</span>
              <button
                type="button"
                aria-label={`Increase quantity of ${item.name}`}
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="h-11 w-11 rounded border border-slate-300"
              >
                +
              </button>
              <button
                type="button"
                ref={(node) => {
                  if (node) removeButtonRefs.current.set(item.id, node);
                  else removeButtonRefs.current.delete(item.id);
                }}
                aria-label={`Remove ${item.name} from cart`}
                onClick={() => handleRemoveItem(item.id)}
                className="min-h-11 px-2 text-sm font-medium text-red-600 sm:ml-2"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between text-lg font-bold text-slate-900">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <button
        type="button"
        onClick={handleProceedToCheckout}
        className="min-h-12 w-full rounded-lg bg-green-600 py-3 font-bold text-white transition-colors hover:bg-green-700"
      >
        Proceed to Checkout
      </button>
    </section></main>
  );
}
