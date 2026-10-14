const ORDER_STAGES = [
  { status: "Order received", durationMs: 5_000 },
  { status: "Preparing", durationMs: 25_000 },
  { status: "Ready for pickup", durationMs: 15_000 },
  { status: "Picked up", durationMs: 10_000 },
  { status: "En route", durationMs: 30_000 },
  { status: "Arriving", durationMs: 10_000 },
  { status: "Delivered", durationMs: 0 },
];

export function getOrderStatusAt(createdAt, now = Date.now()) {
  const elapsedMs = Math.max(0, now - new Date(createdAt).getTime());
  let elapsedBeforeStage = 0;

  for (const stage of ORDER_STAGES) {
    if (elapsedMs < elapsedBeforeStage + stage.durationMs) {
      return stage.status;
    }
    elapsedBeforeStage += stage.durationMs;
  }

  return "Delivered";
}

export function getCurrentOrderStatus(order, now = Date.now()) {
  return order.statusUpdatedAt
    ? order.status
    : getOrderStatusAt(order.createdAt, now);
}

export function getOrderRouteProgress(status) {
  switch (status) {
    case "Picked up":
      return 0.1;
    case "En route":
      return 0.55;
    case "Arriving":
      return 0.9;
    case "Delivered":
      return 1;
    default:
      return 0;
  }
}
