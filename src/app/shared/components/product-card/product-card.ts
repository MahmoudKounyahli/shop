import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { AuthService } from '../../../core/services/auth.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { BadgeComponent } from '../badge/badge';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, BadgeComponent],
  template: `
    <div class="group relative">
      <a [routerLink]="['/products', product().categoryId, product().id]" class="block">
        <div class="overflow-hidden bg-gray-50 relative">
          <img
            [src]="mainImageUrl()"
            [alt]="product().name"
            class="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
          />
          @if (product().isNew) {
            <div class="absolute top-3 left-3">
              <app-badge label="New" />
            </div>
          }
        </div>
        <div class="mt-3 space-y-1">
          @if (product().brand) {
            <p class="text-xs text-gray-400 tracking-widest uppercase">{{ product().brand!.name }}</p>
          }
          <p class="text-sm font-medium text-black">{{ product().name }}</p>
          <p class="text-sm text-gray-500">${'$'}{{ product().variants[0]?.price ?? 0 }}</p>
          @if ((product().reviewCount ?? 0) > 0) {
            <div class="flex items-center gap-1">
              <span class="text-xs text-yellow-500">{{ stars(product().averageRating ?? 0) }}</span>
              <span class="text-xs text-gray-400">({{ product().reviewCount }})</span>
            </div>
          }
        </div>
      </a>

      <!-- Wishlist heart -->
      <button
        (click)="toggleWishlist($event)"
        class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:scale-110 transition-transform z-10"
        [attr.aria-label]="wishlist.isInWishlist(product().id) ? 'Remove from wishlist' : 'Add to wishlist'"
      >
        @if (wishlist.isInWishlist(product().id)) {
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        } @else {
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        }
      </button>
    </div>
  `,
})
export class ProductCardComponent {
  product = input.required<Product>();
  wishlist = inject(WishlistService);
  private auth = inject(AuthService);
  private router = inject(Router);

  mainImageUrl(): string {
    const img = this.product().images.find(i => i.isMain) ?? this.product().images[0];
    return img?.imageUrl ?? '';
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/auth']);
      return;
    }
    this.wishlist.toggle(this.product());
  }

  stars(rating: number): string {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }
}
