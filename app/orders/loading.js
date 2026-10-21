export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading your orders"
      className="space-y-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8"
    >
      <span className="sr-only">Loading your orders...</span>
      <div className="h-9 w-48 animate-pulse rounded bg-slate-200" />
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="grid grid-cols-5 gap-4 bg-slate-50 px-4 py-3">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-3 animate-pulse rounded bg-slate-200" />
          ))}
        </div>
        <div className="divide-y divide-slate-200">
          {Array.from({ length: 5 }, (_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-4 px-4 py-5">
              {Array.from({ length: 5 }, (_, columnIndex) => (
                <div key={columnIndex} className="h-4 animate-pulse rounded bg-slate-200" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
