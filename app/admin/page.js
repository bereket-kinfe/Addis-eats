import Link from "next/link";
import RevenueChart from "./RevenueChart";
import OrdersByDayChart from "./OrdersByDayChart";
import { getAllOrders } from "@/lib/db";
import { etb, when } from "@/lib/format";
import { requireAdmin } from "@/lib/session";
import { getDishes } from "@/lib/dishes";
import DishManager from "./DishManager";

export const metadata = { title: "Admin dashboard", description: "Manage Addis Eats menu, orders, and revenue." };

const navigation = [
  { href: "#overview", label: "Overview", icon: "◫" },
  { href: "#menu", label: "Menu management", icon: "☷" },
  { href: "#orders", label: "Orders", icon: "▤" },
  { href: "#revenue", label: "Revenue", icon: "↗" },
];

function orderTotal(order) {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export default async function AdminPage() {
  const [, orders, dishes] = await Promise.all([requireAdmin(), getAllOrders(), getDishes()]);
  const revenue = orders.reduce((total, order) => total + orderTotal(order), 0);
  const revenueByArea = orders.reduce((accumulator, order) => {
    const area = order.area || "Unknown";
    accumulator[area] = (accumulator[area] || 0) + orderTotal(order);
    return accumulator;
  }, {});
  const areaData = Object.entries(revenueByArea).map(([area, value]) => ({ area, revenue: value })).sort((a, b) => b.revenue - a.revenue);
  const dailyData = Object.entries(orders.reduce((accumulator, order) => {
    const key = new Date(order.createdAt).toISOString().slice(0, 10);
    accumulator[key] = (accumulator[key] || 0) + orderTotal(order);
    return accumulator;
  }, {})).sort(([a], [b]) => Date.parse(a) - Date.parse(b)).map(([day, value]) => ({ day: when.format(new Date(`${day}T00:00:00Z`)), revenue: value }));
  const recentOrders = [...orders].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 8);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <Link href="/admin" className="admin-brand"><span className="admin-brand-mark">A</span><span>Addis Eats<small>ADMIN CONSOLE</small></span></Link>
        <p className="admin-nav-label">WORKSPACE</p>
        <nav className="admin-nav">{navigation.map((item, index) => <a key={item.href} href={item.href} aria-label={item.label} title={item.label} className={index === 0 ? "admin-nav-item active" : "admin-nav-item"}><span aria-hidden="true">{item.icon}</span><span className="admin-nav-text">{item.label}</span></a>)}</nav>
        <div className="admin-sidebar-bottom"><span className="admin-avatar">AE</span><span>Restaurant admin<small>Administrator</small></span></div>
      </aside>

      <main id="main-content" tabIndex={-1} className="admin-main">
        <header className="admin-topbar"><div><p className="admin-eyebrow">ADDIS EATS / ADMIN</p><h1>Dashboard</h1></div><Link href="/" className="admin-view-site">View storefront <span aria-hidden="true">↗</span></Link></header>
        <section id="overview" className="admin-welcome"><div><p className="admin-eyebrow">YOUR RESTAURANT AT A GLANCE</p><h2>Good to see you.</h2><p>Keep your menu fresh and your orders moving.</p></div><span className="admin-welcome-icon" aria-hidden="true">✦</span></section>

        <section className="admin-stats" aria-label="Business summary">
          <article className="admin-stat"><span className="admin-stat-icon revenue">↗</span><p>Total revenue</p><strong>{etb.format(revenue)}</strong><small>From {orders.length} {orders.length === 1 ? "order" : "orders"}</small></article>
          <article className="admin-stat"><span className="admin-stat-icon orders">▤</span><p>Total orders</p><strong>{orders.length}</strong><small>All time</small></article>
          <article className="admin-stat"><span className="admin-stat-icon menu">☷</span><p>Menu items</p><strong>{dishes.length}</strong><small>Available to customers</small></article>
        </section>

        <section id="menu" className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">CATALOG</p><h2>Menu management</h2></div><span className="admin-count">{dishes.length} items</span></div><DishManager dishes={dishes} /></section>

        <section id="orders" className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">FULFILLMENT</p><h2>Recent orders</h2></div><span className="admin-count">{orders.length} total</span></div>
          {recentOrders.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Date</th><th>Delivery area</th><th>Status</th><th className="text-right">Total</th></tr></thead><tbody>{recentOrders.map((order) => <tr key={order.id}><td className="font-semibold text-slate-900">#{order.id.slice(0, 8).toUpperCase()}</td><td>{when.format(new Date(order.createdAt))}</td><td>{order.area || "—"}</td><td><span className="admin-status">{order.status}</span></td><td className="text-right font-semibold text-slate-900">{etb.format(orderTotal(order))}</td></tr>)}</tbody></table></div> : <div className="admin-empty"><span aria-hidden="true">▤</span><strong>No orders yet</strong><p>New customer orders will show up here.</p></div>}
        </section>

        <section id="revenue" className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">PERFORMANCE</p><h2>Revenue</h2></div><span className="admin-count">ETB</span></div>
          <div className="admin-chart-grid"><article className="admin-chart-card"><h3>By delivery area</h3><p>Revenue grouped by delivery location</p>{areaData.length ? <RevenueChart data={areaData} /> : <div className="admin-chart-empty">Revenue will appear when you receive orders.</div>}</article><article className="admin-chart-card"><h3>Daily revenue</h3><p>{dailyData.length ? `${dailyData[0].day} – ${dailyData[dailyData.length - 1].day}` : "Your daily performance"}</p>{dailyData.length ? <OrdersByDayChart data={dailyData} /> : <div className="admin-chart-empty">Daily totals will appear when you receive orders.</div>}</article></div>
          {dailyData.length > 0 && <div className="admin-table-wrap admin-daily-table"><table className="admin-table"><thead><tr><th>Date</th><th className="text-right">Revenue</th></tr></thead><tbody>{dailyData.map((row) => <tr key={row.day}><td>{row.day}</td><td className="text-right font-semibold text-slate-900">{etb.format(row.revenue)}</td></tr>)}</tbody></table></div>}
        </section>
      </main>
    </div>
  );
}
