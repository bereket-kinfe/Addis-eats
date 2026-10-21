"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { placeOrder } from "./actions";

const formatPrice = (price) => `${Number(price).toLocaleString()} ETB`;

export default function CheckoutClient() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="mb-6 text-gray-600">Your cart is empty. Add dishes before checking out.</p>
        <button
          onClick={() => router.push("/menu")}
          className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
        >
          Go to Menu
        </button>
      </section>
    );
  }

  const handlePlaceOrder = () => {
    setError("");
    startTransition(async () => {
      const result = await placeOrder(items.map(({ id, quantity }) => ({ id, quantity })));
      if (result.error) {
        setError(result.error);
        return;
      }

      clearCart();
      router.push(`/orders/${result.orderId}`);
    });
  };

  return (
    <section className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Checkout</h1>
      <div className="mb-6 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-3 text-gray-700">
            <span className="min-w-0 break-words">{item.name} x {item.quantity}</span>
            <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="mb-6 flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      {error && <p role="alert" className="mb-4 text-sm font-medium text-red-700">{error}</p>}
      <button
        type="button"
        onClick={handlePlaceOrder}
        disabled={isPending}
        className="w-full rounded-lg bg-green-600 py-3 font-bold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Placing order..." : "Place Order"}
      </button>
    </section>
  );
}
