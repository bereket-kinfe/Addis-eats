import { notFound } from "next/navigation";
import { getOrderForSession } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { getCurrentOrderStatus } from "@/lib/order-status";
import OrderTracking from "./OrderTracking";

export const metadata = {
  title: "Track your order",
  robots: { index: false, follow: false },
};

export default async function OrderPage({ params }) {
  const [{ id }, session] = await Promise.all([params, requireSession()]);
  const order = await getOrderForSession(id, session.sessionId);
  if (!order) notFound();

  return (
    <main id="main-content" tabIndex={-1} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <h1 className="break-all text-2xl font-bold text-slate-900">Order #{order.id}</h1>
      <p className="mt-4 text-slate-600">
        {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}
      </p>
      {order.deliveryDetails && (
        <section aria-labelledby="delivery-details-heading" className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2 id="delivery-details-heading" className="font-bold text-slate-900">Delivery details</h2>
          <dl className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <div><dt className="font-semibold">Recipient</dt><dd>{order.deliveryDetails.name}</dd></div>
            <div><dt className="font-semibold">Phone</dt><dd>{order.deliveryDetails.phone}</dd></div>
            <div><dt className="font-semibold">Area</dt><dd>{order.deliveryDetails.area}</dd></div>
            <div className="sm:col-span-2"><dt className="font-semibold">Address and instructions</dt><dd className="whitespace-pre-wrap">{order.deliveryDetails.address}</dd></div>
          </dl>
        </section>
      )}
      <OrderTracking
        orderId={order.id}
        initialStatus={getCurrentOrderStatus(order)}
      />
    </main>
  );
}
