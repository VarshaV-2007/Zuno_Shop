# ZUNO

**Everyday essentials, delivered warm.** ZUNO is a premium 10-minute grocery and lifestyle e-commerce experience — fresh produce, dairy, pantry staples, personal care, beauty, home essentials and baby care, curated for Indian homes.

Built on **TanStack Start**, **React 19**, **Tailwind CSS v4** and **Vite 7**.

## Highlights

- Warm, minimal design system (cream + ink + terracotta) with Instrument Serif + Inter typography.
- 32 unique products across 8 categories, each with its own consistent studio product image.
- Curated "Shop by Moment" collections (Morning Start, Movie Night, Quick Dinner, Self Care, Home Reset, Weekend Ready).
- Full commerce loop: search · category · product · wishlist · cart · checkout · confirmation.
- Persistent cart, wishlist and recents via `localStorage`.
- Mobile-first with dedicated 360–390px layouts, sticky delivery strip, and thumb-safe controls.
- INR pricing, MRP discounts, free delivery over ₹199, delivery ETAs per product.
- SEO-ready `head()` metadata on every route.

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:8080

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the built app

## Project structure

```
src/
  assets/               # Category, moment and product imagery
  components/           # Header, Footer, ProductCard, CartSheet, WishlistSheet, SearchOverlay
    ui/                 # shadcn/ui primitives
  data/catalog.ts       # Products, categories, collections + helpers
  store/shop.tsx        # Cart / wishlist / recents context
  routes/               # TanStack Router file-based routes
  styles.css            # Tailwind v4 theme + tokens
```

## Tech stack

- TanStack Start v1 + TanStack Router (file-based)
- React 19
- Tailwind CSS v4 (CSS-first, `@theme` tokens)
- shadcn/ui primitives (Radix under the hood)
- Lucide icons, Sonner toasts

## Deployment

Deployable to any edge runtime (Cloudflare Workers, Vercel Edge). All product data ships client-side — swap `src/data/catalog.ts` for an API/DB when you're ready.

## License

MIT — see [LICENSE](./LICENSE).
