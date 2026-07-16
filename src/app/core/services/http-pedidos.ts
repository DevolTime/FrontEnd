import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpPedidos {
    private http = inject (HttpClient);

    newPedidos (Pedidos: any) {
        return this.http.post ('http://localhost:3000/api/pedidos', Pedidos);
    }
}

