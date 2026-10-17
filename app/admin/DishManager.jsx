"use client";

import { useEffect, useState } from "react";

const field = "min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900";
const STORAGE_KEY = "addis-eats-dishes";

export default function DishManager({ dishes }) {
  const [catalog, setCatalog] = useState(dishes);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setCatalog(parsed);
      }
    } catch { /* Use the bundled catalog if browser storage is unavailable. */ }
    setReady(true);
  }, []);

  function save(next) {
    setCatalog(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Browser storage may be disabled or full. */ }
  }

  function add(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const price = Number(form.get("price"));
    if (!name || !Number.isFinite(price) || price <= 0) return;
    save([...catalog, { id: `local-${Date.now()}`, name, price, category: String(form.get("category")).trim(), image: String(form.get("image")).trim(), summary: String(form.get("summary")).trim(), available: true }]);
    event.currentTarget.reset();
  }

  return (
    <section className="space-y-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Menu management</p><h2 className="mt-2 text-2xl font-black text-slate-900">Dishes</h2></div>
      <form onSubmit={add} className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
        <input className={field} name="name" placeholder="Dish name" maxLength={60} required />
        <input className={field} name="category" placeholder="Category (Main, Sides…)" maxLength={40} required />
        <input className={field} name="price" type="number" min="1" step="0.01" placeholder="Price in ETB" required />
        <input className={field} name="image" placeholder="Image path, e.g. /images/dish.jpg" required />
        <textarea className={`${field} sm:col-span-2`} name="summary" placeholder="Dish description" maxLength={240} required />
        <button className="min-h-11 rounded-lg bg-sky-700 px-4 py-2 font-bold text-white hover:bg-sky-800 sm:col-span-2">Add dish</button>
      </form>
      <div className="divide-y divide-slate-200">
        {!ready ? <p className="py-4 text-sm text-slate-500">Loading saved menu…</p> : catalog.map((dish) => (
          <article key={dish.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div><h3 className="font-bold text-slate-900">{dish.name} <span className="font-normal text-slate-500">· {dish.price} ETB</span></h3><p className="text-sm text-slate-500">{dish.category} · {dish.available === false ? "Unavailable" : "Available"}</p></div>
            <div className="flex gap-2">
              <button type="button" onClick={() => save(catalog.map((item) => item.id === dish.id ? { ...item, available: item.available === false } : item))} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm font-semibold">Mark {dish.available === false ? "available" : "unavailable"}</button>
              <button type="button" onClick={() => save(catalog.filter((item) => item.id !== dish.id))} className="min-h-10 rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700">Remove</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
