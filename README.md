# Addis Eats

A Next.js food ordering demo for Ethiopian dishes in Addis Ababa.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Use **Account** to sign in with a display name, or configure Google OAuth below to continue with a Google account. Then add dishes to the cart and place an order.

## Google sign-in

Create an OAuth 2.0 Web application client in Google Cloud Console. Add `http://localhost:3000/api/auth/google/callback` as an authorized redirect URI, then set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI` in `.env.local` (see `.env.example`). Set `ADMIN_EMAILS` to a comma-separated allowlist of verified Google account emails that may access `/admin`. Admin status is assigned only during successful Google sign-in; display-name sign-in is always customer-only. For deployment, configure the exact HTTPS callback URL for that host. Google sign-in verifies the OAuth state and Google profile, and returning Google accounts keep access to orders associated with that account.

## Sessions and data

This project uses a demo, name-only sign-in; it does not verify a real identity and is not suitable for production authentication. The server signs a seven-day session cookie with `SESSION_SECRET`. The cookie is HttpOnly, SameSite=Lax, and Secure in production. For production, configure a unique random `SESSION_SECRET` of at least 32 bytes; `.env.example` shows how to generate one.

Order records are held in a local JSON file under `.data/`, with atomic writes and a lock so Next.js workers share them. This local adapter is for learning and single-machine development, not multi-instance or serverless deployment. Replace it with a durable database before deployment; retain the session-ID predicate on every order lookup and mutation.

Protected pages verify the signed session in the server-rendered page, server actions check it again, and the order API checks it for polling. The Next.js Proxy only performs an early redirect when the session cookie is absent; it is not the authorization boundary.

## Performance

Menu data is loaded by the server component and passed to the interactive client browser, keeping the dish catalog out of the menu page's JavaScript bundle. Search input is debounced by 250 ms, so a burst of eight keystrokes within that window performs one filter update instead of eight (87.5% fewer filter updates for that burst). See [PERFORMANCE.md](./PERFORMANCE.md) for the reproducible bundle-size measurement and baseline.

## Discovery

The app provides page-specific metadata, generated Open Graph images, a sitemap, crawler exclusions for private routes, and Restaurant/MenuItem JSON-LD.
