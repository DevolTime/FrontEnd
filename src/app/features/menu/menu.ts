import { Component, OnInit, inject  } from '@angular/core';
import { CartFloating } from '../../shared/components/cart-floating/cart-floating';
import { Observable } from 'rxjs';


import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpProducts } from '../../core/services/http-products';


@Component({
  selector: 'app-menu',
  imports: [CartFloating, CommonModule, RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
    private productsService = inject(HttpProducts);

  // Observable conectado directamente al servicio
  products$: Observable<any[]> = this.productsService.products$;

  ngOnInit(): void {
    // ¡Ojo aquí! Si no ejecutas esta línea, las categorías nunca se traen del servidor.
    this.productsService.loadproducts();
  }

  // 🔹 Manejador si una imagen falla al cargar
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    // Imagen por defecto si la URL no responde o está rota
    imgElement.src = 'assets/images/placeholder.png'; 
  }
}
