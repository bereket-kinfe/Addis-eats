"use client";

import { useMemo, useState } from "react";
import DishList from "@/components/DishList";

export default function FilterShell({ dishes = [] }) {
  const categories = useMemo(() => ["All", ...new Set(dishes.map((dish) => dish.category))], [dishes]);
  const [selected, setSelected] = useState("All");

  const filteredDishes = selected === "All"
    ? dishes
    : dishes.filter((dish) => dish.category === selected);

  return (
    <section>
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelected(category)}
            className={`rounded border px-3 py-1 ${selected === category ? "bg-red-600 text-white" : "bg-white text-gray-700"}`}
          >
            {category}
          </button>
        ))}
      </div>

      <DishList dishes={filteredDishes} />
    </section>
  );
}
