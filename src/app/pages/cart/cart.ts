import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      <h1 class="font-serif text-3xl mb-10">Your Bag</h1>

      @if (cart.items().length === 0) {
        <div class="py-24 text-center space-y-4">
          <p class="text-gray-400 text-sm">Your bag is empty.</p>
          <a routerLink="/" class="inline-block text-sm tracking-widest uppercase underline underline-offset-4">
            Continue Shopping
          </a>
        </div>
      } @else {
        <div class="flex flex-col lg:flex-row gap-16">

          <!-- Items -->
          <div class="flex-1 divide-y divide-gray-100">
            @for (item of cart.items(); track item.variantId) {
              <div class="flex gap-6 py-6">
                <img [src]="mainImageUrl(item.product)" [alt]="item.product.name"
                     class="w-24 h-32 object-cover bg-gray-50 shrink-0" />
                <div class="flex-1 flex flex-col justify-between">
                  <div>
                    <p class="font-medium text-sm">{{ item.product.name }}</p>
                    <p class="text-xs text-gray-400 mt-1">{{ item.variant.color }} / {{ item.variant.size }}</p>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center border border-gray-200 w-fit">
                      <button (click)="cart.updateQuantity(item.variantId, item.quantity - 1)"
                              class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors">−</button>
                      <span class="w-8 text-center text-sm">{{ item.quantity }}</span>
                      <button (click)="cart.updateQuantity(item.variantId, item.quantity + 1)"
                              class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors">+</button>
                    </div>
                    <div class="flex items-center gap-4">
                      <span class="text-sm">${'$'}{{ item.variant.price * item.quantity }}</span>
                      <button (click)="cart.remove(item.variantId)"
                              class="text-xs text-gray-400 underline underline-offset-2 hover:text-black transition-colors">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Summary -->
          <div class="lg:w-80 shrink-0">
            <div class="border border-gray-200 p-6 space-y-4">
              <h2 class="font-medium text-sm tracking-widest uppercase">Order Summary</h2>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Subtotal</span>
                <span>${'$'}{{ cart.subtotal() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Shipping</span>
                <span>{{ cart.subtotal() >= 100 ? 'Free' : '$10' }}</span>
              </div>
              <div class="border-t border-gray-200 pt-4 flex justify-between font-medium">
                <span>Total</span>
                <span>${'$'}{{ cart.subtotal() >= 100 ? cart.subtotal() : cart.subtotal() + 10 }}</span>
              </div>
              <p class="text-xs text-gray-400">Free shipping on orders over $100.</p>
              <a routerLink="/checkout"
                 class="block w-full py-4 bg-black text-white text-sm tracking-widest uppercase text-center hover:bg-gray-900 transition-colors">
                Checkout
              </a>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class CartComponent {
  cart = inject(CartService);

  mainImageUrl(product: Product): string {
    const img = product.images.find(i => i.isMain) ?? product.images[0];
    return img?.imageUrl ?? '';
  }
}
