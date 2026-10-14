"use server";

import { redirect } from "next/navigation";
import { endSession, startSession } from "@/lib/session";

function getSafeReturnPath(value) {
  if (value === "/cart" || value === "/checkout" || value === "/orders") return value;
  if (typeof value === "string" && /^\/orders\/[a-f0-9-]+$/i.test(value)) return value;
  return "/cart";
}

export async function signIn(formData) {
  const rawName = formData.get("name");
  const name = typeof rawName === "string" ? rawName.trim() : "";

  if (name.length < 2 || name.length > 40 || /[\u0000-\u001f\u007f]/.test(name)) {
    redirect("/account?error=invalid-name");
  }

  await startSession(name);
  redirect(getSafeReturnPath(formData.get("next")));
}

export async function signOut() {
  await endSession();
  redirect("/account?signedOut=1");
}
