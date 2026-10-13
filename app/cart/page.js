import { requireSession } from "@/lib/session";
import CartClient from "./CartClient";

export const metadata = {
  title: "Cart",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  await requireSession("/cart");
  return <CartClient />;
}
