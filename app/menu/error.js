"use client"; 
export default function Error({ error, reset }) {
  return (
    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <h2 className="font-bold">Something went wrong loading the menu!</h2>
      <p>{error?.message || "An unexpected error occurred."}</p>
      <button
        onClick={() => reset()}
        className="mt-2 bg-red-600 text-white px-3 py-1 rounded"
      >
        Try Again
      </button>
    </div>
  );
}