import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpStatus {
    private http =inject(HttpClient)

    getStatus(){

        return this.http.get<any>('http://localhost:3000/api/dashboard/status')
    }
}