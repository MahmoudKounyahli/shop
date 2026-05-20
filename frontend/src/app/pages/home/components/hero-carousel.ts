import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface HeroSlide {
  image: string;
  headline: string;
  sub: string;
  cta: string;
  link: string;
}

const SLIDES: HeroSlide[] = [
  {
    image: 'https://picsum.photos/seed/hero1/1600/900',
    headline: 'New Collection',
    sub: 'SS25 — Timeless simplicity',
    cta: 'Shop Women',
    link: '/products/women',
  },
  {
    image: 'https://picsum.photos/seed/hero2/1600/900',
    headline: 'Men\'s Edit',
    sub: 'Refined essentials for every occasion',
    cta: 'Shop Men',
    link: '/products/men',
  },
  {
    image: 'https://picsum.photos/seed/hero3/1600/900',
    headline: 'The Accessories',
    sub: 'Considered details, lasting quality',
    cta: 'Explore',
    link: '/products/accessories',
  },
];

@Component({
  selector: 'app-hero-carousel',
  imports: [RouterLink],
  template: `
    <div class="relative w-full overflow-hidden" style="height: 90svh; min-height: 32rem;">

      <!-- Slides -->
      @for (slide of slides; track slide.image; let i = $index) {
        <div
          class="absolute inset-0 transition-opacity duration-700"
          [class.opacity-100]="current() === i"
          [class.opacity-0]="current() !== i"
        >
          <img [src]="slide.image" [alt]="slide.headline"
               class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-black/30"></div>
          <div class="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
            <p class="text-sm tracking-widest uppercase mb-4 opacity-80">{{ slide.sub }}</p>
            <h1 class="font-serif text-5xl md:text-7xl font-medium mb-8">{{ slide.headline }}</h1>
            <a [routerLink]="slide.link"
               class="border border-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300">
              {{ slide.cta }}
            </a>
          </div>
        </div>
      }

      <!-- Prev / Next -->
      <button (click)="prev()"
              class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 transition-colors rounded-full">
        &#8592;
      </button>
      <button (click)="next()"
              class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 transition-colors rounded-full">
        &#8594;
      </button>

      <!-- Dots -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        @for (slide of slides; track slide.image; let i = $index) {
          <button (click)="goTo(i)"
                  class="w-1.5 h-1.5 rounded-full transition-colors"
                  [class.bg-white]="current() === i"
                  [class.bg-white/40]="current() !== i">
          </button>
        }
      </div>
    </div>
  `,
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  slides = SLIDES;
  current = signal(0);
  private timer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.timer = setInterval(() => this.next(), 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  next(): void {
    this.current.update(c => (c + 1) % this.slides.length);
  }

  prev(): void {
    this.current.update(c => (c - 1 + this.slides.length) % this.slides.length);
  }

  goTo(i: number): void {
    this.current.set(i);
  }
}
