import { getDishes } from "@/lib/api";
import MenuBrowser from "./MenuBrowser";

export const metadata = {
  title: "Menu",
  description: "Browse and search Addis Eats' Ethiopian dishes, sides, and vegetarian meals.",
};

export default async function MenuPage() {
  const dishes = await getDishes();
  return <MenuBrowser dishes={dishes} />;
}
