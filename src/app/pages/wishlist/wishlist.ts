import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { Product, Size } from '../../core/models/product.model';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      <h1 class="font-serif text-3xl mb-10">Wishlist</h1>

      @if (wishlist.items().length === 0) {
        <div class="py-24 text-center space-y-4">
          <p class="text-gray-400 text-sm">Your wishlist is empty.</p>
          <a routerLink="/"
             class="inline-block text-sm tracking-widest uppercase underline underline-offset-4">
            Start Shopping
          </a>
        </div>
      } @else {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          @for (item of wishlist.items(); track item.id) {
            @if (item.product; as p) {
              <div class="group relative">
                <a [routerLink]="['/products', p.categoryId, p.id]" class="block">
                  <div class="overflow-hidden bg-gray-50 relative">
                    <img [src]="mainImageUrl(p)" [alt]="p.name"
                         class="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div class="mt-3 space-y-1">
                    @if (p.brand) {
                      <p class="text-xs text-gray-400 tracking-widest uppercase">{{ p.brand.name }}</p>
                    }
                    <p class="text-sm font-medium text-black">{{ p.name }}</p>
                    <p class="text-sm text-gray-500">${'$'}{{ p.variants[0]?.price ?? 0 }}</p>
                  </div>
                </a>

                <!-- Remove heart -->
                <button (click)="wishlist.remove(p.id)"
                        class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:scale-110 transition-transform z-10"
                        aria-label="Remove from wishlist">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </button>

                <!-- Move to Bag -->
                @if (pendingBagProduct()?.id === p.id) {
                  <div class="mt-2 space-y-2">
                    <p class="text-xs text-gray-500">Select size:</p>
                    <div class="flex flex-wrap gap-1">
                      @for (size of availableSizes(p); track size) {
                        <button (click)="addToBag(p, size)"
                                class="px-2 py-1 text-xs border border-gray-300 hover:border-black transition-colors">
                          {{ size }}
                        </button>
                      }
                    </div>
                    <button (click)="pendingBagProduct.set(null)"
                            class="text-xs text-gray-400 underline">Cancel</button>
                  </div>
                } @else {
                  <button (click)="pendingBagProduct.set(p)"
                          class="mt-2 w-full py-2 border border-black text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors">
                    Move to Bag
                  </button>
                }
              </div>
            }
          }
        </div>
      }
    </div>
  `,
})
export class WishlistComponent {
  wishlist = inject(WishlistService);
  private cart = inject(CartService);

  pendingBagProduct = signal<Product | null>(null);

  mainImageUrl(product: Product): string {
    const img = product.images.find(i => i.isMain) ?? product.images[0];
    return img?.imageUrl ?? '';
  }

  availableSizes(product: Product): Size[] {
    const seen = new Set<Size>();
    return product.variants.reduce<Size[]>((acc, v) => {
      if (!seen.has(v.size) && v.stock > 0) { seen.add(v.size); acc.push(v.size); }
      return acc;
    }, []);
  }

  addToBag(product: Product, size: Size): void {
    const variant = product.variants.find(v => v.size === size && v.stock > 0);
    if (variant) {
      this.cart.add(product, variant);
      this.wishlist.remove(product.id);
      this.pendingBagProduct.set(null);
    }
  }
}
