import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpCategory } from '../../core/services/http-category';  // Revisa que esta ruta sea correcta

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule],
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
}