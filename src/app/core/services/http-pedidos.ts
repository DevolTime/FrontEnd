import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';

@Service({
  })
export class HttpPedidos {

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

      `${this.apiUrl}/${id}`
    );
  }

  updatePedidos(id: string, pedido: any) {
    return this.http.patch(

      `${this.apiUrl}/${id}`,
      pedido
    );
  }

}