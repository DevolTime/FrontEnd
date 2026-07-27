import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { HttpProducts } from '../../core/services/http-products';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos-new-form',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './productos-new-form.html',
  styleUrl: './productos-new-form.css',
})
export default class ProductosNewForm {

  public productList$ = new BehaviorSubject<any>([]);

  private httpProducts = inject(HttpProducts);
  private router = inject(Router)

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
    this.formData.reset();
  }

  showList() {
    this.viewMode = 'list';
    this.httpProducts.getProduct().subscribe({
      next: (data: any) => {
        this.ngOnInit();
        this.productos = data;
      },
      error: (err: any) => {
        console.error('Error al listar', err);
      }
    });
  }

  onsubmit() {

    if (this.formData.valid) {
      this.httpProducts.NewProduct(this.formData.value).subscribe({
        next: (data: any) => {
          console.log('Creado con éxito', data);
        },
        error: (error: any) => {
          console.error('Error al guardar', error);
        }
      });
    }
  }

  onDelete(id: string) {
    if (id) {
      this.httpProducts.deleteproduct(id).subscribe({
        next: () => {
          console.log('producto eliminada con éxito');
          this.formData.reset();
          this.ProductId = null;
        },
        error: (err) => {
          console.error('Error al eliminar', err);
        }
      });
    } else {
      console.warn('No hay un ID de producto seleccionado para eliminar');
    }

  }
  
  OnEdit(id: string) {
    console.log('edit', id);
    this.router.navigate(['editproducts', id])
  }

  ngOnInit() {

    this.httpProducts.getProduct().subscribe({
      next: (data) => {
        console.log(data);
        this.productList$.next(data.data)
      },
      error: (err) => {
        console.error(err)
      },
      complete: () => {
        console.log('lista todos los productos')
      }
    })
  }

}


