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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private httpCategory = inject(HttpCategory);

  categoryId: string | null = null;
  formData: FormGroup;
  viewMode: 'form' | 'list' = 'form';
  
  // 🔹 Nuevas propiedades para manejar la imagen correctamente
  currentImageUrl: string = '';
  selectedFile: File | null = null;

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      status: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id');
      if (this.categoryId) {
        this.loadCategoryData(this.categoryId);
      }
    });
  }

  loadCategoryData(id: string): void {
    console.log('Cargando datos para la categoría con ID:', id);

    this.httpCategory.getCategoryById(id).subscribe({
      next: (res: any) => {
        const categoryData = res.data || res;

        // 1. Guardamos la URL de la imagen existente para mostrar la vista previa en el HTML
        this.currentImageUrl = categoryData.urlImage || categoryData.image || '';

        // 2. Rellenamos el formulario SIN tocar el control de la imagen
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

  // 🔹 Captura el archivo seleccionado por el usuario en el <input type="file">
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.formData.valid && this.categoryId) {
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
          
          // 🔹 Creamos un FormData nativo para enviar texto y archivo (Multer)
          const dataToSend = new FormData();
          dataToSend.append('name', this.formData.get('name')?.value);
          dataToSend.append('status', this.formData.get('status')?.value);

          // Si el usuario seleccionó una imagen NUEVA, la agregamos
          if (this.selectedFile) {
            dataToSend.append('image', this.selectedFile);
          }

          this.httpCategory.updateCategory(this.categoryId!, dataToSend).subscribe({
            next: (data) => {
              console.log('Categoría actualizada con éxito', data);

              Swal.fire({
                title: "¡Actualizado!",
                text: "La categoría ha sido actualizada correctamente.",
                icon: "success"
              }).then(() => {
                this.router.navigate(['/registrar-category'], { queryParams: { tab: 'list' } });
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