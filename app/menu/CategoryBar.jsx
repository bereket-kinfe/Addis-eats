export default function CategoryBar({ categories, selected, onSelect }) {
  return (
    <div className="overflow-x-auto pb-1 sm:overflow-visible sm:pb-0">
      <div className="flex min-w-max items-center gap-2 sm:flex-wrap sm:min-w-0">
        {categories.map((category) => {
          const isSelected = selected === category;

          return (
            <button
              key={category}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(category)}
              className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
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
    </div>
  );
}
