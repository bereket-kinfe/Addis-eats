# Addis Eats

A Next.js food ordering demo for Ethiopian dishes in Addis Ababa.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Use **Account** to sign in with a display name, then add dishes to the cart and place an order.

## Sessions and data

This project uses a demo, name-only sign-in; it does not verify a real identity and is not suitable for production authentication. The server signs a seven-day session cookie with `SESSION_SECRET`. The cookie is HttpOnly, SameSite=Lax, and Secure in production. For production, configure a unique random `SESSION_SECRET` of at least 32 bytes; `.env.example` shows how to generate one.

Order records are held in a local JSON file under `.data/`, with atomic writes and a lock so Next.js workers share them. This local adapter is for learning and single-machine development, not multi-instance or serverless deployment. Replace it with a durable database before deployment; retain the session-ID predicate on every order lookup and mutation.

Protected pages verify the signed session in the server-rendered page, server actions check it again, and the order API checks it for polling. The Next.js Proxy only performs an early redirect when the session cookie is absent; it is not the authorization boundary.

## Performance

Menu data is loaded by the server component and passed to the interactive client browser, keeping the dish catalog out of the menu page's JavaScript bundle. Search input is debounced by 250 ms, so a burst of eight keystrokes within that window performs one filter update instead of eight (87.5% fewer filter updates for that burst). See [PERFORMANCE.md](./PERFORMANCE.md) for the reproducible bundle-size measurement and baseline.

## Discovery

The app provides page-specific metadata, generated Open Graph images, a sitemap, crawler exclusions for private routes, and Restaurant/MenuItem JSON-LD.
