"use server";

import { redirect } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
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

function matchesSecret(provided, expected) {
  if (typeof provided !== "string" || typeof expected !== "string") return false;
  const providedBytes = Buffer.from(provided);
  const expectedBytes = Buffer.from(expected);
  return providedBytes.length === expectedBytes.length && timingSafeEqual(providedBytes, expectedBytes);
}

export async function signInAsAdmin(formData) {
  const username = formData.get("username");
  const password = formData.get("password");
  const configuredUsername = process.env.ADMIN_USERNAME;
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.SESSION_SECRET;

  if (!configuredUsername || !configuredPassword || !sessionSecret || Buffer.byteLength(sessionSecret) < 32) {
    redirect("/admin/login?error=setup-required");
  }

  if (!matchesSecret(username, configuredUsername) || !matchesSecret(password, configuredPassword)) {
    redirect("/admin/login?error=invalid-credentials");
  }

  await startSession(configuredUsername, undefined, "local-admin@addiseats.invalid", "admin");
  redirect("/admin");
}

export async function signOut() {
  await endSession();
  redirect("/account?signedOut=1");
}
