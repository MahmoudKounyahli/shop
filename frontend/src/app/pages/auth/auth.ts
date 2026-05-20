import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Keycloak from 'keycloak-js';
import { AuthService } from '../../core/services/auth.service';
import { env } from '../../core/config/env';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-4xl">

        <p class="font-serif text-2xl tracking-widest uppercase text-center mb-12">Maison</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-200">

          <!-- ── Login ── -->
          <div class="p-10 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col">
            <h2 class="font-serif text-2xl mb-1">I already have an account</h2>
            <p class="text-sm text-gray-500 mb-8">Log in to your Maison account.</p>

            <button (click)="login()"
                    class="w-full py-4 bg-black text-white text-sm tracking-widest uppercase hover:bg-gray-900 transition-colors mb-4">
              Log In
            </button>

            <div class="flex items-center gap-4 my-4">
              <div class="flex-1 h-px bg-gray-200"></div>
              <span class="text-xs text-gray-400">or</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>

            <button (click)="loginWithGoogle()"
                    class="w-full py-4 border border-gray-300 text-sm tracking-widest uppercase hover:border-black transition-colors flex items-center justify-center gap-3">
              <svg viewBox="0 0 24 24" class="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <!-- ── Register ── -->
          <div class="p-10 flex flex-col">
            <h2 class="font-serif text-2xl mb-1">I don't have an account yet</h2>
            <p class="text-sm text-gray-500 mb-6">Create your account and enjoy these benefits:</p>

            @if (!showForm()) {
              <ul class="space-y-2 mb-8 text-sm text-gray-600">
                <li class="flex items-center gap-2"><span class="text-black">✓</span> Track your orders</li>
                <li class="flex items-center gap-2"><span class="text-black">✓</span> Save your addresses</li>
                <li class="flex items-center gap-2"><span class="text-black">✓</span> Save items to your wishlist</li>
                <li class="flex items-center gap-2"><span class="text-black">✓</span> Faster checkout</li>
              </ul>

              <button (click)="showForm.set(true)"
                      class="w-full py-4 bg-black text-white text-sm tracking-widest uppercase hover:bg-gray-900 transition-colors mb-4">
                Create Account
              </button>
            }

            @if (showForm() && !success()) {
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-3 mb-4">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <input formControlName="firstName"
                           type="text"
                           placeholder="First name"
                           class="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                           [class.border-red-400]="isFieldInvalid('firstName')" />
                  </div>
                  <div>
                    <input formControlName="lastName"
                           type="text"
                           placeholder="Last name"
                           class="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                           [class.border-red-400]="isFieldInvalid('lastName')" />
                  </div>
                </div>

                <input formControlName="email"
                       type="email"
                       placeholder="Email address"
                       class="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                       [class.border-red-400]="isFieldInvalid('email')" />

                <input formControlName="password"
                       type="password"
                       placeholder="Password (min. 8 characters)"
                       class="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                       [class.border-red-400]="isFieldInvalid('password')" />

                @if (error()) {
                  <p class="text-red-500 text-xs">{{ error() }}</p>
                }

                <button type="submit"
                        [disabled]="loading()"
                        class="w-full py-4 bg-black text-white text-sm tracking-widest uppercase hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ loading() ? 'Creating account...' : 'Create Account' }}
                </button>

                <button type="button"
                        (click)="showForm.set(false); error.set(null)"
                        class="text-xs text-gray-400 hover:text-black transition-colors text-center">
                  Cancel
                </button>
              </form>
            }

            @if (success()) {
              <p class="text-sm text-gray-700 mb-4">Account created! Logging you in...</p>
            }

            <div class="flex items-center gap-4 my-4">
              <div class="flex-1 h-px bg-gray-200"></div>
              <span class="text-xs text-gray-400">or</span>
              <div class="flex-1 h-px bg-gray-200"></div>
            </div>

            <button (click)="loginWithGoogle()"
                    class="w-full py-4 border border-gray-300 text-sm tracking-widest uppercase hover:border-black transition-colors flex items-center justify-center gap-3">
              <svg viewBox="0 0 24 24" class="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign Up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AuthComponent {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private keycloak = inject(Keycloak);

  showForm = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName:  ['', Validators.required],
    email:     ['', [Validators.required, Validators.email]],
    password:  ['', [Validators.required, Validators.minLength(8)]],
  });

  private returnUrl(): string {
    return window.location.origin +
      (this.route.snapshot.queryParamMap.get('returnUrl') ?? '/account');
  }

  login(): void {
    this.authService.login(this.returnUrl());
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle(this.returnUrl());
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { firstName, lastName, email, password } = this.registerForm.value;

    this.http.post(`${env.apiUrl}/auth/register`, { firstName, lastName, email, password })
      .subscribe({
        next: () => {
          this.success.set(true);
          this.loading.set(false);
          this.keycloak.login({ redirectUri: this.returnUrl() });
        },
        error: (err) => {
          this.loading.set(false);
          if (err.status === 409) {
            this.error.set('Email already registered. Please log in instead.');
          } else {
            this.error.set('Registration failed. Please try again.');
          }
        },
      });
  }
}
