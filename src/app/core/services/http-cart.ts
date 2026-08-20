import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpAuth } from './http-auth';

@Service()
export class HttpCart {

    private http = inject(HttpClient);
    private httpAuth = inject(HttpAuth);
    private apiUrl = `${environment.apiUrl}/cart`;

    private cartSubject = new BehaviorSubject<any>(null);
    public cart$ = this.cartSubject.asObservable();

    private cartCountSubject = new BehaviorSubject<number>(0);
    public cartCount$ = this.cartCountSubject.asObservable();

    constructor() {
        // Cargar el carrito en el navegador cuando hay sesión (funciona también
        // al recargar la página con SSR, sin depender de ngOnInit).
        this.httpAuth.token$.subscribe(() => {
            this.loadCart().subscribe();
        });
    }

    headers(): HttpHeaders {
        const token = this.httpAuth.token;

        return new HttpHeaders({
            'X-Token': token || '',
        });
    }

    loadCart(): Observable<any> {
        if (!this.httpAuth.token) {
            this.setCart(null);
            return of(null);
        }

        return this.http.get<any>(this.apiUrl, { headers: this.headers() }).pipe(
            tap((response) => this.setCart(response.data)),
            catchError(() => {
                this.setCart(null);
                return of(null);
            })
        );
    }

    addItem(productId: string) {
        return this.http.post<any>(`${this.apiUrl}/items`, { productId }, { headers: this.headers() }).pipe(
            tap((response) => this.setCart(response.data))
        );
    }

    removeItem(productId: string) {
        return this.http.delete<any>(`${this.apiUrl}/items/${productId}`, { headers: this.headers() }).pipe(
            tap((response) => this.setCart(response.data))
        );
    }

    clearCart() {
        return this.http.delete<any>(this.apiUrl, { headers: this.headers() }).pipe(
            tap((response) => this.setCart(response.data))
        );
    }

    get cartCount(): number {
        return this.cartCountSubject.getValue();
    }

    private setCart(cart: any): void {
        this.cartSubject.next(cart);

        const items = cart?.items ?? [];
        const count = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);

        this.cartCountSubject.next(count);
    }
}
