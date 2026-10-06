# PrimeHeritage Foods & Catering Services

A mobile-first, agile fast food ordering and catering services platform tailored for **PrimeHeritage Foods & Catering Services**, serving customers within the **Ikorodu, Lagos** vicinity.

- **Kitchen Anchor**: `6.613065° N, 3.541461° E` (Ikorodu Central Axis, Lagos)
- **WhatsApp Dispatch Hotline**: `09026875420` (+2349026875420)
- **Currency**: Nigerian Naira (₦ / NGN)
- **Payment Gateway**: Paystack
- **Mobile Experience**: Installable Progressive Web App (PWA)

---

## 🍽 The 4 Core Pages (Agile Launchpad)

1. **Storefront Home (`/`)**:
   - Hero banner with quick conversion CTAs.
   - Interactive Ikorodu vicinity delivery checker with GPS and landmark detection.
   - Top 4 signature hits with 1-click cart addition.
   - Catering services teaser.
   - Download mobile app PWA prompt.
   - "Coming Soon" badges for future loyalty features.

2. **Food Menu & Ordering (`/menu`)**:
   - Category filtering (*Rice & Combos, Grills & Asun, Fast Bites & Chops, Refreshing Drinks*).
   - Live search bar.
   - Food item customization modal (protein choice, extra dodo, coleslaw, special kitchen notes).
   - Sticky mobile bottom cart bar.

3. **Catering Services (`/catering`)**:
   - 3 curated catering tiers (*Mini Heritage Box, Celebration Feast, Grand Banquet*).
   - Interactive guest headcount slider (15–500 guests) with dynamic real-time budget calculation.
   - Formal booking inquiry form with direct WhatsApp quotation dispatch.

4. **Checkout & Order Dispatch (`/checkout`)**:
   - Delivery vs. Store Pickup selector.
   - Distance calculation from kitchen coordinates with 18km freshness enforcement.
   - Out-of-radius WhatsApp courier booking fallback.
   - Paystack Inline online payment.
   - Automatic WhatsApp order ticket formatting and dispatch to `+2349026875420`.
   - On-screen receipt confirmation.

---

## 🚚 Precision Distance Delivery Engine

- **Base Fee**: `₦800` (covers up to `2.0 km`).
- **Per-Km Rate**: `₦200 / km` for distances beyond 2.0 km (rounded up to the next full km).
- **Freshness Cut-off**: `18.0 km`.
- **Out-of-Radius Handler**: If distance $> 18.0$ km, online checkout is disabled with:
  > *"Delivery distance exceeds our 18km kitchen freshness limit. Contact us on WhatsApp for special courier booking."*
  with a direct 1-tap WhatsApp consultation button.
- **Store Pickup**: `₦0` (always available).

---

## 🔒 Security Architecture

- **Server-Side Paystack Verification (`/api/paystack/verify`)**: Secret key isolated on server; validates transaction reference and verifies amount paid in Kobo (`₦1 = 100 kobo`).
- **Backend Vicinity Guard (`/api/orders`)**: Enforces 18km cut-off before logging orders.
- **Supabase Database Schema (`supabase/schema.sql`)**: Row-Level Security (RLS) policies protecting customer personal information.
- **HTTP Security Headers (`next.config.ts`)**: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

---

## 🛠 Local Setup & Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🚀 Vercel Deployment Guide

1. Push your code to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Ensure **Root Directory** is set to `./` (default).
4. Ensure **Output Directory Override** is turned **OFF** (Next.js automatically outputs to `.next`).
5. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_PAYSTACK_KEY`
   - `PAYSTACK_SECRET_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **Deploy**.
