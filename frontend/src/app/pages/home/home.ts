import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { HeroCarouselComponent } from './components/hero-carousel';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';

const CATEGORIES = [
  { label: 'Women', slug: 'women', image: 'https://picsum.photos/seed/cat-w/800/1000' },
  { label: 'Men', slug: 'men', image: 'https://picsum.photos/seed/cat-m/800/1000' },
  { label: 'Accessories', slug: 'accessories', image: 'https://picsum.photos/seed/cat-a/800/1000' },
];

@Component({
  selector: 'app-home',
  imports: [RouterLink, HeroCarouselComponent, ProductCardComponent],
  template: `
    <!-- Hero carousel -->
    <app-hero-carousel />

    <!-- Featured Categories -->
    <section class="max-w-7xl mx-auto px-6 lg:px-12 py-20">
      <h2 class="font-serif text-3xl mb-10">Shop by Category</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        @for (cat of categories; track cat.slug) {
          <a [routerLink]="['/products', cat.slug]" class="group relative overflow-hidden">
            <img [src]="cat.image" [alt]="cat.label"
                 class="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105" />
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
            <span class="absolute bottom-6 left-6 text-white font-serif text-2xl">{{ cat.label }}</span>
          </a>
        }
      </div>
    </section>

    <!-- New Arrivals -->
    <section class="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
      <div class="flex items-baseline justify-between mb-10">
        <h2 class="font-serif text-3xl">New Arrivals</h2>
        <a routerLink="/products/women" class="text-sm tracking-widest uppercase underline underline-offset-4">View All</a>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        @for (product of featured(); track product.id) {
          <app-product-card [product]="product" />
        }
      </div>
    </section>

    <!-- Editorial Banner -->
    <div class="relative h-64 md:h-96 overflow-hidden">
      <img src="https://picsum.photos/seed/editorial/1600/600" alt="New Collection"
           class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center">
        <p class="text-sm tracking-widest uppercase mb-3">Now Available</p>
        <h2 class="font-serif text-4xl md:text-5xl">SS25 Collection</h2>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  categories = CATEGORIES;
  featured = signal<Product[]>([]);

  ngOnInit(): void {
    this.productService.getFeatured().subscribe(products => this.featured.set(products));
  }
}
