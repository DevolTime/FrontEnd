import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpCategory } from '../../core/services/http-category';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-edit-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-edit-form.html',
  styleUrl: './category-edit-form.css',
})
export default class CategoryEditForm {
  private route = inject(ActivatedRoute);
  private Router = inject(Router)
  private httpCategory = inject(HttpCategory);

  categoryId: string | null = null;
  formData: FormGroup;
  viewMode: 'form' | 'list' = 'form';

onSubmit() {
  if (this.formData.valid && this.categoryId) {
    Swal.fire({
      title: "¿Estás seguro?", // Cambiado a un texto acorde
      text: "¡Deseas actualizar esta categoría!", // Texto adaptado
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, actualizar" // Texto adaptado
    }).then((result) => {
      // Es una buena práctica usar llaves para el if
      if (result.isConfirmed) {
        this.httpCategory.updateCategory(this.categoryId!, this.formData.value).subscribe({
          next: (data) => {
            console.log('Categoría actualizada con éxito', data);

            Swal.fire({
              title: "¡Actualizado!", // Título correcto
              text: "La categoría ha sido actualizada correctamente.", // Texto correcto
              icon: "success"
            }).then(() => {
              this.Router.navigate(['/registrar-category'], { queryParams: { tab: 'list' } });
            });
          },
          error: (err) => {
            console.error('Error al actualizar', err);
            Swal.fire(
              'Error',
              'Hubo un problema al actualizar la categoría.',
              'error'
            );
          }
        });
      }
    });
  }
}

  selectedId!: string | null;
  private activatedRoutes = inject(ActivatedRoute)

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      image: new FormControl(''),
      status: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id');
      if (this.categoryId) {
        this.loadCategoryData(this.categoryId)
      }
    })
  }

  loadCategoryData(id: string) {
    console.log('Cargando datos para la categoría con ID:', id);

    // Petticion al servicio para obtener lso datos
    this.httpCategory.getCategoryById(id).subscribe({
      next: (res: any) => {

        // ajusta el res.data o el res, segun responda
        const categoryData = res.data || res;

        // Rellena el forulario con los datos existentes
        this.formData.patchValue({
          name: categoryData.name,
          image: categoryData.urlImage,
          status: categoryData.status
        })
      },
      error: (err) => {
        console.error('Error al cargar la categoría', err);
      }
    })
  }
}