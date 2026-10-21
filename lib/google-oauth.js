const GOOGLE_CALLBACK_PATH = "/api/auth/google/callback";

export function getGoogleOAuthConfig(requestUrl) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const sessionSecret = process.env.SESSION_SECRET || "";

  if (!clientId || !clientSecret || Buffer.byteLength(sessionSecret) < 32) return null;

  const configuredRedirectUri = process.env.GOOGLE_REDIRECT_URI?.trim();
  let redirectUri;
  try {
    redirectUri = configuredRedirectUri
      ? new URL(configuredRedirectUri)
      : new URL(GOOGLE_CALLBACK_PATH, requestUrl);
  } catch {
    return null;
  }

  if (
    redirectUri.pathname !== GOOGLE_CALLBACK_PATH ||
    redirectUri.search ||
    redirectUri.hash ||
    redirectUri.username ||
    redirectUri.password ||
    (process.env.NODE_ENV === "production" && (!configuredRedirectUri || redirectUri.protocol !== "https:"))
  ) {
    return null;
  }

  return { clientId, clientSecret, redirectUri: redirectUri.toString() };
}
