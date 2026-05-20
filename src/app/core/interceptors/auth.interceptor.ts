import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import Keycloak from 'keycloak-js';
import { catchError, from, of, switchMap } from 'rxjs';
import { env } from '../config/env';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(env.apiUrl) && !req.url.startsWith('/api')) {
    return next(req);
  }
  const keycloak = inject(Keycloak);
  console.log('[interceptor] authenticated:', keycloak.authenticated, '| token:', keycloak.token ? 'present' : 'missing');
  if (!keycloak.authenticated) {
    return next(req);
  }
  return from(keycloak.updateToken(5)).pipe(
    catchError(() => of(false)),
    switchMap(() => {
      const token = keycloak.token;
      if (!token) {
        return next(req);
      }
      return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
    }),
  );
};
