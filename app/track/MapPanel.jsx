"use client";

import dynamic from "next/dynamic";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => <div className="h-80 animate-pulse rounded-lg bg-slate-100" />,
});

export default function MapPanel({ status }) {
  return <DeliveryMap status={status} />;
}
