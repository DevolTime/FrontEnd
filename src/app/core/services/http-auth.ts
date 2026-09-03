import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID, Service } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class HttpAuth {
  private BASE_URL :string =environment.apiUrl
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID)

  private isBrowser: boolean = isPlatformBrowser(this.platformId)
  currentUser$ = new BehaviorSubject<any>(this.getTokenFromStorage())
  currentToken$ = new BehaviorSubject<any>(this.getTokenFromStorage())


  user$ = this.currentUser$.asObservable()
  token$ =this.currentToken$.asObservable()


  loginUser(credentials: any) {
    return this.http.post<any>('http://localhost:3000/api/auth/login', credentials).pipe(
      // Sirve para generar acciones de acuerdo a X o Y dato
      tap((res) => {

        // Verificamos que la respuesta contenga las propiedades esperadas
        if (res?.token && res?.data) {
          this.setAuthData(res.token, res.data)
          // Redireccionamos
          this.router.navigateByUrl('/dashboard');
        }

        //console.log( data );
      }),
      map((data) => data.msg),
      catchError((err: HttpErrorResponse) => {
        // Extraemos el mensaje de la propiedad error
        const msgError = err.error?.msg || 'Error al iniciar sesión';
        console.log(msgError);
        return of(msgError)
      })
    )
  }

  setAuthData(token :string, user : any):void {
    this.token = token,
    this.user=user

  }
  saveDataLocalStorage(token: any, user: any) {
    //VERIFICAMOS QIE EL TIPO DE APLICATIVO QUE ESTQAMOAS EJECUTANDOW
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem( this.TOKEN_KEY, token)
      localStorage.setItem(this.USER_KEY, user)
    }
    this.currentUser$.next(user)
    this.currentToken$.next(token)
  }
  getDataLocalStorage(): any {
    let user
    let token
    if (isPlatformBrowser(this.platformId)) {
      const ValeuKeyToken = localStorage.getItem(this.TOKEN_KEY)
      token = ValeuKeyToken ? JSON.parse(ValeuKeyToken) : null

      const ValeuKeyUser = localStorage.getItem(this.USER_KEY)
      user = ValeuKeyUser ? JSON.parse(ValeuKeyUser) : null;

      this.currentToken$.next(token),
        this.currentUser$.next(user)
      return {
        token,
        user
      }
    }
  }
  clearAuthData(){
    this.token=null,
    this.user=null

  }
  logoutUser():void {
    this.clearAuthData()// Redireccionamos
  }
  checkAuthStatus(){
    const token = this.token;
    if(!token){
      this.clearAuthData();
      return of(false)
    }
    return this.http.get<any>(`${this.BASE_URL}/auth/renew-token`).pipe(
      tap((res)=>{
        if(res?.token && res?.data){
          this.setAuthData(res.token, res.data)
        }
      }),
      map((res)=>!!res.token),
      catchError((err:HttpErrorResponse)=>{
        console.log(`error al renovar eltoke n`);
        this.clearAuthData();
        return of(false)
      })
  )
  }

  isLoggedIn(): boolean {
    return !!this.token && !!this.user
  }
  private getTokenFromStorage():string |null{
    if(this.isBrowser){
      return localStorage.getItem(`token`)
    }
    return null
  }
  private getUserFromStorage():any{
    if(this.isBrowser){
      const user =localStorage.getItem(`user`)
      return user?JSON.parse(user):null
    }
  }

  set token(token: string | null) {

    if(this.isBrowser){
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token)
    } else {
      localStorage.removeItem(this.TOKEN_KEY)
    }
  }
this.currentToken$.next(token)
console.log(`[setter Token]`,token)
}

set user(user:any){
  if (this.isBrowser) {
    if (user) {
      localStorage.setItem(this.USER_KEY, user)
    } else {
      localStorage.removeItem(this.USER_KEY)
    }
  }
  this.currentUser$.next(user)
console.log(`[setter User]`,user)
}

get token(): string|null{
  return this.currentToken$.getValue()
}

get user():any{
  return this.currentUser$.getValue()
} 
}