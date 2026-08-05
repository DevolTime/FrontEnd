import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { HttpProducts } from '../../core/services/http-products';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos-new-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './productos-new-form.html',
  styleUrl: './productos-new-form.css',
})
export default class ProductosNewForm implements OnInit {

  public productList$ = new BehaviorSubject<any>([]);

  private route = inject(ActivatedRoute)
  private httpProducts = inject(HttpProducts);
  private router = inject(Router)
  // Control de imagen previa y nuevo archivo binario
  currentImageUrl: string = '';

  selectedFile: File | null = null;

  formData: FormGroup;

  ProductId: string | null = null;

  viewMode: 'form' | 'list' = 'form';

  productos: any[] = [];

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      price: new FormControl('', [
        Validators.required
      ]),
      description: new FormControl('', [
        Validators.required
      ]),
      status: new FormControl('', [
        Validators.required
      ])
    });
  }

  showCreate() {
    this.viewMode = 'form';
    this.resetform()

  }
  private resetform() {
    this.formData.reset({
      name: '',
      image: '',
      status: '',
      description: '',
      price: ''
    });
    this.selectedFile = null
  }

  showList() {
    this.viewMode = 'list';
    this.httpProducts.getProduct().subscribe({
      next: (data: any) => {
        this.loadproducts()
      },
      error: (err: any) => {
        console.error('Error al listar', err);
      }
    });
  }

  loadproducts() {
    this.httpProducts.getProduct().subscribe({
      next: (data: any) => {
        const list = data.data ? data.data : data
        this.productList$.next(list)
        this.productos = list
      },
      error: (err) => {
        console.error('error al cargar productos', err)
      }
    })
  }

  onsubmit() {
    if (this.formData.valid) {
      const body = new FormData();

      // Agregamos los campos de texto
      body.append('name', this.formData.get('name')?.value);
      body.append('status', this.formData.get('status')?.value);
      body.append('description', this.formData.get('description')?.value);
      body.append('price', this.formData.get('price')?.value);

      // 🔴 CAMBIO AQUÍ: Debe llamarse 'urlImage' para coincidir con upload.single('urlImage') del backend
      if (this.selectedFile) {
        body.append('urlImage', this.selectedFile);
      }


      this.httpProducts.createproducts(body).subscribe({
        next: (data: any) => {
          console.log('Creado con éxito', data);
          this.resetform();
          this.loadproducts();
        },
        error: (error: any) => {
          console.error('Error al guardar', error);
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
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpProducts.deleteproducts(id).subscribe({
          next: () => {
            Swal.fire({
              title: "¡Eliminado!",
              text: "El producto y su imagen han sido eliminadas.",
              icon: "success"
            });

            this.formData.reset();
            this.ProductId = null;
            this.loadproducts();
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
    });
  }


  OnEdit(id: string) {
    this.router.navigate(['dashboard/editproducts', id])
  }

  toggleStatus(products: any): void {
    // Invierte el valor booleano

    const newStatus =
      products.status === 'disponible'
        ? 'no disponible'
        : 'disponible';

    const body = new FormData();

    body.append('name', products.name);
    body.append('description', products.description);
    body.append('price', String(products.price));
    body.append('status', newStatus);
    // Petición a la API
    this.httpProducts.updateproducts(products._id, body).subscribe({
      next: () => {
        // 1. Actualizamos el arreglo local
        this.productos = this.productos.map(item => {
          if (item._id === products._id) {
            return { ...item, status: newStatus };
          }
          return item;
        }),
          this.productList$.next([...this.productos])
      },
      error: (err: any) => {
        console.error('Error al cambiar el estatus:', err);
        Swal.fire('Error', 'No se pudo actualizar el estatus', 'error');
      }
    })
  }



  ngOnInit() {

    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab');
      if (tab === 'list') {
        this.viewMode = 'list'
      }
    })
    this.loadproducts()
  }

  onFileSelected(event: any) {
    const files = event.target.files[0];
    if (files) {
      this.selectedFile = files
    }
  }

}


