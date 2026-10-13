import { requireSession } from "@/lib/session";
import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  await requireSession("/checkout");
  return <CheckoutClient />;
}
