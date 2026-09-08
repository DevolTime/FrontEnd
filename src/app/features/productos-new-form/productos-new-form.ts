import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, forkJoin } from 'rxjs'; // 👈 Importa forkJoin
import { HttpProducts } from '../../core/services/http-products';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpCategory } from '../../core/services/http-category';

@Component({
  selector: 'app-productos-new-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './productos-new-form.html',
  styleUrl: './productos-new-form.css',
})
export default class ProductosNewForm implements OnInit {

  public productList$ = new BehaviorSubject<any[]>([]);
  public categorylist$ = new BehaviorSubject<any[]>([]);

  private route = inject(ActivatedRoute);
  private httpProducts = inject(HttpProducts);
  private router = inject(Router);
  private httpcategorys = inject(HttpCategory);

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
      price: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      urlImage: new FormControl('', []),
      category: new FormControl('', [Validators.required])
    });
  }

  showCreate() {
    this.viewMode = 'form';
    this.resetform();
  }

  private resetform() {
    this.formData.reset({
      name: '',
      price: '',
      description: '',
      status: '',
      urlImage: '',
      category: ''
    });
    this.selectedFile = null;
    this.currentImageUrl = '';
  }

  showList() {
    this.viewMode = 'list';
    this.loadproducts();
  }

  // 🔴 MÉTODO ACTUALIZADO: Cruza los datos de productos y categorías
  loadproducts() {
    forkJoin({
      productsRes: this.httpProducts.getProduct(),
      categoriesRes: this.httpcategorys.getCategories()
    }).subscribe({
      next: ({ productsRes, categoriesRes }) => {
        const rawProducts = productsRes.data ? productsRes.data : productsRes;
        const categories = categoriesRes.data ? categoriesRes.data : categoriesRes;

        // Guardamos las categorías
        this.categorylist$.next(categories);

        // Mapeamos los productos cruzando el ID de la categoría con su nombre
        const mappedProducts = rawProducts.map((prod: any) => {
          const categoryObj = categories.find((cat: any) => cat._id === prod.category);
          return {
            ...prod,
            categoryName: categoryObj ? categoryObj.name : 'Sin categoría'
          };
        });

        this.productos = mappedProducts;
        this.productList$.next(mappedProducts);
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
      }
    });
  }

  onsubmit() {
    if (this.formData.valid) {
      const body = new FormData();
      body.append('name', this.formData.get('name')?.value);
      body.append('status', this.formData.get('status')?.value);
      body.append('description', this.formData.get('description')?.value);
      body.append('price', this.formData.get('price')?.value);
      body.append('category', this.formData.get('category')?.value);

      if (this.selectedFile) {
        body.append('urlImage', this.selectedFile);
      }

      this.httpProducts.createproducts(body).subscribe({
        next: (data: any) => {
          console.log('Creado con éxito', data);
          this.resetform();
          this.router.navigateByUrl('');
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
              text: "El producto y su imagen han sido eliminados.",
              icon: "success"
            });
            this.formData.reset();
            this.ProductId = null;
            this.loadproducts();
          },
          error: (err) => {
            console.error('Error al eliminar producto:', err);
            Swal.fire('Error', 'Hubo un problema al eliminar.', 'error');
          }
        });
      }
    });
  }

  OnEdit(id: string) {
    this.router.navigate(['dashboard/editproducts', id]);
  }

  toggleStatus(products: any): void {
    const newStatus = products.status === 'disponible' ? 'no disponible' : 'disponible';
    const body = new FormData();

    body.append('name', products.name);
    body.append('description', products.description);
    body.append('price', String(products.price));
    body.append('status', newStatus);

    this.httpProducts.updateproducts(products._id, body).subscribe({
      next: () => {
        this.productos = this.productos.map(item => {
          if (item._id === products._id) {
            return { ...item, status: newStatus };
          }
          return item;
        });
        this.productList$.next([...this.productos]);
      },
      error: (err: any) => {
        console.error('Error al cambiar el estatus:', err);
        Swal.fire('Error', 'No se pudo actualizar el estatus', 'error');
      }
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab');
      if (tab === 'list') {
        this.viewMode = 'list';
      }
    });

    this.loadproducts();
  }

  onFileSelected(event: any) {
    const files = event.target.files[0];
    if (files) {
      this.selectedFile = files;
    }
  }
}