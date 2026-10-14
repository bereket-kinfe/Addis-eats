"use client";

import { useCallback, useState } from "react";
import MapPanel from "@/app/track/MapPanel";
import OrderStatus from "./OrderStatus";

export default function OrderTracking({ orderId, initialStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const handleStatusChange = useCallback((nextStatus) => {
    setStatus(nextStatus);
  }, []);

  return (
    <>
      <OrderStatus
        orderId={orderId}
        initialStatus={initialStatus}
        onStatusChange={handleStatusChange}
      />
      <section className="mt-6 space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Delivery map</h2>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
          <MapPanel status={status} />
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold uppercase tracking-wide text-slate-500">Delivery details</p>
            <ul className="mt-3 space-y-2">
              <li><span className="font-semibold text-slate-900">Restaurant:</span> Bole, Addis Ababa</li>
              <li><span className="font-semibold text-slate-900">Courier:</span> Traveling by road from the restaurant to the delivery address</li>
              <li><span className="font-semibold text-slate-900">Status:</span> {status}</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
