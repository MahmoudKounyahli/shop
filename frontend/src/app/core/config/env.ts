declare global {
  interface Window {
    __env?: {
      keycloakUrl?: string;
      keycloakRealm?: string;
      keycloakClientId?: string;
      apiUrl?: string;
    };
  }
}

export const env = {
  get keycloakUrl(): string {
    return window.__env?.keycloakUrl ?? '/kc';
  },
  get keycloakRealm(): string {
    return window.__env?.keycloakRealm ?? 'maison';
  },
  get keycloakClientId(): string {
    return window.__env?.keycloakClientId ?? 'maison-angular';
  },
  get apiUrl(): string {
    return window.__env?.apiUrl ?? '/api';
  },
};
