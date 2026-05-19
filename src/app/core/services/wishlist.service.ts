import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { Product, Size } from '../models/product.model';
import { WishlistItem } from '../models/wishlist.model';
import { env } from '../config/env';

// ── Backend DTO shapes ────────────────────────────────────────────────────────

interface ProductSummaryDto {
  id: number; name: string; brandName: string; categorySlug: string;
  mainImageUrl: string; minPrice: number; isNew: boolean;
  averageRating?: number | null; reviewCount?: number | null;
}

interface WishlistItemDto { id: number; product: ProductSummaryDto; }

// ── Mapper ────────────────────────────────────────────────────────────────────

function toWishlistItem(dto: WishlistItemDto): WishlistItem {
  const product: Product = {
    id: String(dto.product.id),
    brandId: dto.product.brandName.toLowerCase(),
    brand: { id: dto.product.brandName.toLowerCase(), name: dto.product.brandName },
    categoryId: dto.product.categorySlug,
    category: { id: dto.product.categorySlug, name: dto.product.categorySlug },
    name: dto.product.name,
    description: '',
    images: [{ id: `${dto.product.id}-img0`, productId: String(dto.product.id), imageUrl: dto.product.mainImageUrl, isMain: true }],
    variants: [{ id: `${dto.product.id}-v0`, productId: String(dto.product.id), sku: '', color: '', colorHex: '', size: 'M' as Size, price: dto.product.minPrice, stock: 0 }],
    isNew: dto.product.isNew,
    averageRating: dto.product.averageRating ?? undefined,
    reviewCount: dto.product.reviewCount ?? undefined,
  };
  return { id: String(dto.id), userId: '', productId: String(dto.product.id), product };
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private http = inject(HttpClient);
  private _items = signal<WishlistItem[]>([]);

  items = this._items.asReadonly();
  count = computed(() => this._items().length);

  loadWishlist(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItemDto[]>(`${env.apiUrl}/wishlist`).pipe(
      tap(dtos => this._items.set(dtos.map(toWishlistItem))),
      map(dtos => dtos.map(toWishlistItem)),
    );
  }

  add(product: Product): Observable<WishlistItem> {
    // Optimistic update
    const placeholder: WishlistItem = {
      id: `temp-${product.id}`,
      userId: '',
      productId: product.id,
      product,
    };
    if (!this._items().some(i => i.productId === product.id)) {
      this._items.update(items => [...items, placeholder]);
    }

    return this.http
      .post<WishlistItemDto>(`${env.apiUrl}/wishlist`, { productId: Number(product.id) })
      .pipe(
        map(dto => toWishlistItem(dto)),
        tap(item => {
          // Replace placeholder with real item
          this._items.update(items =>
            items.map(i => (i.productId === item.productId ? item : i)),
          );
        }),
      );
  }

  remove(productId: string): void {
    this._items.update(items => items.filter(i => i.productId !== productId));
    this.http.delete<void>(`${env.apiUrl}/wishlist/${productId}`).subscribe();
  }

  isInWishlist(productId: string): boolean {
    return this._items().some(i => i.productId === productId);
  }

  toggle(product: Product): void {
    if (this.isInWishlist(product.id)) {
      this.remove(product.id);
    } else {
      this.add(product).subscribe({
        error: () => {
          // Revert optimistic update on failure
          this._items.update(items => items.filter(i => i.productId !== product.id));
        },
      });
    }
  }
}
