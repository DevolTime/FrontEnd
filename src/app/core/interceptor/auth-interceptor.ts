// src/app/core/interceptor/auth-interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { HttpAuth } from '../services/http-auth';
import { Router } from 'express';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Tu lógica de auth (inyectar token, etc.)


  const httpAuth= inject(HttpAuth)
  const router = inject(Router);     


//obterner el token 
const token= httpAuth.token
let requestHeadersToken= req
//crear cabezeca

if(token){
requestHeadersToken= req.clone({
  headers: req.headers
  .set(`X-Token`, token)
  .set(`X-Procesardo-por`, `authInterceptor`)
})

}

return next(requestHeadersToken).pipe(
  catchError((error:HttpErrorResponse)=>{
    if(error.status== 401){
      httpAuth.clearAuthData();
      router.navigateByUrl(`/login`)
    }


    return throwError(() => error)
  })
);

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