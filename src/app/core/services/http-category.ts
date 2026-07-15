import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpCategory {
    // Inyectar una dependencia usando el constructor.
    // constructor (private http: HttpClient){}
    // Inyectar una dependencia sin usar el constructor, implementarse en las funciones.
    private http = inject(HttpClient);

    createCategory(category: any) {

        return this.http.post('http://localhost:3000/api/category', category);
    }

    deleteCategory(id: string) {
        return this.http.delete(`http://localhost:3000/api/category/${id}`);
    }

    getCategories() {
        return this.http.get<any>('http://localhost:3000/api/category');
    }

    getCategoryById(id: string) {
        return this.http.get(`http://localhost:3000/api/category/${id}`);
    }
}