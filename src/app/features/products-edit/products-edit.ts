import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpProducts } from '../../core/services/http-products';

@Component({
  selector: 'app-products-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './products-edit.html',
  styleUrl: './products-edit.css',
})
export default class ProductsEdit {

  private activatedRoute = inject(ActivatedRoute);
  private httpProducts = inject(HttpProducts);
  private router = inject(Router);

  viewMode: 'form' | 'list' = 'form';

  selectedId!: string;

  formData = new FormGroup({
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

  ngOnInit(): void {

    this.selectedId = this.activatedRoute.snapshot.paramMap.get('id')!;

    if (this.selectedId) {

      this.httpProducts.getproductbyid(this.selectedId).subscribe({
        next: (response: any) => {

          const product = response.data ?? response;

          this.formData.patchValue({
            name: product.name,
            price: product.price,
            description: product.description,
            status: product.status
          });

        },
        error: (err) => {
          console.error('Error al obtener el producto', err);
        }
      });

    }

  }

  onSubmit(): void {

    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }

    this.httpProducts.UpdateProduct(this.selectedId, this.formData.value).subscribe({
      next: () => {
        alert('Producto actualizado correctamente');
        this.router.navigate(['/ProductosNewForm']);
      },
      error: (err) => {
        console.error('Error al actualizar', err);
      }
    });

  }

}