export const dishes = [
  {
    id: 1,
    name: "Doro Wat",
    price: 18,
    category: "Entree",
    image: "/images/Doro_wet.jpg",
    summary: "A rich Ethiopian chicken stew served with injera and a bold berbere sauce.",
  },
  {
    id: 2,
    name: "Kitfo",
    price: 22,
    category: "Entree",
    image: "/images/Kitfo.jpg",
    summary: "Minced beef with mitmita, clarified butter, and a spicy Ethiopian kick.",
  },
  {
    id: 3,
    name: "Shiro",
    price: 16,
    category: "Vegetarian",
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
];

export async function getDishes() {
  return dishes;
}

export async function getDish(id) {
  return dishes.find((dish) => String(dish.id) === String(id)) || null;
}
