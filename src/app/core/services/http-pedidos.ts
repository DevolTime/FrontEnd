import { HttpClient } from '@angular/common/http';
<<<<<<< HEAD
import { inject, Service } from '@angular/core';
=======

import { inject, Service, Injectable } from '@angular/core';
>>>>>>> b027718 (arreglo)
import { environment } from '../../../environments/environment';

@Service({

})
export class HttpPedidos {

<<<<<<< HEAD
  private http = inject(HttpClient);
  BASE_URL: string = environment.apiUrl;
  private apiUrl = '${this.BASE_URL}/pedidos';

  newPedidos(Pedidos: any) {
    return this.http.post(this.apiUrl, Pedidos);
  }

  getPedidos() {
    return this.http.get<any>(this.apiUrl);
  }

  getPedidoById(id: string) {
    return this.http.get<any>('${this.apiUrl}/${id}');
  }


  deletePedidos(id: string) {
    return this.http.delete(
      'http://localhost:3000/api/pedidos/${id}'
=======
    private http = inject(HttpClient);
    BASE_URL: string = environment.apiUrl;
    private apiUrl = `${this.BASE_URL}/pedidos`;

    newPedidos(Pedidos: any) {
        return this.http.post(this.apiUrl, Pedidos);
    }

    getPedidos() {
        return this.http.get<any>(this.apiUrl);
    }

    getPedidoById(id: string) {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }


     deletePedidos(id: string) {
    return this.http.delete(
      `http://localhost:3000/api/pedidos/${id}`
>>>>>>> b027718 (arreglo)
    );
  }

  updatePedidos(id: string, pedido: any) {
    return this.http.patch(
<<<<<<< HEAD
      'http://localhost:3000/api/pedidos/${id}',
=======
      `http://localhost:3000/api/pedidos/${id}`,
>>>>>>> b027718 (arreglo)
      pedido
    );
  }

<<<<<<< HEAD
}
=======
}

>>>>>>> b027718 (arreglo)
