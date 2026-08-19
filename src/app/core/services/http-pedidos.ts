import { HttpClient } from '@angular/common/http';
<<<<<<< HEAD
import { inject, Injectable } from '@angular/core';
=======
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
>>>>>>> fa24103d67fd1dfd60d12b27710d54f1300b9016

@Injectable({
  providedIn: 'root'
})
export class HttpPedidos {
<<<<<<< HEAD

  private http = inject(HttpClient);

  newPedidos(pedido: any) {
    return this.http.post(
      'http://localhost:3000/api/pedidos',
      pedido
    );
  }

  getPedidos() {
    return this.http.get(
      'http://localhost:3000/api/pedidos'
    );
  }

  deletePedidos(id: string) {
    return this.http.delete(
      `http://localhost:3000/api/pedidos/${id}`
    );
  }

  updatePedidos(id: string, pedido: any) {
    return this.http.patch(
      `http://localhost:3000/api/pedidos/${id}`,
      pedido
    );
  }

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
>>>>>>> fa24103d67fd1dfd60d12b27710d54f1300b9016
}

