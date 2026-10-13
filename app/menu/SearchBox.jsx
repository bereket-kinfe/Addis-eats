"use client";

import { useEffect, useState } from "react";

export default function SearchBox({ value, onChange }) {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => onChange(query), 250);
    return () => clearTimeout(timeoutId);
  }, [onChange, query]);

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">Search dishes</span>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by name or category"
        autoComplete="off"
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
      />
    </label>
  );
}