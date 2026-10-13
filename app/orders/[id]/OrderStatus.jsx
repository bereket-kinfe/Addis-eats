"use client";

import { useEffect, useState } from "react";

const POLL_INTERVAL_MS = 5000;

export default function OrderStatus({ orderId, initialStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let timeoutId;
    const controller = new AbortController();

    async function refreshStatus() {
      try {
        const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Order status request failed (${response.status}).`);
        }
        const order = await response.json();
        if (active) {
          setStatus(order.status);
          setError("");
        }
      } catch (requestError) {
        if (active && requestError.name !== "AbortError") {
          setError("Status refresh failed. Retrying shortly.");
        }
      } finally {
        if (active) timeoutId = setTimeout(refreshStatus, POLL_INTERVAL_MS);
      }
    }

    timeoutId = setTimeout(refreshStatus, POLL_INTERVAL_MS);
    return () => {
      active = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [orderId]);

  return (
    <div className="mt-4">
      <p className="text-lg text-slate-700" aria-live="polite">Status: {status}</p>
      {error && <p role="status" className="mt-2 text-sm text-amber-700">{error}</p>}
      <p className="mt-2 text-sm text-slate-500">Status refreshes every 5 seconds.</p>
    </div>
  );
}
