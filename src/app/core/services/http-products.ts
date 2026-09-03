import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpAuth } from './http-auth';

@Service()
export class HttpProducts {

    private htpp = inject(HttpClient);
    BASE_URL: String = environment.apiUrl;
    private htppAuth = inject(HttpAuth)
    private apiUrl = `${this.BASE_URL}/products`;
    private productsSubject = new BehaviorSubject<any[]>([]);
    public products$ = this.productsSubject.asObservable();

    constructor() {
        console.log(this.htppAuth.token)
    }

    headers(): HttpHeaders {
        const token = this.htppAuth.token;

        return new HttpHeaders({
            'X-Token': token || '',
        })
    };

    loadproducts() {
        return this.htpp.get<any>(this.apiUrl, { headers: this.headers() }).pipe(
            tap((response) => {
                const list = response.data ? response.data : response;

                // 🔹 Aceptamos tanto booleano true como string "true"
                const activeproducts = list.filter((c: any) => c.status === true || c.status === 'disponible');

                this.productsSubject.next(activeproducts);
            })
        ).subscribe();
    }

    createproducts(formData: FormData) {
        return this.htpp.post<any>(this.apiUrl, formData, { headers: this.headers() }).pipe(
            tap((response) => {
                const currentList = this.productsSubject.getValue();
                const newproducts = response.data ? response.data : response;

                // 🔹 Solo la agregamos a la vista pública si está activa
                if (newproducts.status === true || newproducts.status === 'disponible') {
                    this.productsSubject.next([...currentList, newproducts]);
                }
            })
        );
    }

    deleteproducts(id: string) {
        return this.htpp.delete(`${this.apiUrl}/${id}`, { headers: this.headers() }).pipe(
            tap(() => {
                const currentList = this.productsSubject.getValue();
                this.productsSubject.next(currentList.filter(c => c.id !== id && c._id !== id));
            })
        );
    }
    updateproducts(id: string, formData: FormData) {
        return this.htpp.patch<any>(`${this.apiUrl}/${id}`, formData, { headers: this.headers() }).pipe(
            tap((updateproducts) => {
                const currentList = this.productsSubject.getValue();
                const newList = currentList.map(c => (c.id === id || c._id === id) ? updateproducts : c);
                this.productsSubject.next(newList);
            })
        );
    }




    getProduct() {
        return this.htpp.get<any>(this.apiUrl);
    }
    getproductbyid(id: string) {
        return this.htpp.get(
            `${this.apiUrl}/${id}`,
            { headers: this.headers() }
        );
    }
}

