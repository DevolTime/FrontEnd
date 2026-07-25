import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpCategory } from '../../../core/services/http-category';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-category-new-form',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './category-new-form.html',
  styleUrl: './category-new-form.css',
})
export default class CategoryNewForm {
  public categoryList$ = new BehaviorSubject<any[]>([]);

  private route = inject(ActivatedRoute);
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
      status: new FormControl(true, [Validators.required]),
    });
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];
    }
  }

  showCreate() {
    this.viewMode = 'form';
    this.formData.reset({ status: true });
    this.selectedFile = null;
  }

  showList() {
    this.viewMode = 'list';
    this.loadList();
  }

  loadList() {
    this.httpCategory.getCategories().subscribe({
      next: (data: any) => {
        const list = data.data ? data.data : data;
        this.categoryList$.next(list);
      },
      error: (err) => console.error('Error al listar', err)
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      // 1. Preparamos el FormData
      const payload = new FormData();
      payload.append('name', this.formData.get('name')?.value);
      payload.append('status', this.formData.get('status')?.value);

      // 2. Adjuntamos la imagen con el nombre 'archivo' (debe coincidir con Multer)
      if (this.selectedFile) {
        payload.append('archivo', this.selectedFile);
      }

      // 3. ENVIAMOS 'payload' (NO this.formData.value)
      this.httpCategory.createCategory(payload).subscribe({
        next: (data: any) => {
          this.formData.reset({ status: true });
          this.selectedFile = null;
          Swal.fire('¡Éxito!', 'Categoría creada correctamente', 'success');
          this.loadList(); // Refrescar lista
        },
        error: (error: any) => {
          console.error('Error al guardar', error);
          Swal.fire('Error', 'Hubo un error al guardar la categoría', 'error');
        }
      });
    }
  }

  onDelete(id: string) {
    Swal.fire({
      title: "¿Seguro?",
      text: "¡No se podrá revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed && id) {
        this.httpCategory.deleteCategory(id).subscribe({
          next: () => {
            Swal.fire("¡Eliminado!", "La categoría ha sido eliminada.", "success");
            this.loadList();
          },
          error: (err) => {
            Swal.fire('Error', 'Hubo un problema al eliminar la categoría.', 'error');
          }
        });
      }
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab');
      if (tab === 'list') {
        this.showList();
      } else {
        this.loadList();
      }
    });
  }

  onEdit(id: string) {
    this.router.navigate(['categories/edit', id]);
  }
}