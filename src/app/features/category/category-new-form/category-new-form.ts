import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpCategory } from '../../../core/services/http-category';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-category-new-form',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './category-new-form.html',
  styleUrl: './category-new-form.css',
})
export class CategoryNewForm {
  private httpCategory = inject(HttpCategory);
  formData: FormGroup;

  categoryId: string | null = null;

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      image: new FormControl(''),
      status: new FormControl('', [Validators.required]),
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

  onDelete() {
    // Si hay un ID (categoryId es verdadero), entonces ejecutamos el borrado
    if (this.categoryId) {
      this.httpCategory.deleteCategory(this.categoryId).subscribe({
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
    // Esto es solo para pruebas temporales
    // Pon aquí un ID real de tu base de datos para ver si el botón aparece
    this.categoryId = '6a4f079af96142e7f59362fc';
  }
}