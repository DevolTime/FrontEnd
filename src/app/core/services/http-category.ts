import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, tap } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class HttpCategory {
    // Inyectar una dependencia usando el constructor.
    // constructor (private http: HttpClient){}
    // Inyectar una dependencia sin usar el constructor, implementarse en las funciones.
    private http = inject(HttpClient);

    BASE_URL: String = environment.apiUrl;

    private apiUrl = `${this.BASE_URL}/category`;

    // 1 Estado de la memoria
    private categoriesSubject = new BehaviorSubject<any[]>([]);
    public categories$ = this.categoriesSubject.asObservable();

    // 2 Cargar las categorias y guardarel estado
    loadCategory() {
        return this.http.get<any>(this.apiUrl).pipe(
            tap((response) => {
                const list = response.data ? response.data : response;

                // Reemplaza 'status' por el nombre exacto de tu campo en el schema:
                // (ej. c.status, c.active, c.isActive, c.state)
                const activeCategories = list.filter((c: any) => c.status === true);

                this.categoriesSubject.next(activeCategories);
            })
        ).subscribe();
    }

    // 3 crear categorias
    createCategory(category: any) {
        return this.http.post<any>(this.apiUrl, category).pipe(
            tap((response) => {
                const currentList = this.categoriesSubject.getValue();
                // Si el backend te devuelve { data: nuevaCategoria }, usas response.data
                // Si devuelve directamente la categoría, usas response
                const newCategory = response.data ? response.data : response;

                this.categoriesSubject.next([...currentList, newCategory]);
            })
        );
    }

    // 4. Eliminar y remover directamente de la lista
    deleteCategory(id: string) {
        return this.http.delete(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                const currentList = this.categoriesSubject.getValue();
                this.categoriesSubject.next(currentList.filter(c => c.id !== id && c._id !== id));
            })
        );
    }

    // 5. Actualizar la categoría editada en la lista
    updateCategory(id: string, category: any) {
        return this.http.patch<any>(`${this.apiUrl}/${id}`, category).pipe(
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

    getCategoryById(id: string) {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

}