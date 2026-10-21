import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { GOOGLE_STATE_COOKIE } from "@/lib/session-constants";
import { getSafeReturnPath } from "@/lib/redirects";
import { getGoogleOAuthConfig } from "@/lib/google-oauth";

export async function GET(request) {
  const config = getGoogleOAuthConfig(request.url);
  if (!config) {
    return NextResponse.redirect(new URL("/account?error=google-not-configured", request.url));
  }

  const state = randomBytes(32).toString("base64url");
  const next = getSafeReturnPath(request.nextUrl.searchParams.get("next") || "/account");
  const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizationUrl.search = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  }).toString();

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set(GOOGLE_STATE_COOKIE, `${state}:${encodeURIComponent(next)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/google/callback",
    maxAge: 600,
  });
  return response;
}
