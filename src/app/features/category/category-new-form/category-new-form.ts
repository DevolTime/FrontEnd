import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { maxLength } from '@angular/forms/signals';

@Component({
  selector: 'app-category-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-new-form.html',
  styleUrl: './category-new-form.css',
})
export class CategoryNewForm {
  formData: FormGroup;

  constructor() {
    // Define la estructura equivalente del formulario
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      image: new FormControl(''),
      status: new FormControl(true, Validators.required),
    });
  }
  onSubmit() {
    console.group('Estado deel name');
    console.log('valid (formData)', this.formData.valid);
    console.log('valid (name)', this.formData.get('name')?.valid);
    console.groupEnd;

    // Verifica si el formulario es valido
    if (this.formData.valid) {
      // Mostrar los valores
      console.log(this.formData.value);
    }
  }
}
