import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpCategory } from '../../core/services/http-category';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './category-edit-form.html',
  styleUrl: './category-edit-form.css',
})
export default class CategoryEditForm implements OnInit {
  // Inyección de servicios esenciales mediante inject()
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private httpCategory = inject(HttpCategory);

  // Variables de estado del componente
  categoryId: string | null = null;
  formData: FormGroup;
  viewMode: 'form' | 'list' = 'form';

  // Control de imagen previa y nuevo archivo binario
  currentImageUrl: string = '';
  selectedFile: File | null = null;

  constructor() {
    // Declaración del formulario reactivo con sus validaciones
    this.formData = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      status: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    // 1. Capturamos el parámetro 'id' desde la ruta activa (/categories/edit/:id)
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id');
      if (this.categoryId) {
        this.loadCategoryData(this.categoryId);
      }
    });
  }

  // Consulta la categoría por su ID al backend y llena el formulario
  loadCategoryData(id: string): void {
    console.log('Cargando datos para la categoría con ID:', id);

    this.httpCategory.getCategoryById(id).subscribe({
      next: (res: any) => {
        const categoryData = res.data || res;

        // Guarda la URL existente para mostrar la vista previa en el HTML
        this.currentImageUrl = categoryData.urlImage || categoryData.image || '';

        // Rellena los valores en el formulario reactivo
        this.formData.patchValue({
          name: categoryData.name,
          status: categoryData.status
        });
      },
      error: (err) => {
        console.error('Error al cargar la categoría', err);
      }
    });
  }

  // Captura el archivo binario desde el input de la plantilla HTML
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Procesa la actualización enviando un objeto FormData al backend
  onSubmit(): void {
    if (this.formData.valid && this.categoryId) {
      // Modal de confirmación con SweetAlert2
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡Deseas actualizar esta categoría!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, actualizar"
      }).then((result) => {
        if (result.isConfirmed) {

          // Construcción de FormData multipart/form-data
          const dataToSend = new FormData();
          dataToSend.append('name', this.formData.get('name')?.value);
          dataToSend.append('status', this.formData.get('status')?.value);

          // Adjuntamos el archivo binario solo si el usuario seleccionó uno nuevo
          if (this.selectedFile) {
            dataToSend.append('image', this.selectedFile);
          }

          // Envío de la petición PATCH mediante el servicio HTTP
          this.httpCategory.updateCategory(this.categoryId!, dataToSend).subscribe({
            next: (data) => {
              console.log('Categoría actualizada con éxito', data);

              Swal.fire({
                title: "¡Actualizado!",
                text: "La categoría ha sido actualizada correctamente.",
                icon: "success"
              }).then(() => {
                // Navega de regreso al listado de categorías
                this.router.navigate(['/dashboard/registrar-category'], { queryParams: { tab: 'list' } });
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
}