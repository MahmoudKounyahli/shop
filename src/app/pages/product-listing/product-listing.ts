import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product, Size } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';

type SortOption = 'newest' | 'price-asc' | 'price-desc';
const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL'];

@Component({
  selector: 'app-product-listing',
  imports: [ProductCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-6 lg:px-12 py-12">

      <!-- Header -->
      <div class="flex items-baseline justify-between mb-8">
        <h1 class="font-serif text-3xl capitalize">{{ category() }}</h1>
        <span class="text-sm text-gray-500">{{ filtered().length }} items</span>
      </div>

      <div class="flex flex-col md:flex-row gap-10">

        <!-- Filters -->
        <aside class="md:w-48 shrink-0 space-y-8">
          <div>
            <p class="text-xs tracking-widest uppercase mb-3 font-medium">Size</p>
            <div class="flex flex-wrap gap-2">
              @for (size of sizes; track size) {
                <button
                  (click)="toggleSize(size)"
                  class="px-3 py-1 text-xs border transition-colors"
                  [class.bg-black]="selectedSizes().includes(size)"
                  [class.text-white]="selectedSizes().includes(size)"
                  [class.border-black]="selectedSizes().includes(size)"
                  [class.border-gray-300]="!selectedSizes().includes(size)"
                >{{ size }}</button>
              }
            </div>
          </div>

          <div>
            <p class="text-xs tracking-widest uppercase mb-3 font-medium">Sort</p>
            <div class="space-y-2">
              @for (opt of sortOptions; track opt.value) {
                <button
                  (click)="sort.set(opt.value)"
                  class="block text-sm transition-colors"
                  [class.font-medium]="sort() === opt.value"
                  [class.text-black]="sort() === opt.value"
                  [class.text-gray-500]="sort() !== opt.value"
                >{{ opt.label }}</button>
              }
            </div>
          </div>

          @if (selectedSizes().length > 0) {
            <button (click)="clearFilters()" class="text-xs underline underline-offset-4 text-gray-500">
              Clear filters
            </button>
          }
        </aside>

        <!-- Grid -->
        <div class="flex-1">
          @if (filtered().length === 0) {
            <div class="py-24 text-center text-gray-400 text-sm">No products match the selected filters.</div>
          } @else {
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
              @for (product of filtered(); track product.id) {
                <app-product-card [product]="product" />
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class ProductListingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  category = signal<string>('');
  products = signal<Product[]>([]);
  selectedSizes = signal<Size[]>([]);
  sort = signal<SortOption>('newest');

  sizes = SIZES;
  sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
  ];

  filtered = computed(() => {
    let result = [...this.products()];
    if (this.selectedSizes().length > 0) {
      result = result.filter(p =>
        p.variants.some(v => this.selectedSizes().includes(v.size)),
      );
    }
    const minPrice = (p: Product) => Math.min(...p.variants.map(v => v.price));
    switch (this.sort()) {
      case 'price-asc': return result.sort((a, b) => minPrice(a) - minPrice(b));
      case 'price-desc': return result.sort((a, b) => minPrice(b) - minPrice(a));
      default: return result;
    }
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category') ?? '';
      this.category.set(cat);
      this.selectedSizes.set([]);
      this.productService.getByCategory(cat).subscribe(p => this.products.set(p));
    });
  }

  toggleSize(size: Size): void {
    this.selectedSizes.update(sizes =>
      sizes.includes(size) ? sizes.filter(s => s !== size) : [...sizes, size],
    );
  }

  clearFilters(): void {
    this.selectedSizes.set([]);
  }
}
