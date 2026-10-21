import { getOrdersForSession } from "@/lib/db";
import { requireSession } from "@/lib/session";
import EmptyOrders from "./EmptyOrders";
import OrderTable from "./OrderTable";

export const metadata = {
  title: "Your orders",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 10;
const SORT_FIELDS = new Set(["createdAt", "status", "total"]);

function getSearchValue(value) {
  return typeof value === "string" ? value : "";
}

function getPageNumber(value) {
  const page = getSearchValue(value);
  if (!/^\d+$/.test(page)) return 1;

  const parsedPage = Number(page);
  return Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
}

function getOrderTotal(order) {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function compareOrders(first, second, sort) {
  if (sort === "status") return first.status.localeCompare(second.status);
  if (sort === "total") return getOrderTotal(first) - getOrderTotal(second);
  return Date.parse(first.createdAt) - Date.parse(second.createdAt);
}

export default async function OrdersPage({ searchParams }) {
  const [query, session] = await Promise.all([searchParams, requireSession("/orders")]);
  const orders = await getOrdersForSession(session.sessionId);

  if (orders.length === 0) {
    return <EmptyOrders />;
  }

  const requestedSort = getSearchValue(query?.sort);
  const sort = SORT_FIELDS.has(requestedSort) ? requestedSort : "createdAt";
  const direction = getSearchValue(query?.direction) === "asc" ? "asc" : "desc";
  const directionMultiplier = direction === "asc" ? 1 : -1;
  const sortedOrders = [...orders].sort(
    (first, second) =>
      compareOrders(first, second, sort) * directionMultiplier ||
      first.id.localeCompare(second.id),
  );
  const totalPages = Math.ceil(sortedOrders.length / PAGE_SIZE);
  const page = Math.min(getPageNumber(query?.page), totalPages);
  const pageOrders = sortedOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="space-y-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Order history</p>
        <h1 className="text-3xl font-black text-slate-900">Your orders</h1>
        <p className="text-slate-600">
          Review your recent orders, totals, and delivery status.
        </p>
      </header>

      <OrderTable
        orders={pageOrders}
        page={page}
        pageSize={PAGE_SIZE}
        sort={sort}
        direction={direction}
        totalOrders={sortedOrders.length}
        totalPages={totalPages}
      />
    </main>
  );
}
