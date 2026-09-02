// src/app/core/interceptor/auth-interceptor.ts
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Tu lógica de auth (inyectar token, etc.)
  return next(req);
};

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`[OUT] ${req.method} -> ${req.url}`);

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          console.log(`[IN] ${event.status} ${req.url}`, event.body);
        }
      },
      error: (error) => {
        console.error(`[ERROR] ${req.method} -> ${req.url}`, error);
      }
    })
  );
};