import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Product, ProductVariant, Size } from '../models/product.model';
import { env } from '../config/env';

// ── Backend DTO shapes ────────────────────────────────────────────────────────

interface ProductSummaryDto {
  id: number; name: string; brandName: string; categorySlug: string;
  mainImageUrl: string; minPrice: number; isNew: boolean;
}

interface ProductVariantDto {
  id: number; productId: number; sku: string; color: string;
  colorHex: string; size: string; price: number; stock: number;
}

interface CartItemDto {
  id: number;
  variant: ProductVariantDto;
  product: ProductSummaryDto;
  quantity: number;
}

// ── Mapper ────────────────────────────────────────────────────────────────────

function toCartItem(dto: CartItemDto): CartItem {
  const product: Product = {
    id: String(dto.product.id),
    brandId: dto.product.brandName.toLowerCase(),
    brand: { id: dto.product.brandName.toLowerCase(), name: dto.product.brandName },
    categoryId: dto.product.categorySlug,
    category: { id: dto.product.categorySlug, name: dto.product.categorySlug },
    name: dto.product.name,
    description: '',
    images: [{ id: `${dto.product.id}-img0`, productId: String(dto.product.id), imageUrl: dto.product.mainImageUrl, isMain: true }],
    variants: [],
    isNew: dto.product.isNew,
  };
  const variant: ProductVariant = {
    id: String(dto.variant.id),
    productId: String(dto.variant.productId),
    sku: dto.variant.sku,
    color: dto.variant.color,
    colorHex: dto.variant.colorHex,
    size: dto.variant.size as Size,
    price: Number(dto.variant.price),
    stock: dto.variant.stock,
  };
  return { variantId: String(dto.variant.id), product, variant, quantity: dto.quantity };
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private _items = signal<CartItem[]>([]);

  items = this._items.asReadonly();
  count = computed(() => this._items().reduce((sum, i) => sum + i.quantity, 0));
  subtotal = computed(() => this._items().reduce((sum, i) => sum + i.variant.price * i.quantity, 0));

  loadCart(): Observable<CartItem[]> {
    return this.http.get<CartItemDto[]>(`${env.apiUrl}/cart`).pipe(
      tap(dtos => this._items.set(dtos.map(toCartItem))),
      map(dtos => dtos.map(toCartItem)),
    );
  }

  add(product: Product, variant: ProductVariant): void {
    this.http
      .post<CartItemDto>(`${env.apiUrl}/cart/items`, { variantId: Number(variant.id), quantity: 1 })
      .subscribe(dto => {
        const item = toCartItem(dto);
        this._items.update(items => {
          const existing = items.find(i => i.variantId === item.variantId);
          if (existing) {
            return items.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i);
          }
          return [...items, item];
        });
      });
  }

  updateQuantity(variantId: string, quantity: number): void {
    if (quantity < 1) {
      this.remove(variantId);
      return;
    }
    this._items.update(items => items.map(i => i.variantId === variantId ? { ...i, quantity } : i));
    this.http
      .put<CartItemDto>(`${env.apiUrl}/cart/items/${variantId}`, { quantity })
      .subscribe();
  }

  remove(variantId: string): void {
    this._items.update(items => items.filter(i => i.variantId !== variantId));
    this.http.delete<void>(`${env.apiUrl}/cart/items/${variantId}`).subscribe();
  }

  clear(): void {
    this._items.set([]);
    this.http.delete<void>(`${env.apiUrl}/cart`).subscribe();
  }
}
