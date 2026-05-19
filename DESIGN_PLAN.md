# Clothes Shop — Frontend Design Plan

## Overview
A minimal, editorial e-commerce site for clothes. Inspired by ZARA's clean aesthetic — simple layouts, strong typography, lots of whitespace. Tone is calm and confident.

---

## Tech Stack
- **Framework:** Angular (latest)
- **Styling:** Tailwind CSS
- **Data:** Mock/static JSON (no backend)
- **Routing:** Angular Router
- **State:** Angular signals or a simple service for cart state

---

## Design System

### Colors
| Token | Value |
|---|---|
| Background | `#ffffff` |
| Surface | `#f5f5f5` |
| Text primary | `#000000` |
| Text muted | `#6b6b6b` |
| Border | `#e0e0e0` |
| Accent | `#000000` |

Black and white only. No color accents.

### Typography
- **Body / UI:** Sans-serif — `Inter` or system-ui
- **Display / Hero:** Serif — `Playfair Display` or similar (for headlines only)
- Scale: standard Tailwind type scale (`text-sm`, `text-base`, `text-xl`, `text-4xl`, etc.)

### Spacing & Layout
- Max content width: `max-w-7xl`, centered
- Page padding: `px-6` on mobile, `px-12` on desktop
- Generous whitespace between sections — let the product breathe
- All sizing and spacing must use Tailwind tokens only — no hardcoded pixel values anywhere

### Components (shared)
- **Navbar:** Logo (centered or left), nav links (Women / Men / New In), cart icon with item count
- **Footer:** Simple — brand name, a few links, copyright
- **Button:** Two variants — filled black (`bg-black text-white`) and ghost (`border border-black`)
- **Badge:** Small pill for "New" or "Sale" labels

---

## Pages

### 1. Home / Landing
**Goal:** Make a strong first impression, direct users to collections.

**Sections:**
1. **Hero** — Full-width image (or tall banner), one headline, one CTA button ("Shop Now")
2. **Featured Categories** — 2–3 image tiles side by side (Women, Men, Accessories) with label overlays
3. **New Arrivals** — Horizontal product card row (4 cards), "View All" link
4. **Editorial Banner** — Full-width text-over-image strip ("New Collection — SS25")

**Notes:**
- All images are placeholder/mock
- Classy/luxury, but calm and confident, full-with carousel/slider.

---

### 2. Product Listing Page (PLP)
**Route:** `/products/:category`

**Goal:** Browse products in a category with basic filtering.

**Layout:**
- Page title (e.g. "Women") top-left, product count top-right
- **Filters sidebar (desktop) / filter bar (mobile):**
  - Size (XS, S, M, L, XL)
  - Price range (Low–High toggle)
  - Sort: Newest / Price asc / Price desc
- **Product grid:** 2 cols on mobile, 4 cols on desktop
- Each **Product Card:**
  - Image (square or portrait crop)
  - Product name
  - Price
  - "New" badge if applicable
  - Hover: slight image zoom (CSS only)

**Notes:**
- Mock data: ~12 products per category
- No pagination for v1 — show all items

---

### 3. Product Detail Page (PDP)
**Route:** `/products/:category/:id`

**Goal:** Show the product and let the user add it to cart.

**Layout (2-column on desktop):**
- **Left:** Image gallery — one large image, 2–3 thumbnail images below
- **Right:**
  - Product name (large)
  - Price
  - Short description (1–2 sentences)
  - **Size selector:** pill buttons (XS / S / M / L / XL), one selectable at a time
  - **Add to Cart** button (full width, filled black)
  - Accordion sections: "Details", "Delivery & Returns" (collapsed by default)

**Notes:**
- No zoom on image for v1
- Size selection required before add-to-cart (show inline error if not selected)

---

### 4. Cart & Checkout
**Routes:** `/cart`, `/checkout`

#### Cart page (`/cart`)
- List of cart items: image thumbnail, name, size, price, quantity stepper, remove button
- Order summary panel (right on desktop, bottom on mobile): subtotal, shipping note ("Free shipping over $100"), total, "Proceed to Checkout" button
- Empty state: message + "Continue Shopping" link

#### Checkout page (`/checkout`)
- Simple single-page form (no steps/stepper for v1):
  - Contact: email
  - Shipping: name, address, city, postal code, country
  - Payment: card number, expiry, CVV (UI only — no real payment)
- Order summary sidebar (same as cart panel)
- "Place Order" button → navigates to a simple confirmation screen ("Thank you for your order!")

**Notes:**
- No real payment processing
- Form validation with Angular reactive forms

---

## Routing Map
```
/                          → Home
/products/:category        → PLP (e.g. /products/women)
/products/:category/:id    → PDP
/cart                      → Cart
/checkout                  → Checkout
/order-confirmation        → Thank you page
```

---

## Mock Data Shape

```ts
interface Product {
  id: string;
  name: string;
  category: 'women' | 'men' | 'accessories';
  price: number;
  images: string[];      // placeholder URLs
  sizes: string[];
  isNew?: boolean;
  description: string;
}
```

Cart state is held in a singleton Angular service (no persistence for v1).

---

## What's Out of Scope (v1)
- User accounts / login
- Wishlist
- Search
- Real payment
- Backend / API calls
- Animations beyond simple CSS transitions
- Mobile nav drawer (use a simple hamburger toggle)

---

All functionality should be backend based (like filtering, search, etc..) So we can just mock them in the frontend, but using the frontend impl only as a placeholder and should be easily replaceable with backend (api calls).