import { getDishes } from "@/lib/api";
import MenuBrowser from "./MenuBrowser";

export const metadata = {
  title: "Menu",
  description: "Browse and search Addis Eats' Ethiopian dishes, sides, and vegetarian meals.",
  openGraph: {
    title: "Addis Eats Menu",
    description: "Browse Ethiopian favourites, sides, and vegetarian meals from Addis Eats.",
    type: "website",
    url: "/menu",
    images: [
      {
        url: "/images/Doro_wet.jpg",
        alt: "Ethiopian Doro Wat from the Addis Eats menu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Addis Eats Menu",
    description: "Browse Ethiopian favourites, sides, and vegetarian meals from Addis Eats.",
    images: ["/images/Doro_wet.jpg"],
  },
};

export default async function MenuPage() {
  const dishes = await getDishes();
  return <MenuBrowser dishes={dishes} />;
}
