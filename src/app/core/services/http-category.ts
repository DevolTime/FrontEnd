import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment.development';


@Service()
export class HttpCategory {
    // Inyectar una dependencia usando el constructor.
    // constructor (private http: HttpClient){}
    // Inyectar una dependencia sin usar el constructor, implementarse en las funciones.
    private http = inject(HttpClient);

    BASE_URL: String = environment.apiUrl;

    private apiUrl = `${this.BASE_URL}/category`;


    createCategory(category: any) {
        return this.http.post(this.apiUrl, category);
    }

    deleteCategory(id: string) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    getCategories() {
        return this.http.get<any>(this.apiUrl);
    }

    getCategoryById(id: string) {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    updateCategory(id: string, category: any) {
        return this.http.patch(`${this.apiUrl}/${id}`, category)
    }
}