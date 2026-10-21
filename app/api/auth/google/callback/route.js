import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { startSession } from "@/lib/session";
import { GOOGLE_STATE_COOKIE } from "@/lib/session-constants";
import { getSafeReturnPath } from "@/lib/redirects";
import { isAdminEmail } from "@/lib/admin-auth";
import { getGoogleOAuthConfig } from "@/lib/google-oauth";

function statesMatch(expected, actual) {
  if (!expected || !actual) return false;
  const expectedBytes = Buffer.from(expected);
  const actualBytes = Buffer.from(actual);
  return expectedBytes.length === actualBytes.length && timingSafeEqual(expectedBytes, actualBytes);
}

function accountError(request) {
  const response = NextResponse.redirect(new URL("/account?error=google-sign-in", request.url));
  response.cookies.set(GOOGLE_STATE_COOKIE, "", { path: "/api/auth/google/callback", maxAge: 0 });
  return response;
}

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookieValue = request.cookies.get(GOOGLE_STATE_COOKIE)?.value || "";
  const separatorIndex = cookieValue.indexOf(":");
  const expectedState = cookieValue.slice(0, separatorIndex);
  let next = "/account";
  try {
    if (separatorIndex >= 1) {
      next = getSafeReturnPath(decodeURIComponent(cookieValue.slice(separatorIndex + 1) || "%2Faccount"));
    }
  } catch {
    return accountError(request);
  }

  if (searchParams.has("error") || !code || separatorIndex < 1 || !statesMatch(expectedState, state)) {
    return accountError(request);
  }

  const config = getGoogleOAuthConfig(request.url);
  if (!config) {
    return NextResponse.redirect(new URL("/account?error=google-not-configured", request.url));
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });
    if (!tokenResponse.ok) return accountError(request);
    const tokens = await tokenResponse.json();
    if (typeof tokens.access_token !== "string") return accountError(request);

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
      cache: "no-store",
    });
    if (!profileResponse.ok) return accountError(request);
    const profile = await profileResponse.json();
    if (profile.email_verified !== true || typeof profile.email !== "string" || typeof profile.sub !== "string") {
      return accountError(request);
    }

    const email = profile.email.trim().toLowerCase();
    const name = (typeof profile.name === "string" ? profile.name.trim() : "").slice(0, 40) || email.split("@")[0].slice(0, 40) || "Customer";
    await startSession(name, profile.sub, email, isAdminEmail(email) ? "admin" : "customer");
    const response = NextResponse.redirect(new URL(next, request.url));
    response.cookies.set(GOOGLE_STATE_COOKIE, "", { path: "/api/auth/google/callback", maxAge: 0 });
    return response;
  } catch {
    return accountError(request);
  }
}
