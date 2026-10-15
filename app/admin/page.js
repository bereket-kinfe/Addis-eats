import RevenueChart from "./RevenueChart";
import OrdersByDayChart from "./OrdersByDayChart";
import { getAllOrders } from "@/lib/db";
import { etb, when } from "@/lib/format";

export const metadata = {
  title: "Admin",
  description: "Review Addis Eats revenue by delivery area and daily totals in Ethiopian birr.",
};

export default async function AdminPage() {
  const orders = await getAllOrders();
  const revenueByArea = orders.reduce((accumulator, order) => {
    const area = order.area || "Unknown";
    const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    accumulator[area] = (accumulator[area] || 0) + total;
    return accumulator;
  }, {});

  const areaData = Object.entries(revenueByArea)
    .map(([area, revenue]) => ({ area, revenue }))
    .sort((first, second) => second.revenue - first.revenue);

  const dailyData = Object.entries(
    orders.reduce((accumulator, order) => {
      const key = new Date(order.createdAt).toISOString().slice(0, 10);
      accumulator[key] = (accumulator[key] || 0) + order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      return accumulator;
    }, {}),
  )
    .sort(([firstDay], [secondDay]) => Date.parse(firstDay) - Date.parse(secondDay))
    .map(([day, revenue]) => ({ day: when.format(new Date(`${day}T00:00:00Z`)), revenue }));

  return (
    <main className="space-y-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Admin</p>
        <h1 className="text-3xl font-black text-slate-900">Revenue by area</h1>
        <p className="text-slate-600">Live order totals grouped by delivery area in ETB.</p>
      </div>

      <RevenueChart data={areaData} />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Revenue per day (ETB)</h2>
          <p className="text-slate-600">Orders by date from {dailyData[0]?.day || "—"} to {dailyData[dailyData.length - 1]?.day || "—"}.</p>
        </div>
        <OrdersByDayChart data={dailyData} />

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Date</th>
                <th scope="col" className="px-4 py-3 font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {dailyData.map((row) => (
                <tr key={row.day}>
                  <td className="px-4 py-3">{row.day}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{etb.format(row.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
