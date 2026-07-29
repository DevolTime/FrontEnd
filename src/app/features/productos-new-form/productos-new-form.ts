import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { HttpProducts } from '../../core/services/http-products';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';

@Component({
  selector: 'app-productos-new-form',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './productos-new-form.html',
  styleUrl: './productos-new-form.css',
})
export default class ProductosNewForm implements OnInit{

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
private resetform(){
  this.formData.reset ({
    name : '',
    Image : '',
    status : '',
    description : '',
    price : ''
  });
  this.selectedFile = null
}

  showList() {
    this.viewMode = 'list';
    this.httpProducts.getProduct().subscribe({
      next: (data: any) => {
this.loadproducts ()
      },
      error: (err: any) => {
        console.error('Error al listar', err);
      }
    });
  }
loadproducts (){
  this.httpProducts.getProduct().subscribe({
    next : (data: any) => {
      const list = data.data? data.data: data
      this.productList$.next (list)
      this.productos=list 
    },
    error: (err) =>  console.error('error al cargar productos', error)
  })
}
  onsubmit() {

    if (this.formData.valid) {
const body = new FormData ();
body.append ('name', this.formData.get ('name')?.value)
body.append ('status', this.formData.get ('status')?.value)




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
      this.httpProducts.deleteproducts(id).subscribe({
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

   this.route.queryParamMap.subscribe (params =>{
    const tab = params.get ('tab');
    if (tab==='list '){
      this.viewMode = 'list'
    }
   })
   this.loadproducts()
  }
   onFileSelected(event: any) {
    const files = event.target.files [0];
    if (files){
      this.selectedFile=files
    }
  }

}


