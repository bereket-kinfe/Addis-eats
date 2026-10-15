import Link from "next/link";
import Image from "next/image";
import { dishes } from "@/lib/dishes";

export const metadata = {
  title: "Ethiopian Food Delivery in Addis Ababa",
  description: "Order fresh Doro Wat, Tibs, Kitfo, and other Ethiopian favourites for delivery across Addis Ababa.",
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Addis Eats",
    url: "https://addiseats.et",
    servesCuisine: "Ethiopian",
    areaServed: "Addis Ababa",
    menu: "https://addiseats.et/menu",
  };

  return (
    <main className="space-y-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Addis Eats</p>
        <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">Fresh Ethiopian meals, delivered across Addis Ababa</h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Discover classic dishes like Doro Wat, Kitfo, and Shiro made with authentic ingredients and delivered fast.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/menu" className="inline-flex min-h-12 items-center rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700">
            Explore Menu
          </Link>
          <Link href="/cart" className="inline-flex min-h-12 items-center rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
            View Cart
          </Link>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="featured-dishes">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Made fresh</p>
            <h2 id="featured-dishes" className="mt-1 text-2xl font-bold text-slate-900">
              A taste of Ethiopia
            </h2>
          </div>
          <Link href="/menu" className="inline-flex min-h-11 items-center text-sm font-semibold text-blue-600 hover:underline">
            See the full menu
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {dishes.slice(0, 3).map((dish) => (
            <Link
              key={dish.id}
              href={`/menu/${dish.id}`}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md"
            >
              <div className="relative aspect-[4/3] bg-slate-100">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  sizes="(min-width: 1152px) 342px, (min-width: 640px) calc((100vw - 128px) / 3), calc(100vw - 72px)"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div>
                  <h3 className="font-bold text-slate-900">{dish.name}</h3>
                  <p className="text-sm text-slate-500">{dish.category}</p>
                </div>
                <span className="text-sm font-semibold text-red-700">{dish.price} ETB</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {[
          { title: "Authentic Flavour", text: "Traditional Ethiopian recipes prepared fresh every day." },
          { title: "Fast Delivery", text: "Quick service across the city for lunch, dinner, and family meals." },
          { title: "Easy Ordering", text: "Choose your favourites and check out in minutes." },
        ].map((feature) => (
          <div key={feature.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="mb-2 text-lg font-bold text-slate-900">{feature.title}</h2>
            <p className="text-slate-600">{feature.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
