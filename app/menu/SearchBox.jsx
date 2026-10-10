"use client";

import { useState } from "react";

export default function SearchBox({ value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">Search dishes</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name or category"
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
      />
    </label>
  );
}