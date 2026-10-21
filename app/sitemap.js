
import { getDishes, getDishSlug } from "@/lib/api";

export default async function sitemap() {
  const dishes = await getDishes();
  const lastModified = new Date();

  return [
    { url: "https://addiseats.et/", lastModified, changeFrequency: "weekly", priority: 1 },
    { url: "https://addiseats.et/menu", lastModified, changeFrequency: "daily", priority: 0.8 },
    ...dishes.map((d) => ({
      url: `https://addiseats.et/menu/${getDishSlug(d)}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    })),
  ];
}
