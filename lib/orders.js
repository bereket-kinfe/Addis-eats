import { getOrderForSession } from "./db";

export async function getStatus(orderId, sessionId) {
  if (!sessionId) return null;
  const order = await getOrderForSession(orderId, sessionId);
  if (!order) return null;
  return { state: order.status, isDelivered: order.status === "Delivered" };
}
