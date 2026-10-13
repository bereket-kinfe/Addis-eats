export default function CategoryBar({ categories, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isSelected = selected === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              isSelected
                ? "border-red-600 bg-red-600 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}