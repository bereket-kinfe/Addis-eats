"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const formatPrice = (price) => `${Number(price).toLocaleString()} ETB`;

export default function CartPage() {
  const router = useRouter();
  const { items, total, removeItem, updateQuantity } = useCart();

  const handleProceedToCheckout = () => {
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Your Shopping Cart</h1>
        <p className="mb-6 text-gray-600">Your cart is empty. Add a few dishes from the menu.</p>
        <button
          onClick={() => router.push("/menu")}
          className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
        >
          Browse Menu
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Your Shopping Cart</h1>
      <div className="mb-6 divide-y border-y border-slate-200 py-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 py-3">
            <div>
              <p className="font-medium text-slate-900">{item.name}</p>
              <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="h-8 w-8 rounded border border-slate-300"
              >
                -
              </button>
              <span className="min-w-6 text-center text-slate-800">{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="h-8 w-8 rounded border border-slate-300"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="ml-2 text-sm font-medium text-red-600"
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
        onClick={handleProceedToCheckout}
        className="w-full rounded-lg bg-green-600 py-3 font-bold text-white transition-colors hover:bg-green-700"
      >
        Proceed to Checkout
      </button>
    </section>
  );
}