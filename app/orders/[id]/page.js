import { notFound } from "next/navigation";
import { getOrderForSession } from "@/lib/db";
import { requireSession } from "@/lib/session";
import OrderStatus from "./OrderStatus";

export const metadata = {
  title: "Track your order",
  robots: { index: false, follow: false },
};

export default async function OrderPage({ params }) {
  const [{ id }, session] = await Promise.all([params, requireSession()]);
  const order = await getOrderForSession(id, session.sessionId);
  if (!order) notFound();

  return (
    <main className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <h1 className="break-all text-2xl font-bold text-slate-900">Order #{order.id}</h1>
      <p className="mt-4 text-slate-600">
        {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}
      </p>
      <OrderStatus orderId={order.id} initialStatus={order.status} />
    </main>
  );
}
