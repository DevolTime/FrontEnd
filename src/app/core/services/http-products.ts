import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpProducts {
    private htpp =inject(HttpClient);
    
    NewProduct (products: any ) {
        return this.htpp.post('http://localhost:3000/api/products', products);
    }
}
