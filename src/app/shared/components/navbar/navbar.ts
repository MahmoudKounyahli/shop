import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="flex items-center justify-between h-16">

          <!-- Nav links left -->
          <nav class="hidden md:flex items-center gap-8">
            <a routerLink="/products/women" routerLinkActive="font-medium"
               class="text-sm tracking-widest uppercase text-gray-700 hover:text-black transition-colors">Women</a>
            <a routerLink="/products/men" routerLinkActive="font-medium"
               class="text-sm tracking-widest uppercase text-gray-700 hover:text-black transition-colors">Men</a>
            <a routerLink="/products/accessories" routerLinkActive="font-medium"
               class="text-sm tracking-widest uppercase text-gray-700 hover:text-black transition-colors">Accessories</a>
          </nav>

          <!-- Logo center -->
          <a routerLink="/" class="font-serif text-2xl tracking-widest uppercase">Maison</a>

          <!-- Icons right -->
          <div class="flex items-center gap-5">

            <!-- Account -->
            <a [routerLink]="auth.isLoggedIn() ? '/account' : '/auth'"
               class="relative text-gray-700 hover:text-black transition-colors"
               aria-label="Account">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </a>

            <!-- Wishlist -->
            <a routerLink="/wishlist"
               class="relative text-gray-700 hover:text-black transition-colors"
               aria-label="Wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              @if (wishlist.count() > 0) {
                <span class="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {{ wishlist.count() }}
                </span>
              }
            </a>

            <!-- Bag -->
            <a routerLink="/cart" class="relative text-sm tracking-widest uppercase hover:text-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm6.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              @if (cart.count() > 0) {
                <span class="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {{ cart.count() }}
                </span>
              }
            </a>

            <!-- Mobile hamburger -->
            <button class="md:hidden p-1" (click)="toggleMobileMenu()">
              <span class="block w-5 h-px bg-black mb-1"></span>
              <span class="block w-5 h-px bg-black mb-1"></span>
              <span class="block w-5 h-px bg-black"></span>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        @if (mobileOpen) {
          <nav class="md:hidden border-t border-gray-100 py-4 flex flex-col gap-4">
            <a routerLink="/products/women" (click)="mobileOpen = false"
               class="text-sm tracking-widest uppercase text-gray-700">Women</a>
            <a routerLink="/products/men" (click)="mobileOpen = false"
               class="text-sm tracking-widest uppercase text-gray-700">Men</a>
            <a routerLink="/products/accessories" (click)="mobileOpen = false"
               class="text-sm tracking-widest uppercase text-gray-700">Accessories</a>
            <a [routerLink]="auth.isLoggedIn() ? '/account' : '/auth'" (click)="mobileOpen = false"
               class="text-sm tracking-widest uppercase text-gray-700">Account</a>
            <a routerLink="/wishlist" (click)="mobileOpen = false"
               class="text-sm tracking-widest uppercase text-gray-700">Wishlist</a>
          </nav>
        }
      </div>
    </header>
  `,
})
export class NavbarComponent {
  cart = inject(CartService);
  wishlist = inject(WishlistService);
  auth = inject(AuthService);
  mobileOpen = false;

  toggleMobileMenu(): void {
    this.mobileOpen = !this.mobileOpen;
  }
}
