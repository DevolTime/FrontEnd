import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpCategory } from '../../core/services/http-category';  // Revisa que esta ruta sea correcta
import { RouterLink } from '@angular/router';
import { CartFloating } from "../../shared/components/cart-floating/cart-floating";


@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, RouterLink, CartFloating],
  templateUrl: './categoria.html',
  styleUrl: './categoria.css',
})
export class Categoria implements OnInit {
  private categoryService = inject(HttpCategory);

  // Observable conectado directamente al servicio
  categories$: Observable<any[]> = this.categoryService.categories$;

  ngOnInit(): void {
    // ¡Ojo aquí! Si no ejecutas esta línea, las categorías nunca se traen del servidor.
    this.categoryService.loadCategory();
  }

  // 🔹 Manejador si una imagen falla al cargar
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    // Imagen por defecto si la URL no responde o está rota
    imgElement.src = 'assets/images/placeholder.png'; 
  }
}