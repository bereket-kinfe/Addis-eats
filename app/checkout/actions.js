"use server";

import { getDish, createOrderForSession } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function placeOrder(cartItems) {
  const session = await getSession();
  if (!session) {
    return { error: "Sign in to place an order." };
  }
  if (!Array.isArray(cartItems) || cartItems.length === 0 || cartItems.length > 50) {
    return { error: "Your cart is empty or invalid. Please refresh and try again." };
  }

  const items = [];
  const seenDishIds = new Set();
  for (const item of cartItems) {
    if (
      !item ||
      !Number.isSafeInteger(item.id) ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 50
    ) {
      return { error: "Your cart contains an invalid item. Please refresh and try again." };
    }
    if (seenDishIds.has(item.id)) {
      return { error: "Your cart contains duplicate dishes. Please refresh and try again." };
    }
    seenDishIds.add(item.id);

    const dish = await getDish(item.id);
    if (!dish) {
      return { error: "A dish in your cart is no longer available." };
    }

    items.push({ id: dish.id, name: dish.name, price: dish.price, quantity: item.quantity });
  }

  const order = await createOrderForSession(session.sessionId, items);
  return { orderId: order.id };
}
