"use client";

import { useEffect, useState } from "react";
import { getOrderRouteProgress } from "@/lib/order-status";

const terminalStatuses = new Set(["Delivered", "Cancelled"]);

export default function OrderStatus({ orderId, initialStatus, onStatusChange }) {
  const [status, setStatus] = useState(initialStatus);
  const [connectionState, setConnectionState] = useState(
    terminalStatuses.has(initialStatus) ? "done" : "connecting",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (terminalStatuses.has(initialStatus)) {
      return undefined;
    }

    const source = new EventSource(`/orders/${encodeURIComponent(orderId)}/stream`);

    source.onopen = () => {
      setConnectionState("connected");
      setError("");
    };

    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.status) {
          setStatus(payload.status);
          onStatusChange(payload.status);
          setConnectionState(payload.status && terminalStatuses.has(payload.status) ? "done" : "connected");
          if (terminalStatuses.has(payload.status)) {
            source.close();
          }
        }
      } catch {
        setError("The order stream sent an invalid update.");
      }
    };

    source.onerror = () => {
      setConnectionState("reconnecting");
      setError("Connection interrupted. Trying to reconnect…");
    };

    return () => {
      source.close();
    };
  }, [initialStatus, onStatusChange, orderId]);

  const isCompleted = terminalStatuses.has(status);

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span
          className={`inline-flex h-2.5 w-2.5 rounded-full ${
            connectionState === "connected" ? "bg-emerald-500" :
            connectionState === "done" ? "bg-sky-500" :
            connectionState === "reconnecting" ? "bg-amber-500" : "bg-slate-400"
          }`}
          aria-hidden="true"
        />
        <span aria-live="polite">
          {connectionState === "connected" && "Live connection"}
          {connectionState === "done" && "Delivered"}
          {connectionState === "reconnecting" && "Reconnecting"}
          {connectionState === "connecting" && "Connecting"}
        </span>
      </div>
      <p className="text-lg text-slate-700" aria-live="polite">Status: {status}</p>
      {error && <p role="status" className="text-sm text-amber-700">{error}</p>}
      {isCompleted && <p className="text-sm text-slate-500">Tracking is complete for this order.</p>}
      <p className="sr-only">Courier route progress: {Math.round(getOrderRouteProgress(status) * 100)}%.</p>
    </div>
  );
}
