import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpProducts } from '../../../core/services/http-products';
import { form } from '@angular/forms/signals';


@Component({
  selector: 'app-productos-new-form',
  imports: [ReactiveFormsModule, ],
  templateUrl: './productos-new-form.html',
  styleUrl: './productos-new-form.css',
})
export default class ProductosNewForm {
  private HttpProducts = inject (HttpProducts);
    formData: FormGroup;


  constructor (){
  this.formData = new FormGroup ({
       name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
     price : new FormControl ('',[Validators.required]),
     description: new FormControl ('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
  });
}
onSubmit() {

  console.log("Botón presionado");
  console.log(this.formData.value);
  console.log("Formulario válido:", this.formData.valid);

  if (this.formData.valid) {

    this.HttpProducts.NewProduct(this.formData.value).subscribe({
      next: (data: any) => {
        console.log("Producto creado", data);
      },
      error: (error: any) => {
        console.error("Error al guardar", error);
      }
    });

  } else {
    console.log("El formulario no es válido");
  }


}
};




