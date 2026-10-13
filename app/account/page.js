import Link from "next/link";
import { getSession } from "@/lib/session";
import { signIn, signOut } from "./actions";

export const metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage({ searchParams }) {
  const session = await getSession();
  const query = await searchParams;

  return (
    <main className="mx-auto max-w-xl rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <h1 className="text-2xl font-black text-slate-900">Your account</h1>
      {session ? (
        <div className="mt-4 space-y-4">
          <p className="text-slate-700">Signed in as <strong>{session.name}</strong>.</p>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700"
            >
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <form action={signIn} className="mt-4 space-y-4">
          <p className="text-slate-600">
            Sign in to place orders and track them in this demo.
          </p>
          {query?.error === "invalid-name" && (
            <p role="alert" className="text-sm font-medium text-red-700">
              Enter a name between 2 and 40 characters.
            </p>
          )}
          {query?.signedOut === "1" && (
            <p role="status" className="text-sm text-slate-600">You have signed out.</p>
          )}
          <input type="hidden" name="next" value={query?.next ?? "/cart"} />
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
            <input
              name="name"
              type="text"
              autoComplete="name"
              minLength={2}
              maxLength={40}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700"
          >
            Sign in
          </button>
          <p className="text-sm text-slate-500">
            <Link href="/menu" className="underline underline-offset-2">Browse the menu</Link> without signing in.
          </p>
        </form>
      )}
    </main>
  );
}
