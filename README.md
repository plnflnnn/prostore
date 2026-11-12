# Prostore

A full-stack eCommerce store built with Next.js. Shoppers can browse products, search and filter, check out with PayPal, Stripe, or cash on delivery, leave reviews, and track orders. Admins can manage products, users, and orders, and see sales on the overview dashboard.

This app follows the [Next.js Ecommerce Coursera course](https://www.coursera.org/) and is updated for a newer stack: Next.js 16 App Router, Auth.js, Prisma 6 on Neon, and current PayPal / Stripe / React Email APIs.

## Features

- Catalog, search, categories, ratings, and featured product carousel
- Cart, shipping, payment method, and place-order flow
- PayPal, Stripe, and cash-on-delivery
- Auth.js credentials sign-in / sign-up (user and admin roles)
- Product reviews
- User profile and order history
- Admin products, users, orders, and monthly sales
- Image uploads with UploadThing
- Purchase receipt email with Resend

## Stack

- **Next.js 16** (App Router, Cache Components, Turbopack)
- **React 19** and **TypeScript**
- **Prisma 6** with **Neon**
- **Auth.js** (NextAuth v5)
- **shadcn/ui** (Base UI)
- **PayPal**, **Stripe**, **UploadThing**, **Resend**, **React Email**
- **Tailwind CSS 4**

## Getting started

```bash
npm install
```

Copy `.env` (or `.env.example` if you have one) and set at least:

- `DATABASE_URL`
- Auth secret and `NEXTAUTH_URL` / `AUTH_SECRET`
- `NEXT_PUBLIC_SERVER_URL` (default `http://localhost:3000`)
- PayPal, Stripe, UploadThing, and Resend keys as needed

Generate the client, migrate, and seed sample products and users:

```bash
npx prisma generate
npx prisma migrate deploy
npx tsx db/seed.ts
```

Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script          | Description                                                                |
| --------------- | -------------------------------------------------------------------------- |
| `npm run dev`   | Next.js development server                                                 |
| `npm run build` | Prisma generate + production build                                         |
| `npm run start` | Production server                                                          |
| `npm run lint`  | ESLint                                                                     |
| `npm test`      | Jest                                                                       |
| `npm run email` | Purchase-receipt preview at [http://localhost:3001](http://localhost:3001) |

You can also open `/email-preview` while `npm run dev` is running.

## Project layout

- `app/` — routes (shop, auth, user, admin, Stripe webhook)
- `components/` — storefront UI and shared pieces
- `lib/actions/` — server actions (products, cart, orders, users, reviews)
- `prisma/` — schema and migrations
- `email/` — React Email purchase receipt
- `db/` — Prisma client, seed, sample data
