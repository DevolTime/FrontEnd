import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})


export class HttpPedidos {


  private http = inject(HttpClient);
  BASE_URL: String = environment.apiUrl;

  private apiUrl = `${this.BASE_URL}/pedidos`;

  newPedidos(pedido: any): Observable<any> {

    return this.http.post(

      this.apiUrl,

      pedido

    );

  }


  getPedidos(): Observable<any> {

    return this.http.get(

      this.apiUrl

    );

  }


  deletePedidos(id: string): Observable<any> {

    return this.http.delete(

      `${this.apiUrl}/${id}`

    );

  }


  updatePedidos(
    id: string,
    pedido: any
  ): Observable<any> {

    return this.http.patch(

      `${this.apiUrl}/${id}`,

      pedido

    );

  }

}