import Link from "next/link";
import { getSession } from "@/lib/session";
import { signOut } from "./actions";
import { isAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage({ searchParams }) {
  const session = await getSession();
  const query = await searchParams;

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-xl rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
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
            Create your customer account or sign in securely with Google. Returning customers use the same Google account to access their account and orders.
          </p>
          {query?.signedOut === "1" && (
            <p role="status" className="text-sm text-slate-600">You have signed out.</p>
          )}
          {query?.error === "google-not-configured" && (
            <p role="alert" className="text-sm font-medium text-red-700">
              Google sign-in is not configured yet. Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and SESSION_SECRET (at least 32 characters) to your environment. Set GOOGLE_REDIRECT_URI to this site&apos;s exact HTTPS callback URL and register that same URL in Google Cloud Console.
            </p>
          )}
          {query?.error === "google-sign-in" && (
            <p role="alert" className="text-sm font-medium text-red-700">
              Google sign-in did not finish. Check that this website&apos;s callback URL exactly matches the authorized redirect URI in Google Cloud Console, then try again.
            </p>
          )}
          <a
            href={`/api/auth/google/start?next=${encodeURIComponent(typeof query?.next === "string" ? query.next : "/account")}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Create account or continue with Google
          </a>
          <p className="text-sm text-slate-500">
            Your Google account is used only to verify your identity. <Link href="/menu" className="inline-flex min-h-11 items-center underline underline-offset-2">Browse the menu</Link> without signing in.
          </p>
        </div>
      )}
    </main>
  );
}
