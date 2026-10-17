"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { placeOrder } from "./actions";

const formatPrice = (price) => `${Number(price).toLocaleString()} ETB`;
const deliveryAreas = ["Bole", "Kazanchis", "Megenagna", "CMC", "Piazza"];

export default function CheckoutClient({ initialName }) {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [error, setError] = useState("");
  const [deliveryDetails, setDeliveryDetails] = useState({ name: initialName || "", phone: "", address: "", area: "" });
  const [isPending, startTransition] = useTransition();
  const submissionLock = useRef(false);
  const idempotencyKey = useRef(null);

  if (items.length === 0) {
    return (
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-xl"><section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="mb-6 text-gray-600">Your cart is empty. Add dishes before checking out.</p>
        <button
          type="button"
          onClick={() => router.push("/menu")}
          className="min-h-11 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
        >
          Go to Menu
        </button>
      </section></main>
    );
  }

  const handlePlaceOrder = (event) => {
    event.preventDefault();
    if (submissionLock.current) return;
    submissionLock.current = true;
    idempotencyKey.current ??= crypto.randomUUID();
    setError("");
    startTransition(async () => {
      try {
        const result = await placeOrder(
          items.map(({ id, quantity }) => ({ id, quantity })),
          idempotencyKey.current,
          deliveryDetails,
        );
        if (result.error) {
          submissionLock.current = false;
          setError(result.error);
          return;
        }

        clearCart();
        router.push(`/orders/${result.orderId}`);
      } catch {
        submissionLock.current = false;
        setError("We could not confirm your order. Try again; we will avoid creating a duplicate.");
      }
    });
  };

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-xl"><section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
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
      <form onSubmit={handlePlaceOrder} className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Delivery details</h2>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">Recipient name</span>
          <input name="deliveryName" autoComplete="name" required minLength={2} maxLength={80} value={deliveryDetails.name}
            onChange={(event) => setDeliveryDetails({ ...deliveryDetails, name: event.target.value })}
            className="min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">Phone number</span>
          <input name="phone" type="tel" autoComplete="tel" inputMode="tel" required minLength={7} maxLength={20}
            title="Enter a phone number using digits, spaces, +, or hyphens."
            value={deliveryDetails.phone} onChange={(event) => setDeliveryDetails({ ...deliveryDetails, phone: event.target.value })}
            className="min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">Delivery area</span>
          <select name="area" required value={deliveryDetails.area} onChange={(event) => setDeliveryDetails({ ...deliveryDetails, area: event.target.value })}
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200">
            <option value="" disabled>Select an area</option>
            {deliveryAreas.map((area) => <option key={area} value={area}>{area}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">Street address and delivery instructions</span>
          <textarea name="address" autoComplete="street-address" required minLength={8} maxLength={240} rows={3}
            value={deliveryDetails.address} onChange={(event) => setDeliveryDetails({ ...deliveryDetails, address: event.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200" />
        </label>
        {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="min-h-12 w-full rounded-lg bg-green-600 py-3 font-bold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </section></main>
  );
}
