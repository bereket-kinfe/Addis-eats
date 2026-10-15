export function getSafeReturnPath(value) {
  if (value === "/cart" || value === "/checkout" || value === "/orders" || value === "/admin") return value;
  if (typeof value === "string" && /^\/orders\/[a-f0-9-]+$/i.test(value)) return value;
  return "/cart";
}
