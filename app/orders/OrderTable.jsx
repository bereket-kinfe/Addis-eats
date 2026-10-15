"use client";

import Link from "next/link";
import { downloadCsv, toCsv } from "@/lib/csv";
import { etb, when } from "@/lib/format";
import { getPaginationModel } from "@/lib/order-pagination.mjs";

const sortableColumns = [
  { key: "createdAt", label: "Date placed" },
  { key: "status", label: "Status" },
  { key: "total", label: "Total" },
];

function ordersHref(page, sort, direction) {
  const query = new URLSearchParams({ page: String(page), sort, direction });
  return `/orders?${query.toString()}`;
}

function totalFor(order) {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function SortLink({ column, currentSort, direction }) {
  const isCurrentSort = currentSort === column.key;
  const nextDirection = isCurrentSort && direction === "asc" ? "desc" : "asc";
  const href = ordersHref(1, column.key, nextDirection);

  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-1 px-2 hover:text-red-700"
      aria-label={`Sort by ${column.label}${isCurrentSort ? `, currently ${direction}ending` : ""}`}
    >
      {column.label}
      <span aria-hidden="true" className="text-xs text-slate-500">
        {isCurrentSort ? (direction === "asc" ? "ascending" : "descending") : "sort"}
      </span>
    </Link>
  );
}

export default function OrderTable({
  orders,
  page,
  pageSize,
  sort,
  direction,
  totalOrders,
  totalPages,
}) {
  const firstOrderNumber = (page - 1) * pageSize + 1;
  const lastOrderNumber = Math.min(page * pageSize, totalOrders);
  const pagination = getPaginationModel(page, totalPages);

  const handleExport = () => {
    const rows = orders.map((order) => ({
      Date: when.format(new Date(order.createdAt)),
      Status: order.status,
      Items: order.items.map((item) => `${item.name} × ${item.quantity}`).join(", "),
      Total: etb.format(totalFor(order)),
    }));
    downloadCsv(toCsv(rows), `addis-eats-orders-page-${page}.csv`);
  };

  return (
    <section className="space-y-4">
      <p className="text-sm text-slate-600" aria-live="polite">
        Showing {firstOrderNumber}-{lastOrderNumber} of {totalOrders} orders
      </p>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[720px] divide-y divide-slate-200 text-left text-sm">
          <caption className="sr-only">Your orders, sorted by {sort} in {direction}ending order</caption>
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              {sortableColumns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={sort === column.key ? (direction === "asc" ? "ascending" : "descending") : "none"}
                  className="px-4 py-3 font-semibold"
                >
                  <SortLink column={column} currentSort={sort} direction={direction} />
                </th>
              ))}
              <th scope="col" className="px-4 py-3 font-semibold">Items</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Order total</th>
              <th scope="col" className="px-4 py-3 font-semibold">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {orders.map((order) => (
              <tr key={order.id} className="text-slate-700">
                <td className="whitespace-nowrap px-4 py-4">
                  <time dateTime={order.createdAt}>{when.format(new Date(order.createdAt))}</time>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    {order.status}
                  </span>
                </td>
                <td className="max-w-xs px-4 py-4">
                  {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-slate-900">
                  {etb.format(totalFor(order))}
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <Link
                    href={`/orders/${encodeURIComponent(order.id)}`}
                    className="inline-flex min-h-11 items-center font-semibold text-red-700 underline underline-offset-2 hover:text-red-800"
                    aria-label={`View order from ${when.format(new Date(order.createdAt))}`}
                  >
                    View order
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav aria-label="Order pages" className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-600">Page {page} of {totalPages}</p>
          <button
            type="button"
            onClick={handleExport}
            className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Export CSV
          </button>
        </div>
        <div className="flex items-center gap-2">
          {pagination.previousPage ? (
            <Link
              href={ordersHref(pagination.previousPage, sort, direction)}
              className="min-h-11 rounded-lg border border-slate-300 px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Previous
            </Link>
          ) : (
            <span aria-disabled="true" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-400">
              Previous
            </span>
          )}
          {pagination.nextPage ? (
            <Link
              href={ordersHref(pagination.nextPage, sort, direction)}
              className="min-h-11 rounded-lg border border-slate-300 px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Next
            </Link>
          ) : (
            <span aria-disabled="true" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-400">
              Next
            </span>
          )}
        </div>
      </nav>
    </section>
  );
}
