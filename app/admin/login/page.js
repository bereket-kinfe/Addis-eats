import Link from "next/link";
import { signInAsAdmin } from "@/app/account/actions";

export const metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }) {
  const query = await searchParams;
  return (
    <main className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Addis Eats</p>
      <h1 className="mt-2 text-3xl font-black text-slate-900">Admin sign in</h1>
      <p className="mt-2 text-slate-600">Enter your administrator username and password to open the dashboard.</p>
      {query?.error === "invalid-credentials" && <p role="alert" className="mt-4 text-sm font-semibold text-red-700">Those admin credentials were not accepted.</p>}
      <form action={signInAsAdmin} className="mt-6 space-y-4">
        <label className="block"><span className="mb-1 block text-sm font-semibold text-slate-700">Username</span><input name="username" autoComplete="username" required className="min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="block"><span className="mb-1 block text-sm font-semibold text-slate-700">Password</span><input name="password" type="password" autoComplete="current-password" required className="min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <button className="min-h-11 w-full rounded-lg bg-sky-800 px-4 py-2 font-bold text-white hover:bg-sky-900">Open dashboard</button>
      </form>
      <Link href="/menu" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-slate-600 underline">Back to menu</Link>
    </main>
  );
}
