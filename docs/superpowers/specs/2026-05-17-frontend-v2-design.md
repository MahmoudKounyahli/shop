# Maison Frontend v2 — Design Spec

**Date:** 2026-05-17  
**Status:** Approved  
**Style reference:** ZARA (minimal, black & white, generous whitespace)

---

## Overview

Extend the existing Angular shop frontend to align with the backend data model. Add user authentication, account management, wishlist, product variants with color selectors, and product reviews. All new TypeScript model properties must be in English.

Auth state is mocked with an Angular signal service (no real backend calls yet). All service methods are structured as `Observable`-based so they can be replaced with HTTP calls when the backend is ready.

**CartItem breaking change:** The existing `CartItem` model changes from `{ product, size, quantity }` to `{ variantId, product, variant, quantity }`. `CartService` must be updated accordingly.

**Guest wishlist:** Stored in `WishlistService` signal (in-memory). No persistence across page reloads for guests — this is acceptable for v2.

---

## 1. TypeScript Models

### `core/models/product.model.ts` — replace existing

```ts
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  parentCategoryId?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  color: string;       // e.g. "Sand Beige"
  colorHex: string;    // e.g. "#c8b89a"
  size: Size;
  price: number;
  stock: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  variantId?: string;  // if null, shared across all variants
  imageUrl: string;
  isMain: boolean;
}

export interface Product {
  id: string;
  brandId: string;
  brand?: Brand;
  categoryId: string;
  category?: Category;
  name: string;
  description: string;
  materialInfo?: string;
  careInstructions?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  isNew?: boolean;
  averageRating?: number;
  reviewCount?: number;
}
```

### `core/models/user.model.ts` — new

```ts
export type AddressType = 'shipping' | 'billing';

export interface Address {
  id: string;
  userId: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
  type: AddressType;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationDate: string;
  addresses?: Address[];
}
```

### `core/models/order.model.ts` — new

```ts
export type OrderStatus = 'received' | 'paid' | 'shipped' | 'delivered' | 'returned';

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  priceAtPurchase: number;  // snapshot — must not change if product price changes
}

export interface Order {
  id: string;
  userId: string;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddressId: string;
  billingAddressId: string;
  items: OrderItem[];
}
```

### `core/models/review.model.ts` — new

```ts
export interface Review {
  id: string;
  userId: string;
  productId: string;
  stars: number;        // 1–5
  comment: string;
  createdAt: string;
  userName?: string;    // denormalized for display
}
```

### `core/models/wishlist.model.ts` — new

```ts
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
}
```

### `core/models/cart.model.ts` — update

Replace `Product` reference with `ProductVariant`:

```ts
export interface CartItem {
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}
```

---

## 2. Services

All services use `Observable<T>` with mock data. Replace `of(...)` with `http.get(...)` when backend is ready.

| Service | File | Responsibilities |
|---|---|---|
| `AuthService` | `core/services/auth.service.ts` | `currentUser` signal, `login()`, `register()`, `loginWithGoogle()`, `logout()`, `isLoggedIn` computed |
| `UserService` | `core/services/user.service.ts` | `getAddresses()`, `addAddress()`, `updateProfile()` |
| `OrderService` | `core/services/order.service.ts` | `getOrders()`, `placeOrder()` |
| `WishlistService` | `core/services/wishlist.service.ts` | `items` signal, `add()`, `remove()`, `isInWishlist()`, `count` computed |
| `ReviewService` | `core/services/review.service.ts` | `getByProduct()`, `submit()` |
| `ProductService` | `core/services/product.service.ts` | existing — expand mock data with variants, brands, images |

---

## 3. New Pages

### `/auth` — Login & Register

**Route:** `/auth`  
**Guard:** redirect to `/account` if already logged in.

**Layout:** ZARA two-panel side-by-side (desktop), stacked (mobile).

- **Left panel — "I already have an account"**
  - Email input
  - Password input
  - "Log in" button (black, full-width)
  - "Forgot your password?" link
  - Divider "or"
  - "Continue with Google" button (with Google icon)

- **Right panel — "I don't have an account yet"**
  - Benefit list (track orders, save addresses, wishlist, faster checkout)
  - First name, Last name, Email, Password inputs
  - "Create Account" button (black, full-width)
  - Divider "or"
  - "Sign up with Google" button

**Error states:** Inline error text below each invalid field on submit.

---

### `/account` — My Account

