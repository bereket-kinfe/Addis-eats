"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const mockOrder = {
  status: "Preparing",
  id: "demo-order",
};

export default function OrderPage({ params }) {
  const { data } = useSWR(`/api/orders/${params.id}`, fetcher, {
    fallbackData: mockOrder,
    refreshInterval: 5000,
  });

  return (
    <main className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-2xl font-bold text-slate-900">Order #{params.id}</h1>
      <p className="mt-4 text-lg text-slate-700">Status: {data?.status ?? "Loading..."}</p>
    </main>
  );
}