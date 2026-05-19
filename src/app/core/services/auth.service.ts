import { Injectable, computed, effect, inject, signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType } from 'keycloak-angular';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { CartService } from './cart.service';
import { WishlistService } from './wishlist.service';
import { env } from '../config/env';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private keycloak = inject(Keycloak);
  private keycloakEvent = inject(KEYCLOAK_EVENT_SIGNAL);
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  private _currentUser = signal<User | null>(null);
  currentUser = this._currentUser.asReadonly();

  isLoggedIn = computed(() => {
    this.keycloakEvent(); // track signal so this recomputes on every auth event
    return this.keycloak.authenticated ?? false;
  });

  constructor() {
    effect(async () => {
      const event = this.keycloakEvent();

      if (
        event.type === KeycloakEventType.Ready ||
        event.type === KeycloakEventType.AuthSuccess ||
        event.type === KeycloakEventType.AuthRefreshSuccess
      ) {
        if (this.keycloak.authenticated) {
          await this.loadProfile();
          if (event.type !== KeycloakEventType.AuthRefreshSuccess) {
            this.http.get(`${env.apiUrl}/users/me`).subscribe();
            this.cartService.loadCart().subscribe();
            this.wishlistService.loadWishlist().subscribe();
          }
        } else {
          this._currentUser.set(null);
        }
      }

      if (event.type === KeycloakEventType.AuthLogout) {
        this._currentUser.set(null);
      }
    });
  }

  login(redirectUri?: string): void {
    this.keycloak.login({ redirectUri: redirectUri ?? window.location.origin });
  }

  register(redirectUri?: string): void {
    this.keycloak.register({ redirectUri: redirectUri ?? window.location.origin });
  }

  loginWithGoogle(redirectUri?: string): void {
    this.keycloak.login({
      idpHint: 'google',
      redirectUri: redirectUri ?? window.location.origin,
    });
  }

  logout(): void {
    this._currentUser.set(null);
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  private async loadProfile(): Promise<void> {
    try {
      const profile = await this.keycloak.loadUserProfile();
      this._currentUser.set({
        id: this.keycloak.subject ?? '',
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        email: profile.email ?? '',
        registrationDate: '',
      });
    } catch (err) {
      console.warn('[AuthService] loadProfile failed:', err);
    }
  }
}
