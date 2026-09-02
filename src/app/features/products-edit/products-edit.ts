import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpProducts } from '../../core/services/http-products';
import Swal from 'sweetalert2';
import e from 'express';

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

  productosbyid: string | null = null
  formData: FormGroup
  viewMode: 'form' | 'list' = 'form';

  currentImageUrl: string = ''
  selectedFile: File | null = null

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

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.productosbyid = params.get('id')
      if (this.productosbyid) {
        this.loadproductsdata(this.productosbyid)

      }
    })


  }
  loadproductsdata(id: string): void {
    console.log('cargando datos', id)
    this.httpProducts.getproductbyid(id).subscribe({
      next: (res: any) => {
        const productsdata = res.data || res
        this.currentImageUrl = productsdata.urlImage || productsdata.image || ''
        this.formData.patchValue({
          name: productsdata.name,
          status: productsdata.status,
          price: productsdata.price,
          description: productsdata.description
        })
      },
      error: (err) => {
        console.error('error al cargar el producto', err)
      }
    })
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }


  onSubmit(): void {
    if (this.formData.valid && this.productosbyid) {
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
          const dataToSend = new FormData()
          dataToSend.append('name', this.formData.get('name')?.value)
          dataToSend.append('status', this.formData.get('status')?.value)
          dataToSend.append('price', this.formData.get('price')?.value)
          dataToSend.append('description', this.formData.get('description')?.value)
          if (this.selectedFile) { dataToSend.append('urlImage', this.selectedFile) }
          this.httpProducts.updateproducts(this.productosbyid!, dataToSend).subscribe({
            next: (data) => {
              console.log('producto actualizado con exito', data)
              Swal.fire({
                title: "!actualizado!",
                text: "El producto ha sido actualizado correctamente",
                icon: "success"
              }).then(() => {
                this.router.navigate(['dashboard/ProductosNewForm'], { queryParams: { tab: 'list' } })
              })
            },
            error: (err) => {
              console.error('error al actualizar', err)
              Swal.fire('error', 'hubo un problema al actualizar el producto', 'error')

            }
          })



        }
      })
    }
  }
}