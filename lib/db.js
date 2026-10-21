import { randomUUID } from "node:crypto";
import { open, readFile, rename, unlink, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getDish } from "./dishes";
import { getCurrentOrderStatus } from "./order-status";

export { getDish, getDishes } from "./dishes";

const dataDirectory = path.join(process.cwd(), ".data");
const ordersFile = path.join(dataDirectory, "orders.json");
const ordersLock = path.join(dataDirectory, "orders.lock");

async function readOrders() {
  try {
    const content = await readFile(ordersFile, "utf8");
    const orders = JSON.parse(content);
    if (!Array.isArray(orders)) {
      throw new Error("The local order store must contain a JSON array.");
    }
    return orders;
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeOrders(orders) {
  const temporaryFile = path.join(dataDirectory, `${randomUUID()}.tmp`);
  try {
    await writeFile(temporaryFile, JSON.stringify(orders), "utf8");
    await rename(temporaryFile, ordersFile);
  } finally {
    try {
      await unlink(temporaryFile);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
}

async function withOrderLock(operation) {
  await mkdir(dataDirectory, { recursive: true });
  let lock;

  for (let attempt = 0; attempt < 1000; attempt += 1) {
    try {
      lock = await open(ordersLock, "wx");
      break;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      if (attempt === 999) {
        throw new Error("Timed out waiting for the local order store lock.");
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  try {
    const orders = await readOrders();
    const result = await operation(orders);
    await writeOrders(orders);
    return result;
  } finally {
    await lock.close();
    await unlink(ordersLock);
  }
}

const ORDER_AREAS = ["Bole", "Kazanchis", "Megenagna", "CMC", "Piazza"];

function deriveOrderArea(sessionId) {
  const seed = Array.from(sessionId || "").reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return ORDER_AREAS[seed % ORDER_AREAS.length];
}

function copyOrderWithCurrentStatus(order) {
  return {
    ...order,
    status: getCurrentOrderStatus(order),
    items: order.items.map((item) => ({ ...item })),
  };
}

export async function createOrderForSession(sessionId, items) {
  if (typeof sessionId !== "string" || !sessionId) {
    throw new Error("A verified session is required to create an order.");
  }

  return withOrderLock(async (orders) => {
    const order = {
      id: randomUUID(),
      sessionId,
      area: deriveOrderArea(sessionId),
      items: items.map((item) => ({ ...item })),
      status: "Order received",
      createdAt: new Date().toISOString(),
    };
    orders.push(order);
    return { ...order, items: order.items.map((item) => ({ ...item })) };
  });
}

export async function getAllOrders() {
  const orders = await readOrders();
  return orders.map(copyOrderWithCurrentStatus);
}

export async function getOrderForSession(orderId, sessionId) {
  if (typeof sessionId !== "string" || !sessionId) return null;
  const orders = await readOrders();
  const order = orders.find((item) => item.id === orderId && item.sessionId === sessionId);
  if (!order) return null;
  return copyOrderWithCurrentStatus(order);
}

export async function getOrdersForSession(sessionId) {
  if (typeof sessionId !== "string" || !sessionId) {
    throw new Error("A verified session is required to list orders.");
  }

  const orders = await readOrders();
  return orders
    .filter((order) => order.sessionId === sessionId)
    .map(copyOrderWithCurrentStatus);
}

export async function updateOrderStatusForSession(orderId, sessionId, status) {
  if (typeof sessionId !== "string" || !sessionId) return null;
  return withOrderLock(async (orders) => {
    const order = orders.find((item) => item.id === orderId && item.sessionId === sessionId);
    if (!order) return null;
    order.status = status;
    order.statusUpdatedAt = new Date().toISOString();
    return copyOrderWithCurrentStatus(order);
  });
}
