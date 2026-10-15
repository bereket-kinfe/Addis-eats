"use server";

import { redirect } from "next/navigation";
import { endSession, startSession } from "@/lib/session";
import { getSafeReturnPath } from "@/lib/redirects";

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
