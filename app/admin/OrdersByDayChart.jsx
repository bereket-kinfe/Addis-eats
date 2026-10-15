"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { etb } from "@/lib/format";

export default function OrdersByDayChart({ data = [] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 12, left: 8, bottom: 12 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#475569" />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="#475569"
            tickFormatter={(value) => etb.format(Number(value))}
            width={85}
          />
          <Tooltip
            formatter={(value) => [etb.format(Number(value)), "Revenue"]}
            labelStyle={{ color: "#0f172a" }}
            contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ r: 4, fill: "#f97316" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
