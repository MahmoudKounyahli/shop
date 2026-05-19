import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { UserService } from '../../core/services/user.service';
import { Address } from '../../core/models/user.model';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      <h1 class="font-serif text-3xl mb-10">Checkout</h1>

      <div class="flex flex-col lg:flex-row gap-16">

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="placeOrder()" class="flex-1 space-y-8">

          <!-- Contact -->
          <fieldset class="space-y-4">
            <legend class="text-xs tracking-widest uppercase font-medium mb-4">Contact</legend>
            <div>
              <input formControlName="email" type="email" placeholder="Email address"
                     class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black transition-colors placeholder-gray-400" />
              @if (touched('email') && form.get('email')?.hasError('required')) {
                <p class="text-xs text-red-500 mt-1">Email is required.</p>
              }
              @if (touched('email') && form.get('email')?.hasError('email')) {
                <p class="text-xs text-red-500 mt-1">Enter a valid email address.</p>
              }
            </div>
          </fieldset>

          <!-- Shipping -->
          <fieldset class="space-y-4">
            <legend class="text-xs tracking-widest uppercase font-medium mb-4">Shipping Address</legend>

            @if (auth.isLoggedIn() && savedAddresses().length > 0) {
              <div class="space-y-3 mb-4">
                @for (addr of savedAddresses(); track addr.id) {
                  <label class="flex items-start gap-3 border border-gray-200 p-4 cursor-pointer hover:border-black transition-colors"
                         [class.border-black]="selectedAddressId() === addr.id">
                    <input type="radio" [value]="addr.id" [checked]="selectedAddressId() === addr.id"
                           (change)="selectAddress(addr)"
                           class="mt-0.5" />
                    <div class="text-sm">
                      <p class="font-medium capitalize">{{ addr.type }} address</p>
                      <p class="text-gray-500">{{ addr.street }} {{ addr.houseNumber }}, {{ addr.postalCode }} {{ addr.city }}, {{ addr.country }}</p>
                    </div>
                  </label>
                }
                <label class="flex items-start gap-3 border border-gray-200 p-4 cursor-pointer hover:border-black transition-colors"
                       [class.border-black]="selectedAddressId() === 'new'">
                  <input type="radio" value="new" [checked]="selectedAddressId() === 'new'"
                         (change)="selectAddress(null)"
                         class="mt-0.5" />
                  <span class="text-sm">Use a new address</span>
                </label>
              </div>
            }

            @if (!auth.isLoggedIn() || selectedAddressId() === 'new') {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input formControlName="firstName" placeholder="First name"
                         class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black transition-colors placeholder-gray-400" />
                  @if (touched('firstName') && form.get('firstName')?.invalid) {
                    <p class="text-xs text-red-500 mt-1">Required.</p>
                  }
                </div>
                <div>
                  <input formControlName="lastName" placeholder="Last name"
                         class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black transition-colors placeholder-gray-400" />
                  @if (touched('lastName') && form.get('lastName')?.invalid) {
                    <p class="text-xs text-red-500 mt-1">Required.</p>
                  }
                </div>
              </div>
              <div>
                <input formControlName="address" placeholder="Street & house number"
                       class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black transition-colors placeholder-gray-400" />
                @if (touched('address') && form.get('address')?.invalid) {
                  <p class="text-xs text-red-500 mt-1">Required.</p>
                }
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <input formControlName="city" placeholder="City"
                       class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black transition-colors placeholder-gray-400" />
                <input formControlName="postal" placeholder="Postal code"
                       class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black transition-colors placeholder-gray-400" />
                <input formControlName="country" placeholder="Country"
                       class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black transition-colors placeholder-gray-400" />
              </div>
            }
          </fieldset>

          <!-- Payment (UI only) -->
          <fieldset class="space-y-4">
            <legend class="text-xs tracking-widest uppercase font-medium mb-4">Payment</legend>
            <input formControlName="card" placeholder="Card number"
                   class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black transition-colors placeholder-gray-400" />
            <div class="grid grid-cols-2 gap-4">
              <input formControlName="expiry" placeholder="MM / YY"
                     class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black transition-colors placeholder-gray-400" />
              <input formControlName="cvv" placeholder="CVV"
                     class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black transition-colors placeholder-gray-400" />
            </div>
          </fieldset>

          <button type="submit"
                  class="w-full py-4 bg-black text-white text-sm tracking-widest uppercase hover:bg-gray-900 transition-colors">
            Place Order
          </button>
        </form>

        <!-- Summary -->
        <div class="lg:w-80 shrink-0">
          <div class="border border-gray-200 p-6 space-y-4">
            <h2 class="font-medium text-sm tracking-widest uppercase">Order Summary</h2>
            @for (item of cart.items(); track item.variantId) {
              <div class="flex gap-3">
                <img [src]="mainImageUrl(item.product)" [alt]="item.product.name"
                     class="w-14 object-cover bg-gray-50 shrink-0 aspect-[3/4]" />
                <div class="flex-1 text-sm">
                  <p class="font-medium">{{ item.product.name }}</p>
                  <p class="text-gray-400 text-xs">{{ item.variant.color }} / {{ item.variant.size }} × {{ item.quantity }}</p>
                  <p class="mt-1">${'$'}{{ item.variant.price * item.quantity }}</p>
                </div>
              </div>
            }
            <div class="border-t border-gray-100 pt-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Subtotal</span>
                <span>${'$'}{{ cart.subtotal() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Shipping</span>
                <span>{{ cart.subtotal() >= 100 ? 'Free' : '$10' }}</span>
              </div>
              <div class="flex justify-between font-medium">
                <span>Total</span>
                <span>${'$'}{{ cart.subtotal() >= 100 ? cart.subtotal() : cart.subtotal() + 10 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  cart = inject(CartService);
  auth = inject(AuthService);

  savedAddresses = signal<Address[]>([]);
  selectedAddressId = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    city: [''],
    postal: [''],
    country: [''],
    card: [''],
    expiry: [''],
    cvv: [''],
  });

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      const user = this.auth.currentUser()!;
      this.form.patchValue({ email: user.email, firstName: user.firstName, lastName: user.lastName });
      this.userService.getAddresses().subscribe(addresses => {
        this.savedAddresses.set(addresses);
        if (addresses.length > 0) {
          this.selectAddress(addresses[0]);
        }
      });
    }
  }

  selectAddress(addr: Address | null): void {
    if (addr) {
      this.selectedAddressId.set(addr.id);
      this.form.patchValue({
        address: `${addr.street} ${addr.houseNumber}`,
        city: addr.city,
        postal: addr.postalCode,
        country: addr.country,
      });
    } else {
      this.selectedAddressId.set('new');
      this.form.patchValue({ address: '', city: '', postal: '', country: '' });
    }
  }

  touched(field: string): boolean {
    return !!this.form.get(field)?.touched;
  }

  mainImageUrl(product: Product): string {
    const img = product.images.find(i => i.isMain) ?? product.images[0];
    return img?.imageUrl ?? '';
  }

  placeOrder(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const shippingId = this.selectedAddressId() ?? 'guest';
    this.orderService.placeOrder(
      this.cart.items(),
      shippingId,
      shippingId,
      this.auth.currentUser()?.id,
    ).subscribe(() => {
      this.cart.clear();
      this.router.navigate(['/order-confirmation']);
    });
  }
}
