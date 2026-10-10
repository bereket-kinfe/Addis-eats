import Link from "next/link";

export default function DishList({ dishes }) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {dishes.map((dish) => (
        <div key={dish.id} className="border p-4 rounded shadow">
          <h3 className="font-bold text-lg">{dish.name}</h3>
          <p className="text-gray-600">${dish.price}</p>
          <Link href={`/menu/${dish.id}`} className="text-blue-500 underline mt-2 block">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}