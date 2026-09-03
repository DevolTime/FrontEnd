import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';

@Service()
export class HttpStatus {
    private http =inject(HttpClient)

    getStatus(){

        return this.http.get<any>(`${environment.apiUrl}/status`)
        
    }
}