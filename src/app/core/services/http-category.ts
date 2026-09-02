import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpAuth } from './http-auth';


@Injectable({
    providedIn: 'root'
})
export class HttpCategory {
    // Inyectar una dependencia usando el constructor.
    // constructor (private http: HttpClient){}
    // Inyectar una dependencia sin usar el constructor, implementarse en las funciones.
    private http = inject(HttpClient);

    private httpAuth = inject(HttpAuth);
    BASE_URL: String = environment.apiUrl;

    private apiUrl = `${this.BASE_URL}/category`;

    // 1 Estado de la memoria
    private categoriesSubject = new BehaviorSubject<any[]>([]);
    public categories$ = this.categoriesSubject.asObservable();

    Headers(): HttpHeaders {
        const token = this.httpAuth.token;

        return new HttpHeaders({
            'X-Token': token || '',
        })
    };

    // 2 Cargar las categorias y guardarel estado
    loadCategory() {
        return this.http.get<any>(this.apiUrl, { headers: this.Headers() }).pipe(
            tap((response) => {
                const list = response.data ? response.data : response;

                // 🔹 Aceptamos tanto booleano true como string "true"
                const activeCategories = list.filter((c: any) => c.status === true || c.status === 'true');

                this.categoriesSubject.next(activeCategories);
            })
        ).subscribe();
    }

    // 3 crear categorias
    createCategory(formData: FormData) {
        return this.http.post<any>(this.apiUrl, formData, { headers: this.Headers() }).pipe(
            tap((response) => {
                const currentList = this.categoriesSubject.getValue();
                const newCategory = response.data ? response.data : response;

                // 🔹 Solo la agregamos a la vista pública si está activa
                if (newCategory.status === true || newCategory.status === 'true') {
                    this.categoriesSubject.next([...currentList, newCategory]);
                }
            })
        );
    }

    // 4. Eliminar y remover directamente de la lista
    deleteCategory(id: string) {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.Headers() }).pipe(
            tap(() => {
                const currentList = this.categoriesSubject.getValue();
                this.categoriesSubject.next(currentList.filter(c => c.id !== id && c._id !== id));
            })
        );
    }

    // 5. Actualizar la categoría editada en la lista
    updateCategory(id: string, formData: FormData) {
        return this.http.patch<any>(`${this.apiUrl}/${id}`, formData, { headers: this.Headers() }).pipe(
            tap((updatedCategory) => {
                const currentList = this.categoriesSubject.getValue();
                const newList = currentList.map(c => (c.id === id || c._id === id) ? updatedCategory : c);
                this.categoriesSubject.next(newList);
            })
        );
    }

    getCategories() {
        return this.http.get<any>(this.apiUrl);
    }

    getCategoryById(id: string | null) {
        return this.http.get<any>(`${this.apiUrl}/${id}`, {
            headers: this.Headers()
        });
    }


}