"use client";
import { useState } from "react";

export default function CheckoutForm({ onSubmitAction }) {
  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pending) return; 
    
    setPending(true);
    try {
      await onSubmitAction({ phone });
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">TeleBirr Number</label>
        <input 
          type="tel" 
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:ring-2 focus:ring-blue-600"
          required
        />
      </div>

      <button 
        type="submit" 
        disabled={pending}
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Placing Order..." : "Place Order"}
      </button>
    </form>
  );
}