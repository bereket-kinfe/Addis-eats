"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const formatPrice = (price) => `${Number(price).toLocaleString()} ETB`;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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
    clearCart();
    router.push("/");
  };

  return (
    <section className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Checkout</h1>

      <div className="mb-6 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-gray-700">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full rounded-lg bg-green-600 py-3 font-bold text-white hover:bg-green-700"
      >
        Place Order
      </button>
    </section>
  );
}