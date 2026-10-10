
import { getDishes } from "@/lib/api";

export default async function sitemap() {
  const dishes = await getDishes();

  return [
    { url: "https://addiseats.et/", priority: 1 },
    { url: "https://addiseats.et/menu", priority: 0.8 },
    ...dishes.map((d) => ({
      url: `https://addiseats.et/menu/${d.id}`,
      priority: 0.6,
    })),
  ];
}