import Link from "next/link";

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
          <Link href="/menu" className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700">
            Explore Menu
          </Link>
          <Link href="/cart" className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
            View Cart
          </Link>
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