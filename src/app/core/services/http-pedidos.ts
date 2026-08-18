import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpPedidos {

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

}

