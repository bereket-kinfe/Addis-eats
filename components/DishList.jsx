"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const formatPrice = (price) => `${Number(price).toLocaleString()} ETB`;

export default function DishList({ dishes = [] }) {
  const { addItem } = useCart();

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {dishes.map((dish, index) => (
        <article key={dish.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
          <div className="relative aspect-[4/3] bg-slate-100">
            <Image
              src={dish.image}
              alt={`${dish.name} served at Addis Eats`}
              fill
              priority={index === 0}
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{dish.name}</h3>
                <p className="text-sm text-slate-500">{dish.category}</p>
              </div>
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-sm font-semibold text-red-700">
                {formatPrice(dish.price)}
              </span>
            </div>

            <p className="mb-4 text-sm leading-6 text-slate-600">{dish.summary}</p>

            <div className="mt-3 flex items-center justify-between gap-2">
              <Link href={`/menu/${dish.id}`} className="text-sm font-semibold text-blue-600 underline-offset-2 hover:underline">
                View Details
              </Link>
              <button
                type="button"
                onClick={() => addItem(dish)}
                className="rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
