import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpCategory } from '../../../core/services/http-category';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-category-new-form',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './category-new-form.html',
  styleUrl: './category-new-form.css',
})
export default class CategoryNewForm {

  public categoryList$ = new BehaviorSubject<any>([]);

  private route = inject(ActivatedRoute)
  private httpCategory = inject(HttpCategory);
  private router = inject(Router);
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
        this.ngOnInit();
        this.categories = data;
      },
      error: (err) => console.error('Error al listar', err)
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      this.httpCategory.createCategory(this.formData.value).subscribe({
        next: (data: any) => {
          this.formData.reset();
          console.log('Creado con éxito', data);
        },
        error: (error: any) => {
          console.error('Error al guardar', error);
        }
      });
    }
  }

  onDelete(id: string) {

    // Ventana emergente de SweetAlert
    Swal.fire({
      title: "¿Seguro?",
      text: "¡No se podra revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar!"
    }).then((result) => {

      // 1 Validamos si el usuario confirmo la accion
      if (result.isConfirmed) {

        // 2 Validacion si existe el ID antes de hacer la peticion
        if (id) {
          this.httpCategory.deleteCategory(id).subscribe({
            next: () => {
              console.log('Categoría eliminada con éxito');

              // 3 Mostramos el mensaje de exito
              Swal.fire({
                title: "Eliminar!",
                text: "Su archivo ha sido eliminado..",
                icon: "success"
              });

              // 4 Actualizamos el estado
              this.formData.reset();
              this.categoryId = null;
              this.ngOnInit();
            },
            error: (err) => {
              console.error('Error al eliminar', err);
              Swal.fire(
                'Error',
                'Hubo un problema al eliminar la categoría.',
                'error'
              );
            }
          });
        } else {
          console.warn('No hay un ID de categoría seleccionado para eliminar');
        }
      }
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab');
      if (tab === 'list') {
        this.showList();
      }
    })

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
        console.log('Lista de las categorias')
      }
    });
    // Esto es solo para pruebas temporales
    // Pon aquí un ID real de tu base de datos para ver si el botón aparece
  }


  onEdit(id: string) {
    console.log('edit', id);
    this.router.navigate(['categories/edit', id])
  }

}