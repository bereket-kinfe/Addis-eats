"use server";

import { getDish, createOrderForSession } from "@/lib/db";
import { getSession } from "@/lib/session";

const deliveryAreas = new Set(["Bole", "Kazanchis", "Megenagna", "CMC", "Piazza"]);

export async function placeOrder(cartItems, idempotencyKey, deliveryDetails) {
  const session = await getSession();
  if (!session) {
    return { error: "Sign in to place an order." };
  }
  if (!Array.isArray(cartItems) || cartItems.length === 0 || cartItems.length > 50) {
    return { error: "Your cart is empty or invalid. Please refresh and try again." };
  }
  if (typeof idempotencyKey !== "string" || !/^[0-9a-f-]{36}$/i.test(idempotencyKey)) {
    return { error: "Your checkout session expired. Refresh the page and try again." };
  }
  if (!deliveryDetails || typeof deliveryDetails !== "object") {
    return { error: "Enter your delivery details before placing the order." };
  }

  const name = typeof deliveryDetails.name === "string" ? deliveryDetails.name.trim() : "";
  const phone = typeof deliveryDetails.phone === "string" ? deliveryDetails.phone.trim() : "";
  const address = typeof deliveryDetails.address === "string" ? deliveryDetails.address.trim() : "";
  const area = typeof deliveryDetails.area === "string" ? deliveryDetails.area : "";
  const phoneDigits = phone.replace(/\D/g, "");
  if (name.length < 2 || name.length > 80 || address.length < 8 || address.length > 240) {
    return { error: "Enter a recipient name and delivery address of the required length." };
  }
  if (!/^[+]?[0-9 -]{7,20}$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    return { error: "Enter a valid phone number with 7 to 15 digits." };
  }
  if (!deliveryAreas.has(area)) return { error: "Select one of the available delivery areas." };

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
    if (!dish || dish.available === false) {
      return { error: "A dish in your cart is no longer available." };
    }

    items.push({ id: dish.id, name: dish.name, price: dish.price, quantity: item.quantity });
  }

  const order = await createOrderForSession(session.sessionId, items, idempotencyKey, { name, phone, address, area });
  return { orderId: order.id };
}
