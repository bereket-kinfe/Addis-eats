
'use client';
export default function MenuError({ error, reset }) {
  return (
    <main id="main-content" tabIndex={-1}>
      <h2>Something went wrong in the menu.</h2>
      <button className="min-h-11 px-3" onClick={() => reset()}>Try again</button>
    </main>
  );
}
