import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpCategory } from '../../../core/services/http-category';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

// Librería para modales y alertas interactivas
import Swal from 'sweetalert2';
import { error } from 'console';

@Component({
  selector: 'app-category-new-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './category-new-form.html',
  styleUrl: './category-new-form.css',
})
export default class CategoryNewForm implements OnInit {

  // Estado reactivo para la lista de categorías
  public categoryList$ = new BehaviorSubject<any[]>([]);

  // Inyección de servicios usando API inject() de Angular
  private route = inject(ActivatedRoute);
  private httpCategory = inject(HttpCategory);
  private router = inject(Router);

  // Formulario reactivo y variables de estado
  formData: FormGroup;
  categoryId: string | null = null;
  selectedFile: File | null = null;
  viewMode: 'form' | 'list' = 'form';
  categories: any[] = [];

  constructor() {
    // Estructura y reglas de validación del formulario
    this.formData = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      image: new FormControl(''),
      status: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    // Escucha parámetros en la URL (ej: /categories?tab=list)
    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab');
      if (tab === 'list') {
        this.viewMode = 'list';
      }
    });
    // Carga inicial de datos desde la API
    this.loadCategories();
  }

  // Captura el archivo de imagen subido desde el input de la plantilla.
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Cambia la vista al formulario de creación y resetea los campos.
  showCreate() {
    this.viewMode = 'form';
    this.resetForm();   // Usamos una función centralizada de reseteo.
  }

  //  Método helper para resetear el formulario.
  private resetForm() {
    this.formData.reset({
      name: '',
      image: '',
      status: '',
    });
    this.selectedFile = null;
  }

  // Cambia la vista al listado y consulta las categorías actualizadas
  showList() {
    this.viewMode = 'list';
    this.httpCategory.getCategories().subscribe({
      next: (data: any) => {
        this.loadCategories();
      },
      error: (err) => console.error('Error al listar categorías:', err)
    });
  }

  // Obtiene y refresca la lista de categorías desde la API de Express
  loadCategories() {
    this.httpCategory.getCategories().subscribe({
      next: (data: any) => {
        // Maneja respuestas con o sin wrapper 'data'
        const list = data.data ? data.data : data;
        this.categoryList$.next(list);
        this.categories = list;
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  // Procesa el envío del formulario mediante multipart/form-data
  onSubmit() {
    if (this.formData.valid) {
      // Objeto FormData para enviar texto + archivo binario
      const body = new FormData();
      body.append('name', this.formData.get('name')?.value);
      body.append('status', this.formData.get('status')?.value);
      // Si seleccionó imagen, la adjunta con la clave 'image' que espera Multer
      if (this.selectedFile) {
        body.append('image', this.selectedFile);
      }
      this.httpCategory.createCategory(body).subscribe({
        next: (data: any) => {
          this.resetForm();      // Usamos el mismo reseteo aquí
          this.loadCategories(); // Refresca el listado automáticamente
        },
        error: (error: any) => {
          console.error('Error al crear categoría:', error);
        }
      });
    }
  }

  // Muestra confirmación modal antes de eliminar un registro
  onDelete(id: string) {
    Swal.fire({
      title: "¿Seguro?",
      text: "¡No se podrá revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        if (id) {
          this.httpCategory.deleteCategory(id).subscribe({
            next: () => {
              Swal.fire({
                title: "¡Eliminado!",
                text: "La categoría y su imagen han sido eliminadas.",
                icon: "success"
              });
              this.formData.reset();
              this.categoryId = null;
              this.loadCategories();
            },
            error: (err) => {
              console.error('Error al eliminar categoría:', err);
              Swal.fire(
                'Error',
                'Hubo un problema al eliminar la categoría.',
                'error'
              );
            }
          });
        }
      }
    });
  }

  // Cambia el estado de la categoria desde el listado
  toggleStatus(category: any): void {
    // Invierte el valor booleano
    const newStatus = !category.status;

    // Creamos un FormData si tu endpoint requiere FormData
    const body = new FormData();
    body.append('name', category.name);
    body.append('status', String(newStatus));

    // Petición a la API
    this.httpCategory.updateCategory(category._id, body).subscribe({
      next: () => {
        // 1. Actualizamos el arreglo local
        this.categories = this.categories.map(item => {
          if (item._id === category._id) {
            return { ...item, status: newStatus };
          }
          return item;
        });

        // 2. Emitimos la copia del arreglo actualizado DENTRO del next
        // Esto hace que el pipe '| async' actualice el HTML en tiempo real
        this.categoryList$.next([...this.categories]);
      },
      error: (err: any) => {
        console.error('Error al cambiar el estatus:', err);
        Swal.fire('Error', 'No se pudo actualizar el estatus', 'error');
      }
    });
  }

// Redirige al módulo de edición de la categoría seleccionada
onEdit(id: string) {
  this.router.navigate(['/dashboard/categories/edit', id]);
}
}