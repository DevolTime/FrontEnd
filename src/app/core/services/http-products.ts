import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpProducts {
    private htpp = inject(HttpClient);


    NewProduct(products: any) {
        return this.htpp.post('http://localhost:3000/api/products', products);

    }

    getProduct() {
        return this.htpp.get<any>('http://localhost:3000/api/products');
    }
    getproductbyid(id: string) {
        return this.htpp.get(`http://localhost:3000/api/products${id}`)

    }

    UpdateProduct(id: string, product: any) {
        return this.htpp.patch(`http://localhost:3000/api/products${id}`, product)
    }

    deleteproduct(id: string) {
        return this.htpp.delete(`http://localhost:3000/api/products${id}`)
    }
}

