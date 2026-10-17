"use server";

import { redirect } from "next/navigation";
import { endSession, startSession } from "@/lib/session";

export async function signInAsAdmin(formData) {
  const { timingSafeEqual } = await import("node:crypto");
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const expectedUsername = process.env.ADMIN_USERNAME || "";
  const expectedPassword = process.env.ADMIN_PASSWORD || "";
  const sessionSecret = process.env.SESSION_SECRET || "";
  const matches = (actual, expected) => {
    const actualBuffer = Buffer.from(actual);
    const expectedBuffer = Buffer.from(expected);
    return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
  };

  if (!expectedUsername || !expectedPassword || Buffer.byteLength(sessionSecret) < 32) {
    redirect("/admin/login?error=setup-required");
  }

  if (!matches(username, expectedUsername) || !matches(password, expectedPassword)) {
    redirect("/admin/login?error=invalid-credentials");
  }

  await startSession(username, null, "local-admin@addiseats.invalid", "admin");
  redirect("/admin");
}

export async function signOut() {
  await endSession();
  redirect("/account?signedOut=1");
}
