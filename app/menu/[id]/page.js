
import { getDish } from "@/lib/api";

export async function generateMetadata({ params }) {
  const dish = await getDish(params.id);
  if (!dish) return { title: "Dish not found" };

  return {
    title: dish.name,
    description: `${dish.name} for ${dish.price} ETB. ${dish.summary ?? ""}`,
  };
}

export default async function DishPage({ params }) {
  const dish = await getDish(params.id);

  if (!dish) {
    return (
      <main>
        <h1>Dish not found</h1>
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.summary,
    offers: {
      "@type": "Offer",
      price: dish.price,
      priceCurrency: "ETB",
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1>{dish.name}</h1>
      <p>{dish.price} ETB</p>
    </main>
  );
}