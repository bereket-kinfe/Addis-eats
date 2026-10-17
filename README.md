# Addis Eats

A Next.js food ordering demo for Ethiopian dishes in Addis Ababa.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Configure Google OAuth below, then use **Account** to create a customer identity or sign in with Google. Then add dishes to the cart and place an order.

## Google sign-in

Create an OAuth 2.0 Web application client in Google Cloud Console. Add `http://localhost:3000/api/auth/google/callback` as an authorized redirect URI for local development, then set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, and `SESSION_SECRET` in `.env.local` (see `.env.example`). Set `ADMIN_EMAILS` to a comma-separated allowlist of verified Google account emails that may access `/admin`. For Vercel, set `GOOGLE_REDIRECT_URI` to `https://your-domain/api/auth/google/callback` and register that exact HTTPS URL in Google Cloud Console. Redirect URIs must match exactly, including scheme, host, path, and trailing slash. Use your stable custom domain for production; every preview hostname would need to be registered separately. Google sign-in verifies OAuth state and the Google profile. The stable Google `sub` identifies returning customers, so the app associates their sessions and orders with the same identity.

## Sessions and data

Customer sign-in uses Google OAuth. The server signs a seven-day session cookie with `SESSION_SECRET`. The cookie is HttpOnly, SameSite=Lax, and Secure in production. Configure a unique random `SESSION_SECRET` of at least 32 bytes; `.env.example` shows how to generate one. Google profile identity is represented in the signed session and used to link orders; this demo does not keep a separate customer profile table.

Order records are held in a local JSON file under `.data/`, with atomic writes and a lock so Next.js workers share them. This local adapter is for learning and single-machine development, not multi-instance or serverless deployment. Replace it with a durable database before deployment; retain the session-ID predicate on every order lookup and mutation.

Protected pages verify the signed session in the server-rendered page, server actions check it again, and the order API checks it for polling. The Next.js Proxy only performs an early redirect when the session cookie is absent; it is not the authorization boundary.

### Vercel setup

For the demo admin username/password flow, add `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and a unique `SESSION_SECRET` (at least 32 characters) in Vercel Project Settings → Environment Variables. Apply them to each environment you use, then redeploy so the function runtime receives the values. To use Google as the admin sign-in instead, configure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` with the deployed HTTPS callback URL, `ADMIN_EMAILS`, and `SESSION_SECRET`. The callback URL must also be registered in Google Cloud Console.

Customer identity is verified with Google, but the demo has no separate customer profile database. Menu edits are kept in that browser's local storage, and orders are written to `.data/`. Vercel functions have ephemeral local storage, so menu and order records are not durable or shared between deployments/instances. A production launch that needs persistent profiles, menu changes, and orders requires a hosted database.

## Performance

Menu data is loaded by the server component and passed to the interactive client browser, keeping the dish catalog out of the menu page's JavaScript bundle. Search input is debounced by 250 ms, so a burst of eight keystrokes within that window performs one filter update instead of eight (87.5% fewer filter updates for that burst). See [PERFORMANCE.md](./PERFORMANCE.md) for the reproducible bundle-size measurement and baseline.

## Discovery

The app provides page-specific metadata, generated Open Graph images, a sitemap, crawler exclusions for private routes, and Restaurant/MenuItem JSON-LD.
