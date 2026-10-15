
import { getDish } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) return { title: "Dish not found" };

  const description = `${dish.name} for ${dish.price} ETB. ${dish.summary ?? ""}`;
  const image = `/menu/${dish.id}/opengraph-image`;

  return {
    title: dish.name,
    description,
    alternates: { canonical: `/menu/${dish.id}` },
    openGraph: {
      title: dish.name,
      description,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: `${dish.name} from Addis Eats` }],
    },
    twitter: {
      card: "summary_large_image",
      title: dish.name,
      description,
      images: [image],
    },
  };
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.summary,
    image: new URL(dish.image, "https://addiseats.et").toString(),
    offers: {
      "@type": "Offer",
      price: dish.price,
      priceCurrency: "ETB",
    },
  };

  return (
    <main className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 sm:aspect-[16/9]">
        <Image
          src={dish.image}
          alt={`${dish.name} served at Addis Eats`}
          fill
          priority
          sizes="(min-width: 1152px) 1072px, (min-width: 640px) calc(100vw - 80px), calc(100vw - 64px)"
          className="object-cover"
        />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{dish.name}</h1>
      <p className="mt-3 text-lg text-slate-700">{dish.price} ETB</p>
      <p className="mt-3 text-slate-600">{dish.summary}</p>
    </main>
  );
}
