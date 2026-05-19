import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ReviewService } from '../../core/services/review.service';
import { AuthService } from '../../core/services/auth.service';
import { Product, ProductImage, ProductVariant, Size } from '../../core/models/product.model';
import { Review } from '../../core/models/review.model';
import { BadgeComponent } from '../../shared/components/badge/badge';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, BadgeComponent, ReactiveFormsModule],
  template: `
    @if (product(); as p) {
      <div class="max-w-7xl mx-auto px-6 lg:px-12 py-12">

        <!-- Breadcrumb -->
        <nav class="text-xs text-gray-400 tracking-wide mb-8 flex gap-2">
          <a routerLink="/" class="hover:text-black">Home</a>
          <span>/</span>
          <a [routerLink]="['/products', p.categoryId]" class="hover:text-black capitalize">{{ p.categoryId }}</a>
          <span>/</span>
          <span class="text-black">{{ p.name }}</span>
        </nav>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">

          <!-- Images -->
          <div class="space-y-3">
            <div class="overflow-hidden bg-gray-50">
              <img [src]="selectedImage()" [alt]="p.name"
                   class="w-full aspect-[3/4] object-cover" />
            </div>
            <div class="flex gap-3 flex-wrap">
              @for (img of visibleImages(); track img.id) {
                <button (click)="selectedImage.set(img.imageUrl)"
                        class="overflow-hidden border-2 transition-colors"
                        [class.border-black]="selectedImage() === img.imageUrl"
                        [class.border-transparent]="selectedImage() !== img.imageUrl">
                  <img [src]="img.imageUrl" [alt]="p.name" class="w-20 h-24 object-cover" />
                </button>
              }
            </div>
          </div>

          <!-- Info -->
          <div class="flex flex-col">
            <div class="flex items-start gap-3 mb-1">
              @if (p.brand) {
                <p class="text-xs text-gray-400 tracking-widest uppercase">{{ p.brand.name }}</p>
              }
            </div>
            <div class="flex items-start gap-3 mb-2">
              <h1 class="font-serif text-3xl flex-1">{{ p.name }}</h1>
              @if (p.isNew) { <app-badge label="New" /> }
            </div>
            <p class="text-xl mb-3">${'$'}{{ currentPrice() }}</p>

            @if ((p.reviewCount ?? 0) > 0) {
              <div class="flex items-center gap-2 mb-6">
                <span class="text-sm text-yellow-500">{{ stars(p.averageRating ?? 0) }}</span>
                <span class="text-xs text-gray-400">({{ p.reviewCount }} reviews)</span>
              </div>
            }

            <p class="text-sm text-gray-600 leading-relaxed mb-8">{{ p.description }}</p>

            <!-- Color selector -->
            <div class="mb-6">
              <p class="text-xs tracking-widest uppercase font-medium mb-3">
                Color <span class="normal-case font-normal text-gray-500">— {{ selectedColor() ?? 'Select' }}</span>
              </p>
              <div class="flex gap-3 flex-wrap">
                @for (color of uniqueColors(); track color.name) {
                  <button
                    (click)="selectColor(color.name)"
                    class="w-7 h-7 rounded-full border-2 transition-all"
                    [style.background-color]="color.hex"
                    [class.border-black]="selectedColor() === color.name"
                    [class.border-gray-200]="selectedColor() !== color.name"
                    [attr.title]="color.name"
                  ></button>
                }
              </div>
              @if (colorError()) {
                <p class="mt-2 text-xs text-red-500">Please select a color.</p>
              }
            </div>

            <!-- Size selector -->
            <div class="mb-6">
              <div class="flex items-baseline justify-between mb-3">
                <p class="text-xs tracking-widest uppercase font-medium">Select Size</p>
              </div>
              <div class="flex flex-wrap gap-2">
                @for (size of availableSizes(); track size) {
                  <button
                    (click)="selectedSize.set(size)"
                    [disabled]="!isSizeInStock(size)"
                    class="w-14 h-10 text-sm border transition-colors"
                    [class.bg-black]="selectedSize() === size"
                    [class.text-white]="selectedSize() === size"
                    [class.border-black]="selectedSize() === size"
                    [class.border-gray-300]="selectedSize() !== size && isSizeInStock(size)"
                    [class.border-gray-200]="!isSizeInStock(size)"
                    [class.text-gray-300]="!isSizeInStock(size)"
                    [class.line-through]="!isSizeInStock(size)"
                    [class.cursor-not-allowed]="!isSizeInStock(size)"
                  >{{ size }}</button>
                }
              </div>
              @if (sizeError()) {
                <p class="mt-2 text-xs text-red-500">Please select a size to continue.</p>
              }
            </div>

            <!-- Add to Bag -->
            <button (click)="addToCart(p)"
                    class="w-full py-4 bg-black text-white text-sm tracking-widest uppercase hover:bg-gray-900 transition-colors mb-3">
              Add to Bag
            </button>

            @if (addedMessage()) {
              <p class="text-center text-sm text-gray-500 mb-3">Added to your bag.</p>
            }

            <!-- Add to Wishlist -->
            <button (click)="toggleWishlist(p)"
                    class="w-full py-4 border border-black text-sm tracking-widest uppercase hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mb-6">
              @if (wishlist.isInWishlist(p.id)) {
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
                Remove from Wishlist
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                Add to Wishlist
              }
            </button>

            <!-- Accordions -->
            <div class="border-t border-gray-200">
              @for (section of accordions; track section.label) {
                <div class="border-b border-gray-200">
                  <button (click)="section.open = !section.open"
                          class="w-full flex justify-between items-center py-4 text-sm tracking-widest uppercase text-left">
                    {{ section.label }}
                    <span>{{ section.open ? '−' : '+' }}</span>
                  </button>
                  @if (section.open) {
                    <p class="text-sm text-gray-500 pb-4 leading-relaxed">{{ section.content }}</p>
                  }
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Reviews -->
        <div class="mt-16 border-t border-gray-200 pt-12">
          <h2 class="font-serif text-2xl mb-2">Reviews</h2>
          @if ((p.reviewCount ?? 0) > 0) {
            <div class="flex items-center gap-3 mb-8">
              <span class="text-2xl text-yellow-500">{{ stars(p.averageRating ?? 0) }}</span>
              <span class="text-sm text-gray-500">{{ p.averageRating?.toFixed(1) }} out of 5 ({{ p.reviewCount }} reviews)</span>
            </div>
          }

          <div class="space-y-6 mb-10">
            @for (review of reviews(); track review.id) {
              <div class="border-b border-gray-100 pb-6">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-yellow-500 text-sm">{{ stars(review.stars) }}</span>
                  <span class="text-sm font-medium">{{ review.userName ?? 'Anonymous' }}</span>
                  <span class="text-xs text-gray-400">{{ review.createdAt }}</span>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed">{{ review.comment }}</p>
              </div>
            }
            @if (reviews().length === 0) {
              <p class="text-sm text-gray-400">No reviews yet. Be the first to write one.</p>
            }
          </div>

          <!-- Write review -->
          @if (!showReviewForm()) {
            <button (click)="openReviewForm(p.id)"
                    class="px-8 py-3 border border-black text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors">
              Write a Review
            </button>
          } @else {
            <form [formGroup]="reviewForm" (ngSubmit)="submitReview(p.id)" class="max-w-lg space-y-4">
              <p class="text-xs tracking-widest uppercase font-medium">Your Review</p>
              <!-- Stars selector -->
              <div class="flex gap-2">
                @for (n of [1,2,3,4,5]; track n) {
                  <button type="button" (click)="reviewForm.patchValue({ stars: n })"
                          class="text-2xl transition-colors"
                          [class.text-yellow-500]="(reviewForm.get('stars')?.value ?? 0) >= n"
                          [class.text-gray-300]="(reviewForm.get('stars')?.value ?? 0) < n">★</button>
                }
              </div>
              <textarea formControlName="comment" rows="4" placeholder="Share your thoughts…"
                        class="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors resize-none">
              </textarea>
              @if (reviewForm.get('comment')?.touched && reviewForm.get('comment')?.invalid) {
                <p class="text-xs text-red-500">Please write a comment.</p>
              }
              <div class="flex gap-3">
                <button type="submit"
                        class="px-8 py-3 bg-black text-white text-sm tracking-widest uppercase hover:bg-gray-900 transition-colors">
                  Submit
                </button>
                <button type="button" (click)="showReviewForm.set(false)"
                        class="px-8 py-3 border border-gray-300 text-sm tracking-widest uppercase hover:border-black transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    } @else {
      <div class="max-w-7xl mx-auto px-6 py-24 text-center text-gray-400 text-sm">Product not found.</div>
    }
  `,
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private reviewService = inject(ReviewService);
  private fb = inject(FormBuilder);
  wishlist = inject(WishlistService);
  auth = inject(AuthService);

  product = signal<Product | undefined>(undefined);
  selectedImage = signal('');
  selectedColor = signal<string | null>(null);
  selectedSize = signal<Size | null>(null);
  colorError = signal(false);
  sizeError = signal(false);
  addedMessage = signal(false);
  reviews = signal<Review[]>([]);
  showReviewForm = signal(false);

  reviewForm = this.fb.group({
    stars: [5],
    comment: ['', Validators.required],
  });

  accordions: { label: string; content: string; open: boolean }[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getById(id).subscribe(p => {
      this.product.set(p);
      if (p) {
        const mainImg = p.images.find(i => i.isMain) ?? p.images[0];
        this.selectedImage.set(mainImg?.imageUrl ?? '');
        this.accordions = [
          { label: 'Details', content: p.description, open: false },
          {
            label: 'Material & Care',
            content: [p.materialInfo, p.careInstructions].filter(Boolean).join(' '),
            open: false,
          },
          {
            label: 'Delivery & Returns',
            content: 'Free standard delivery on orders over $100. Returns accepted within 30 days of purchase. Items must be unworn with tags attached.',
            open: false,
          },
        ];
      }
    });
    this.reviewService.getByProduct(id).subscribe(r => this.reviews.set(r));
  }

  uniqueColors(): { name: string; hex: string }[] {
    const p = this.product();
    if (!p) return [];
    const seen = new Set<string>();
    return p.variants.reduce<{ name: string; hex: string }[]>((acc, v) => {
      if (!seen.has(v.color)) {
        seen.add(v.color);
        acc.push({ name: v.color, hex: v.colorHex });
      }
      return acc;
    }, []);
  }

  availableSizes(): Size[] {
    const p = this.product();
    const color = this.selectedColor();
    if (!p) return [];
    const variants = color ? p.variants.filter(v => v.color === color) : p.variants;
    const seen = new Set<Size>();
    return variants.reduce<Size[]>((acc, v) => {
      if (!seen.has(v.size)) { seen.add(v.size); acc.push(v.size); }
      return acc;
    }, []);
  }

  isSizeInStock(size: Size): boolean {
    const p = this.product();
    const color = this.selectedColor();
    if (!p) return false;
    const variant = p.variants.find(v => v.size === size && (!color || v.color === color));
    return (variant?.stock ?? 0) > 0;
  }

  currentPrice(): number {
    const p = this.product();
    if (!p) return 0;
    const color = this.selectedColor();
    const size = this.selectedSize();
    if (color && size) {
      const v = p.variants.find(v => v.color === color && v.size === size);
      if (v) return v.price;
    }
    return p.variants[0]?.price ?? 0;
  }

  visibleImages(): ProductImage[] {
    const p = this.product();
    const color = this.selectedColor();
    if (!p) return [];
    if (!color) return p.images;
    const variantIds = new Set(p.variants.filter(v => v.color === color).map(v => v.id));
    return p.images.filter(img => !img.variantId || variantIds.has(img.variantId));
  }

  selectColor(color: string): void {
    this.selectedColor.set(color);
    this.colorError.set(false);
    this.selectedSize.set(null);
    const imgs = this.visibleImages();
    const main = imgs.find(i => i.isMain) ?? imgs[0];
    if (main) this.selectedImage.set(main.imageUrl);
  }

  addToCart(product: Product): void {
    if (!this.selectedColor()) { this.colorError.set(true); return; }
    if (!this.selectedSize()) { this.sizeError.set(true); return; }
    this.colorError.set(false);
    this.sizeError.set(false);
    const variant = product.variants.find(
      v => v.color === this.selectedColor() && v.size === this.selectedSize(),
    );
    if (!variant || variant.stock === 0) return;
    this.cartService.add(product, variant);
    this.addedMessage.set(true);
    setTimeout(() => this.addedMessage.set(false), 2000);
  }

  toggleWishlist(product: Product): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/auth'], {
        queryParams: { returnUrl: `/products/${product.categoryId}/${product.id}` },
      });
      return;
    }
    this.wishlist.toggle(product);
  }

  openReviewForm(productId: string): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/auth'], { queryParams: { returnUrl: `/products/${this.product()?.categoryId}/${productId}` } });
      return;
    }
    this.showReviewForm.set(true);
  }

  submitReview(productId: string): void {
    this.reviewForm.markAllAsTouched();
    if (this.reviewForm.invalid) return;
    const user = this.auth.currentUser();
    this.reviewService.submit({
      userId: user?.id ?? '',
      productId,
      stars: this.reviewForm.value.stars ?? 5,
      comment: this.reviewForm.value.comment ?? '',
      userName: user?.firstName,
    }).subscribe(r => {
      this.reviews.update(reviews => [...reviews, r]);
      this.showReviewForm.set(false);
      this.reviewForm.reset({ stars: 5, comment: '' });
    });
  }

  stars(rating: number): string {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }
}
