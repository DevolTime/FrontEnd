import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpProducts } from '../../../core/services/http-products';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-productos-new-form',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './productos-new-form.html',
  styleUrl: './productos-new-form.css',
})
export class ProductosNewForm {
  private HttpProducts = inject (HttpProducts);

  constructor (){
  this.formData = new FormGroup ({
       name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      image: new FormControl(''),
      status: new FormControl('', [Validators.required]),
  })
}
};





