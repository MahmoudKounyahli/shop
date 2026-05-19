import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  imports: [RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-32 text-center space-y-6">
      <p class="text-xs tracking-widest uppercase text-gray-400">Order Confirmed</p>
      <h1 class="font-serif text-4xl md:text-5xl">Thank you.</h1>
      <p class="text-sm text-gray-500 max-w-sm mx-auto">
        Your order has been placed. You will receive a confirmation email shortly.
      </p>
      <a routerLink="/"
         class="inline-block mt-8 border border-black px-10 py-3 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300">
        Continue Shopping
      </a>
    </div>
  `,
})
export class OrderConfirmationComponent {}
