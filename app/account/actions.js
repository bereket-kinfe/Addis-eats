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

export async function signInAsAdmin(formData) {
  const { timingSafeEqual } = await import("node:crypto");
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const expectedUsername = process.env.ADMIN_USERNAME || "";
  const expectedPassword = process.env.ADMIN_PASSWORD || "";
  const matches = (actual, expected) => {
    const actualBuffer = Buffer.from(actual);
    const expectedBuffer = Buffer.from(expected);
    return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
  };

  if (!expectedUsername || !expectedPassword || !matches(username, expectedUsername) || !matches(password, expectedPassword)) {
    redirect("/admin/login?error=invalid-credentials");
  }

  await startSession(username, null, "local-admin@addiseats.invalid", "admin");
  redirect("/admin");
}

export async function signOut() {
  await endSession();
  redirect("/account?signedOut=1");
}
