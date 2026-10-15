"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { etb } from "@/lib/format";

export default function RevenueChart({ data = [] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={10} margin={{ top: 12, right: 12, left: 4, bottom: 12 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="area" tickLine={false} axisLine={false} stroke="#475569" />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="#475569"
            tickFormatter={(value) => etb.format(value)}
            width={80}
          />
          <Tooltip
            formatter={(value) => [etb.format(Number(value)), "Revenue"]}
            labelStyle={{ color: "#0f172a" }}
            contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}
          />
          <Bar dataKey="revenue" radius={[8, 8, 0, 0]} fill="#0ea5e9" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}