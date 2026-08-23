# Lit Perfumes

Luxury authorized-reseller perfume storefront — Ghana & West Africa.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind
- Zustand cart
- Paystack (GHS) + COD with stock reservation
- Resend email
- Supabase for products, variants, stock, and orders (with in-memory fallback when unset)

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Supabase keys, the app uses the seed catalog and in-memory orders (fine for local UI testing).

### Enable Supabase (recommended)

1. Create a Supabase project
2. Run the SQL in [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql) in the SQL editor
3. Set in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Seed the catalog:

```bash
npm run seed
```

5. Restart `npm run dev` — shop, checkout, and admin now persist.

Set `ADMIN_PASSWORD` then visit `/admin`. With Supabase connected, **Admin → Products** lets you create products and edit variant stock/prices (no code deploy).

## Hard rules (enforced)

1. **Stock reservation** — stock is reserved when an order is created; released on cancel/fail/expiry (45 min for unpaid Paystack). With Supabase, reservation uses `reserve_stock` / `release_stock` RPCs.
2. **Paid = verified** — UI shows “Payment received” only after webhook/verify (or demo complete). COD says “pay on delivery,” never “payment successful.”
3. **Demo checkout** — automatically **off** when Paystack secret + public keys are set. Demo only runs when keys are missing.

## Shipping defaults

- Flat GH₵75 · free over GH₵1,500
- Prices in **GHS** (Ghana & West Africa)
- COD max GH₵2,000 (`COD_MAX_GHS`)

## Scripts

- `npm run dev` — development
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint
- `npm run seed` — upsert seed products/variants into Supabase

## Go-live checklist

1. Apply Supabase migration + `npm run seed`
2. Add Paystack keys (demo checkout turns off automatically)
3. Point Paystack webhook to `/api/webhooks/paystack` (amount is verified)
4. Set Resend + `ADMIN_EMAIL`
5. Replace seed photography with client assets
6. Deploy on Vercel; set `NEXT_PUBLIC_SITE_URL` and all env vars
