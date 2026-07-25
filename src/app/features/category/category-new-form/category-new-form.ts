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
  selectedFile: File | null = null;
  viewMode: 'form' | 'list' = 'form';
  categories: any[] = [];

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      image: new FormControl(''),
      status: new FormControl('', [Validators.required]),
    });
  }

  // Método para capturar la imagen desde el HTML
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  showCreate() {
    this.viewMode = 'form';
    this.formData.reset();
    this.selectedFile = null;
  }

  showList() {
    this.viewMode = 'list';
    this.httpCategory.getCategories().subscribe({
      next: (data: any) => {
        this.loadCategories(); // Refresca la lista sin loops
        this.categories = data;
      },
      error: (err) => console.error('Error al listar', err)
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      // 🔹 Creamos el FormData para soportar multipart/form-data
      const body = new FormData();
      body.append('name', this.formData.get('name')?.value);
      body.append('status', this.formData.get('status')?.value);

      // Adjuntamos el archivo físico con la clave 'image' (que espera Multer en el backend)
      if (this.selectedFile) {
        body.append('image', this.selectedFile);
      }

      // Enviamos 'body' en lugar de 'this.formData.value'
      this.httpCategory.createCategory(body).subscribe({
        next: (data: any) => {
          this.formData.reset();
          this.selectedFile = null; // 🔹 Limpiamos el archivo guardado
          console.log('Creado con éxito', data);
          this.loadCategories(); // Refrescamos la lista
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
              this.loadCategories(); // ✅ Refresca la lista sin llamar a ngOnInit
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
    // Escuchamos la query param para cambiar de vista si viene ?tab=list
    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab');
      if (tab === 'list') {
        this.viewMode = 'list';
      }
    });
    // Cargamos los datos una sola vez al montar el componente
    this.loadCategories();
  }

  // Método dedicado exclusivamente a obtener y refrescar la lista
  loadCategories() {
    this.httpCategory.getCategories().subscribe({
      next: (data: any) => {
        const list = data.data ? data.data : data;
        this.categoryList$.next(list);
        this.categories = list;
        console.log('Lista de las categorias');
      },
      error: (err) => console.error('Error al listar', err)
    });
  }


  onEdit(id: string) {
    console.log('edit', id);
    this.router.navigate(['categories/edit', id])
  }
}