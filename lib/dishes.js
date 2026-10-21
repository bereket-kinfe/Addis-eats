export const dishes = [
  {
    id: 1,
    name: "Doro Wat",
    price: 18,
    category: "Main",
    image: "/images/Doro_wet.jpg",
    summary: "A rich Ethiopian chicken stew served with injera and a bold berbere sauce.",
  },
  {
    id: 2,
    name: "Kitfo",
    price: 22,
    category: "Main",
    image: "/images/Kitfo.jpg",
    summary: "Minced beef with mitmita, clarified butter, and a spicy Ethiopian kick.",
  },
  {
    id: 3,
    name: "Shiro",
    price: 16,
    category: "Vegetarians",
    image: "/images/shiro.png",
    summary: "A hearty chickpea stew finished with warm spices and ginger.",
  },
  {
    id: 4,
    name: "Injera",
    price: 8,
    category: "Sides",
    image: "/images/injera.png",
    summary: "Traditional spongy sourdough flatbread served fresh from the kitchen.",
  },
  {
    id: 5,
    name: "Tibs",
    price: 20,
    category: "Grills",
    image: "/images/Tibs.jpg",
    summary: "Tender sauteed beef tossed with onions, peppers, and Ethiopian spices.",
  },
  {
    id: 6,
    name: "Gored Gored",
    price: 24,
    category: "Grills",
    image: "/images/gored-gored.png",
    summary: "Chunks of seasoned beef served with a bold, spicy Ethiopian sauce.",
  },
  {
    id: 7,
    name: "Gomen Besiga",
    price: 19,
    category: "Main",
    image: "/images/gomen-besiga.png",
    summary: "Slow-cooked beef and collard greens seasoned with traditional spices.",
  },
  {
    id: 8,
    name: "Beyaynetu",
    price: 17,
    category: "Vegetarians",
    image: "/images/beyaynetu.png",
    summary: "A colorful platter of Ethiopian vegetarian stews served together on injera.",
  },
  {
    id: 9,
    name: "Asa Tibs",
    price: 23,
    category: "Grills",
    image: "/images/Asa-tibs.png",
    summary: "Fresh fish sauteed with onions, peppers, and fragrant Ethiopian spices.",
  },
  {
    id: 10,
    name: "Dulet",
    price: 21,
    category: "Main",
    image: "/images/dulet.jpg",
    summary: "A traditional blend of minced meat, herbs, and warming Ethiopian spices.",
  },
  {
    id: 11,
    name: "Fosoliya",
    price: 15,
    category: "Vegetarians",
    image: "/images/fosoliya.png",
    summary: "Green beans and carrots simmered with tomatoes and savory spices.",
  },
  {
    id: 12,
    name: "Siga Firfir",
    price: 19,
    category: "Main",
    image: "/images/siga-firfir.png",
    summary: "Tender beef tossed with torn injera and a rich, spiced berbere sauce.",
  },
  {
    id: 13,
    name: "Tej",
    price: 12,
    category: "Drinks",
    image: "/images/tej.png",
    summary: "Traditional Ethiopian honey wine with a delicate, honeyed aroma.",
  },
];

export async function getDishes() {
  return dishes;
}

export function getDishSlug(dish) {
  return dish.name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getDish(id) {
  const value = String(id);
  return dishes.find((dish) => String(dish.id) === value || getDishSlug(dish) === value) || null;
}