**Route:** `/account`  
**Guard:** redirect to `/auth` if not logged in.

**Layout:** Sidebar left (200px) + content area right.

Sidebar links:
1. **My Orders** (default view)
2. **My Addresses**
3. **Personal Data**
4. **Wishlist** (shortcut to `/wishlist`)
5. **Log out** (bottom, muted)

Greeting at top of sidebar: "Hello, [firstName]" + email.

**My Orders view:**
- List of orders, each row: order number, date, item count, total, status badge
- Status badge values: Received / Paid / Shipped / Delivered / Returned
- Empty state: "No orders yet"

**My Addresses view:**
- Cards showing saved addresses (type label: Shipping / Billing)
- Edit link on each card
- "Add new address" button (ghost)
- Add/edit opens an inline form within the card area

**Personal Data view:**
- First name, last name, email fields (pre-filled)
- "Save changes" button

---

### `/wishlist` — Wishlist

**Route:** `/wishlist`

**Layout:** Same product card grid as PLP (4 cols desktop, 2 cols mobile).

Each card:
- Heart icon filled (remove from wishlist on click)
- "Move to Bag" button (opens size selector → adds to cart)
- Brand name, product name, price

Empty state: "Your wishlist is empty" + "Start Shopping" CTA link to `/`.

---

## 4. Updated Pages & Components

### Navbar (`shared/components/navbar`)

Right side icons (left to right):
1. **Person icon** → `/auth` if logged out, `/account` if logged in. No badge.
2. **Heart icon** → `/wishlist`. Badge shows wishlist count if > 0.
3. **Bag icon** (existing "Bag" text replaced with SVG icon). Badge stays.

Mobile menu: add Account and Wishlist links.

---

### Product Card (`shared/components/product-card`)

New additions:
- **Heart icon** top-right corner of image. Toggles wishlist (filled/outline). For guests: adds to local wishlist, prompts login on next visit.
- **Brand name** in small uppercase text above product name.
- **Star rating** (e.g. `★★★★☆ (12)`) below price, only if `reviewCount > 0`.

---

### Product Detail Page (`pages/product-detail`)

**Color selector** (new, above size selector):
- Label: "Color" + selected color name
- Row of color circle swatches (28px circles, `border-radius: 50%`)
- Active swatch: black ring border
- Selecting a color updates the main image gallery to show images for that variant

**Size selector** (updated):
- Sizes now come from `product.variants` filtered by selected color
- Sold-out sizes shown with strikethrough and `cursor: not-allowed`

**Add to Wishlist button** (new, below "Add to Bag"):
- Ghost button with heart icon
- Toggles: "Add to Wishlist" / "Remove from Wishlist"

**Accordion** (updated):
- Existing: "Details", "Delivery & Returns"
- New: "Material & Care" — shows `materialInfo` and `careInstructions`

**Reviews section** (new, below accordion):
- Average star rating + total count
- List of reviews: star rating, comment, date, user first name
- "Write a review" button → inline form (stars selector + textarea + submit)
- Requires login: if guest clicks "Write a review", redirect to `/auth`

---

### Checkout (`pages/checkout`)

**If logged in:**
- Show saved addresses as selectable radio cards (shipping address step)
- "Use a new address" option expands the existing form
- Email field pre-filled from `AuthService.currentUser`

**If guest:**
- Existing form unchanged

**Order placement:**
- Cart items saved as `OrderItem[]` with `priceAtPurchase` snapshot
- Cart cleared after successful order

---

## 5. Auth Guard

Create `core/guards/auth.guard.ts`:
- `canActivate`: checks `AuthService.isLoggedIn`
- If false: redirects to `/auth` with `returnUrl` query param
- After successful login, redirect back to `returnUrl`

Apply to: `/account`

---

## 6. Route Map

```
/                          → Home
/products/:category        → Product Listing
/products/:category/:id    → Product Detail
/cart                      → Cart
/checkout                  → Checkout
/order-confirmation        → Order Confirmation
/auth                      → Login & Register        (NEW)
/account                   → My Account              (NEW — guarded)
/wishlist                  → Wishlist                (NEW)
```

---

## 7. Out of Scope

- Real authentication (JWT, OAuth tokens) — mocked only
- Real Google OAuth flow — button shown, logs in with mock user
- Payment processing
- Search
- Pagination
- Stock management UI (show in/out of stock only)
- Admin panel
