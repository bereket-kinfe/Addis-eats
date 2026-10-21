
"use client";
import { useState, useEffect } from "react";

export default function OrderStatusClient({ id, initialStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const es = new EventSource(`/api/orders/${id}/stream`);
    
    es.onopen = () => setIsConnected(true);
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setStatus(data);
      if (data.isDelivered) {
        es.close(); 
      }
    };
    es.onerror = () => {
      setIsConnected(false);
      es.close();
    };

    return () => {
      es.close(); 
    };
  }, [id]);

  return (
    <div className="flex items-center space-x-2 text-sm">
      <span className={`inline-block w-2.5 h-2.5 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-amber-500"}`} />
      <span className="text-slate-600">
        {isConnected ? `Live Status: ${status.state}` : "Reconnecting..."}
      </span>
    </div>
  );
}