# MOYA SmartRoute

MOYA is a responsive cross-border remittance demonstration focused on transparent route comparison for African corridors.

> **Demonstration only:** provider quotes, exchange rates, transaction statuses, and blockchain proof references are fictional or simulated. No real money moves and no XRP Ledger transaction is submitted.

## Product walkthrough

1. Open `/` to explore MOYA's landing page, product promise, and first corridor.
2. Create an account or sign in at `/auth`. Email confirmation is required for email signups; the signup page explains the confirmation state.
3. Add a Zimbabwe recipient under **Recipients**.
4. On **Send money**, keep the R2,000 Cape Town → Harare example, choose a payout method, and compare eligible demo routes.
5. Select a route to save a private demo transfer. Advance its status in **Tracking**, create a simulated proof reference, or add purpose-payment instructions.

## Implemented surfaces

- Home page and email/Google/Lovable sign-in.
- Owner-scoped dashboard, profile, and recipient management.
- Cross-border comparison: three fictional provider quotes plus an unavailable quote used to exercise filtering.
- Transparent, deterministic normalized route scoring with balanced, cheapest, fastest, and reliable preferences.
- Persisted demo transfers, recipient history, status tracking, allocation instructions, and simulated blockchain reference records.
- Responsive navigation, transaction search and filters, validation, loading/empty states, and per-route metadata.

## Technology

- TanStack Start, React, TypeScript, Tailwind CSS v4, Lucide icons.
- Lovable Cloud authentication and Postgres with row-level security.
- Browser-side provider quote model for the isolated MVP; all saved records are scoped to the signed-in user.

## Local development

Use the Lovable preview or a locally configured Lovable Cloud environment. Install dependencies with Bun (`bun install`) and start the development server with `bun run dev`.

Run focused domain tests with:

```sh
bunx vitest run src/test/smartroute.test.ts src/test/app-routing.test.tsx
```

## Demo data and credentials

Provider quotes are generated from literal demo values in the source and labelled accordingly. There is no shared demo password or seeded user; create an account in the app, confirm its email, and sign in. Your recipients and transactions are stored under your own account.

## Integration boundaries

No Spring Boot API, payment-provider connection, live exchange-rate feed, or XRP Ledger submission has been implemented. The MVP uses Lovable Cloud for sign-in and persistence and a local deterministic route scorer; its blockchain proof page explicitly labels generated references as simulations.