
"use client";

import { useMemo, useState } from "react";
import { dishes } from "@/lib/db";
import DishList from "@/components/DishList";
import CategoryBar from "./CategoryBar";
import SearchBox from "./SearchBox";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = useMemo(
    () => ["All", ...new Set(dishes.map((dish) => dish.category))],
    []
  );

  const filteredDishes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return dishes.filter((dish) => {
      const matchesCategory = selectedCategory === "All" || dish.category === selectedCategory;
      const matchesSearch =
        term.length === 0 ||
        dish.name.toLowerCase().includes(term) ||
        dish.category.toLowerCase().includes(term) ||
        dish.summary.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <main className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Menu</p>
        <h1 className="text-3xl font-black text-slate-900">Our Menu</h1>
      </div>

      <div className="space-y-4">
        <SearchBox value={searchTerm} onChange={setSearchTerm} />
        <CategoryBar categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">{filteredDishes.length} dishes found</p>
      </div>

      {filteredDishes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
          No dishes match your current search.
        </div>
      ) : (
        <DishList dishes={filteredDishes} />
      )}
    </main>
  );
}