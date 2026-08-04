import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class HttpProducts {

    private htpp = inject(HttpClient);
    BASE_URL: String = environment.apiUrl;
    private apiUrl = `${this.BASE_URL}/products`;


    private productsSubject = new BehaviorSubject<any[]>([]);
    public products$ = this.productsSubject.asObservable();

    loadproducts() {
        return this.htpp.get<any>(this.apiUrl).pipe(
            tap((response) => {
                const list = response.data ? response.data : response;

                // 🔹 Aceptamos tanto booleano true como string "true"
                const activeproducts = list.filter((c: any) => c.status === true || c.status === 'true');

                this.productsSubject.next(activeproducts);
            })
        ).subscribe();
    }

    createproducts(formData: FormData) {
        return this.htpp.post<any>(this.apiUrl, formData).pipe(
            tap((response) => {
                const currentList = this.productsSubject.getValue();
                const newproducts = response.data ? response.data : response;

                // 🔹 Solo la agregamos a la vista pública si está activa
                if (newproducts.status === true || newproducts.status === 'true') {
                    this.productsSubject.next([...currentList, newproducts]);
                }

            })

        );

    }
     deleteproducts(id: string) {
        return this.htpp.delete(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                const currentList = this.productsSubject.getValue();
                this.productsSubject.next(currentList.filter(c => c.id !== id && c._id !== id));
            })
        );
    }
     updateproducts(id: string, formData: FormData) {
        return this.htpp.patch<any>(`${this.apiUrl}/${id}`, formData).pipe(
            tap((updateproducts) => {
                const currentList = this.productsSubject.getValue();
                const newList = currentList.map(c => (c.id === id || c._id === id) ? updateproducts : c);
                this.productsSubject.next(newList);
            })
        );
    }




    getProduct() {
        return this.htpp.get<any>('http://localhost:3000/api/products');
    }
    getproductbyid(id: string) {
        return this.htpp.get(`http://localhost:3000/api/products${id}`)
    }
}

