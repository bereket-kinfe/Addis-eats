export default function Loading() {
  return (
    <main id="main-content" tabIndex={-1} aria-busy="true" aria-label="Loading order details" className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 bg-slate-200 animate-pulse" />
      ))}
    </main>
  );
}
