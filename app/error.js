
'use client';
export default function MenuError({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong in the menu.</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}