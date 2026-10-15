import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { SESSION_COOKIE } from "./session-constants";
import { isAdminSession } from "./admin-auth";

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

function getSigningSecret() {
  const secret = process.env.SESSION_SECRET;

  if (secret) {
    if (Buffer.byteLength(secret) < 32) {
      throw new Error("SESSION_SECRET must contain at least 32 bytes.");
    }
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be configured in production.");
  }

  return "local-development-session-secret-not-for-production";
}

function sign(value) {
  return createHmac("sha256", getSigningSecret()).update(value).digest("base64url");
}

export function createSessionToken(name, identityKey, email = null, role = "customer") {
  const sessionId = identityKey
    ? `google-${createHmac("sha256", getSigningSecret()).update(identityKey).digest("base64url")}`
    : randomUUID();
  const payload = Buffer.from(
    JSON.stringify({
      sessionId,
      name,
      email: typeof email === "string" ? email : null,
      role: role === "admin" ? "admin" : "customer",
      expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000,
    }),
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token) {
  if (typeof token !== "string") return null;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra !== undefined) return null;

  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (
      typeof session.sessionId !== "string" ||
      typeof session.name !== "string" ||
      !Number.isFinite(session.expiresAt) ||
      session.expiresAt <= Date.now()
    ) {
      return null;
    }

    return { ...session, email: typeof session.email === "string" ? session.email : null, role: session.role === "admin" ? "admin" : "customer" };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireSession(returnTo) {
  const session = await getSession();
  if (!session) {
    const query = returnTo ? `?next=${encodeURIComponent(returnTo)}` : "";
    redirect(`/account${query}`);
  }
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/account?next=%2Fadmin");
  if (!isAdminSession(session)) notFound();
  return session;
}

export async function startSession(name, identityKey, email = null, role = "customer") {
  const expires = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(name, identityKey, email, role), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
    expires,
  });
}

export async function endSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
