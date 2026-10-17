import Link from "next/link";
import { getSession } from "@/lib/session";
import { signIn, signOut } from "./actions";
import { isAdminSession } from "@/lib/admin-auth";

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
          <Link
            href="/orders"
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View your orders
          </Link>
          {isAdminSession(session) && (
            <Link href="/admin" className="inline-flex min-h-11 items-center rounded-lg border border-sky-300 px-4 py-2 font-semibold text-sky-800 transition hover:bg-sky-50">
              Open admin dashboard
            </Link>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="min-h-11 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700"
            >
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-4 space-y-5">
          <p className="text-slate-600">
            Create your customer account or sign in before placing an order.
          </p>
          {query?.error === "invalid-name" && (
            <p role="alert" className="text-sm font-medium text-red-700">
              Enter a name between 2 and 40 characters.
            </p>
          )}
          {query?.signedOut === "1" && (
            <p role="status" className="text-sm text-slate-600">You have signed out.</p>
          )}
          {query?.error === "google-sign-in" && (
            <p role="alert" className="text-sm font-medium text-red-700">
              Google sign-in could not be completed. Please try again.
            </p>
          )}
          {query?.error === "google-not-configured" && (
            <p role="alert" className="text-sm font-medium text-red-700">
              Google sign-in is not configured yet. Add your Google OAuth client ID, client secret, and callback URL to <code>.env.local</code>, then restart the development server.
            </p>
          )}
          <a
            href={`/api/auth/google/start?next=${encodeURIComponent(typeof query?.next === "string" ? query.next : "/cart")}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Continue with Google
          </a>
          <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />or use your name<span className="h-px flex-1 bg-slate-200" />
          </div>
          <form action={signIn} className="space-y-4">
          <input type="hidden" name="next" value={query?.next ?? "/cart"} />
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Your name</span>
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
            Create account / Sign in
          </button>
          <p className="text-sm text-slate-500">
            <Link href="/menu" className="inline-flex min-h-11 items-center underline underline-offset-2">Browse the menu</Link> without signing in.
          </p>
          </form>
        </div>
      )}
    </main>
  );
}
