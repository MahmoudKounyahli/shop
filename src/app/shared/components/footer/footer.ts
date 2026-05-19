import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="border-t border-gray-200 mt-24">
      <div class="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div class="flex flex-col md:flex-row justify-between items-start gap-8">
          <span class="font-serif text-xl tracking-widest uppercase">Maison</span>
          <div class="flex flex-col md:flex-row gap-6 text-sm text-gray-500">
            <a routerLink="/products/women" class="hover:text-black transition-colors">Women</a>
            <a routerLink="/products/men" class="hover:text-black transition-colors">Men</a>
            <a routerLink="/products/accessories" class="hover:text-black transition-colors">Accessories</a>
          </div>
        </div>
        <p class="mt-8 text-xs text-gray-400">&copy; {{ year }} Maison. All rights reserved.</p>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}
