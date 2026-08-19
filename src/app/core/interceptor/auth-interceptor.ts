import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { HttpAuth } from '../services/http-auth';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from 'express';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

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


    return throwError(()=>{})
  })
);

};
