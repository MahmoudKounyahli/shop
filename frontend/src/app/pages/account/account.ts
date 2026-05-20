import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { UserService } from '../../core/services/user.service';
import { Order } from '../../core/models/order.model';
import { Address } from '../../core/models/user.model';

type AccountView = 'orders' | 'addresses' | 'profile';

const STATUS_LABELS: Record<string, string> = {
  received: 'Received',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  returned: 'Returned',
};

@Component({
  selector: 'app-account',
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      <div class="flex flex-col md:flex-row gap-12">

        <!-- Sidebar -->
        <aside class="md:w-52 shrink-0">
          <div class="mb-8">
            <p class="font-medium text-sm">Hello, {{ auth.currentUser()?.firstName }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ auth.currentUser()?.email }}</p>
          </div>

          <nav class="flex flex-col gap-1">
            @for (link of navLinks; track link.view) {
              <button (click)="activeView.set(link.view)"
                      class="text-left text-sm py-2 transition-colors"
                      [class.font-medium]="activeView() === link.view"
                      [class.text-black]="activeView() === link.view"
                      [class.text-gray-500]="activeView() !== link.view">
                {{ link.label }}
              </button>
            }
            <a routerLink="/wishlist" class="text-sm py-2 text-gray-500 hover:text-black transition-colors">
              Wishlist
            </a>
            <button (click)="logout()"
                    class="text-left text-sm py-2 text-gray-400 hover:text-black transition-colors mt-4">
              Log Out
            </button>
          </nav>
        </aside>

        <!-- Content -->
        <div class="flex-1">

          <!-- My Orders -->
          @if (activeView() === 'orders') {
            <h1 class="font-serif text-2xl mb-8">My Orders</h1>
            @if (orders().length === 0) {
              <p class="text-sm text-gray-400">No orders yet.</p>
            } @else {
              <div class="divide-y divide-gray-100">
                @for (order of orders(); track order.id) {
                  <div class="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p class="text-sm font-medium">Order #{{ order.id }}</p>
                      <p class="text-xs text-gray-400 mt-1">{{ order.orderDate }} · {{ order.items.length }} item{{ order.items.length !== 1 ? 's' : '' }}</p>
                    </div>
                    <div class="flex items-center gap-6">
                      <span class="text-sm">${'$'}{{ order.totalAmount }}</span>
                      <span class="text-xs tracking-wide px-3 py-1 border"
                            [class.border-green-300]="order.status === 'delivered'"
                            [class.text-green-700]="order.status === 'delivered'"
                            [class.border-blue-300]="order.status === 'shipped'"
                            [class.text-blue-700]="order.status === 'shipped'"
                            [class.border-gray-300]="order.status === 'received' || order.status === 'paid'"
                            [class.text-gray-600]="order.status === 'received' || order.status === 'paid'"
                            [class.border-red-200]="order.status === 'returned'"
                            [class.text-red-500]="order.status === 'returned'">
                        {{ statusLabel(order.status) }}
                      </span>
                    </div>
                  </div>
                }
              </div>
            }
          }

          <!-- My Addresses -->
          @if (activeView() === 'addresses') {
            <h1 class="font-serif text-2xl mb-8">My Addresses</h1>
            <div class="space-y-4">
              @for (addr of addresses(); track addr.id) {
                <div class="border border-gray-200 p-6">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="text-xs tracking-widest uppercase text-gray-400 mb-2">{{ addr.type }}</p>
                      <p class="text-sm">{{ addr.street }} {{ addr.houseNumber }}</p>
                      <p class="text-sm text-gray-500">{{ addr.postalCode }} {{ addr.city }}, {{ addr.country }}</p>
                    </div>
                    <button class="text-xs underline underline-offset-2 text-gray-400 hover:text-black transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              }
              @if (addresses().length === 0) {
                <p class="text-sm text-gray-400">No saved addresses.</p>
              }
              <button (click)="showAddressForm.set(!showAddressForm())"
                      class="mt-4 px-6 py-3 border border-gray-300 text-sm tracking-widest uppercase hover:border-black transition-colors">
                {{ showAddressForm() ? 'Cancel' : '+ Add New Address' }}
              </button>

              @if (showAddressForm()) {
                <form [formGroup]="addressForm" (ngSubmit)="addAddress()" class="border border-gray-200 p-6 space-y-4 mt-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <input formControlName="street" placeholder="Street"
                             class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black placeholder-gray-400" />
                    </div>
                    <div>
                      <input formControlName="houseNumber" placeholder="House number"
                             class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black placeholder-gray-400" />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <input formControlName="postalCode" placeholder="Postal code"
                           class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black placeholder-gray-400" />
                    <input formControlName="city" placeholder="City"
                           class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black placeholder-gray-400" />
                  </div>
                  <input formControlName="country" placeholder="Country"
                         class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black placeholder-gray-400" />
                  <select formControlName="type"
                          class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black bg-transparent">
                    <option value="shipping">Shipping</option>
                    <option value="billing">Billing</option>
                  </select>
                  <button type="submit"
                          class="px-8 py-3 bg-black text-white text-sm tracking-widest uppercase hover:bg-gray-900 transition-colors">
                    Save Address
                  </button>
                </form>
              }
            </div>
          }

          <!-- Personal Data -->
          @if (activeView() === 'profile') {
            <h1 class="font-serif text-2xl mb-8">Personal Data</h1>
            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="max-w-md space-y-5">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <input formControlName="firstName" placeholder="First name"
                         class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black placeholder-gray-400" />
                </div>
                <div>
                  <input formControlName="lastName" placeholder="Last name"
                         class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black placeholder-gray-400" />
                </div>
              </div>
              <div>
                <input formControlName="email" type="email" placeholder="Email"
                       class="w-full border-b border-gray-300 py-3 text-sm outline-none focus:border-black placeholder-gray-400" />
              </div>
              @if (profileSaved()) {
                <p class="text-sm text-green-600">Changes saved.</p>
              }
              <button type="submit"
                      class="px-8 py-3 bg-black text-white text-sm tracking-widest uppercase hover:bg-gray-900 transition-colors">
                Save Changes
              </button>
            </form>
          }

        </div>
      </div>
    </div>
  `,
})
export class AccountComponent implements OnInit {
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private router = inject(Router);
  auth = inject(AuthService);

  activeView = signal<AccountView>('orders');
  orders = signal<Order[]>([]);
  addresses = signal<Address[]>([]);
  showAddressForm = signal(false);
  profileSaved = signal(false);

  navLinks: { label: string; view: AccountView }[] = [
    { label: 'My Orders', view: 'orders' },
    { label: 'My Addresses', view: 'addresses' },
    { label: 'Personal Data', view: 'profile' },
  ];

  addressForm = this.fb.group({
    street: ['', Validators.required],
    houseNumber: ['', Validators.required],
    postalCode: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    type: ['shipping'],
  });

  profileForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: ['', [Validators.email]],
  });

  ngOnInit(): void {
    this.orderService.getOrders().subscribe(o => this.orders.set(o));
    this.userService.getAddresses().subscribe(a => this.addresses.set(a));
    const user = this.auth.currentUser();
    if (user) {
      this.profileForm.patchValue({ firstName: user.firstName, lastName: user.lastName, email: user.email });
    }
  }

  statusLabel(status: string): string {
    return STATUS_LABELS[status] ?? status;
  }

  addAddress(): void {
    if (this.addressForm.invalid) return;
    const v = this.addressForm.value;
    this.userService.addAddress({
      street: v.street!,
      houseNumber: v.houseNumber!,
      postalCode: v.postalCode!,
      city: v.city!,
      country: v.country!,
      type: v.type as 'shipping' | 'billing',
    }).subscribe(addr => {
      this.addresses.update(a => [...a, addr]);
      this.showAddressForm.set(false);
      this.addressForm.reset({ type: 'shipping' });
    });
  }

  saveProfile(): void {
    const v = this.profileForm.value;
    this.userService.updateProfile({
      firstName: v.firstName ?? undefined,
      lastName: v.lastName ?? undefined,
      email: v.email ?? undefined,
    }).subscribe(() => {
      this.profileSaved.set(true);
      setTimeout(() => this.profileSaved.set(false), 2500);
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
