import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpCategory } from '../../../core/services/http-category';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-category-new-form',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './category-new-form.html',
  styleUrl: './category-new-form.css',
})
export default class CategoryNewForm {

  public categoryList$ = new BehaviorSubject<any>([]);

  private httpCategory = inject(HttpCategory);
  formData: FormGroup;

  categoryId: string | null = null;

  viewMode: 'form' | 'list' = 'form';
  categories: any[] = [];

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      image: new FormControl(''),
      status: new FormControl('', [Validators.required]),
    });
  }

  showCreate() {
    this.viewMode = 'form';
    this.formData.reset();
  }

  showList() {
    this.viewMode = 'list';
    this.httpCategory.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (err) => console.error('Error al listar', err)
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      this.httpCategory.createCategory(this.formData.value).subscribe({
        next: (data: any) => {
          console.log('Creado con éxito', data);
        },
        error: (error: any) => {
          console.error('Error al guardar', error);
        }
      });
    }
  }

  onDelete(id: string) {
    // Si hay un ID (categoryId es verdadero), entonces ejecutamos el borrado
    if (id) {
      this.httpCategory.deleteCategory(id).subscribe({
        next: () => {
          console.log('Categoría eliminada con éxito');
          this.formData.reset();
          this.categoryId = null;
        },
        error: (err) => {
          console.error('Error al eliminar', err);
        }
      });
    } else {
      console.warn('No hay un ID de categoría seleccionado para eliminar');
    }
  }

  ngOnInit() {

    this.httpCategory.getCategories().subscribe({
      next: (data) => {
        console.log(data);
        // asignar lista de categorias a observable
        this.categoryList$.next(data.data); // solo lista de categorias
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('Lista todos los usuarios')
      }
    });
    // Esto es solo para pruebas temporales
    // Pon aquí un ID real de tu base de datos para ver si el botón aparece
  }

  onEdit(id: string) {
    console.log('edit', id);
  }
}