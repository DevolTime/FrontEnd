import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-pedidos',
  imports: [ReactiveFormsModule],
  templateUrl: './user-pedidos.html',
  styleUrl: './user-pedidos.css',
})
export default class UserPedidos {

  // Datos del carrito (ejemplo)
  carrito: any[] = [];
  totalCarrito = 0;

  formData;

  constructor(private fb: FormBuilder) {

    this.formData = this.fb.group({
      name_usuario: ['', Validators.required],
      direccion_entrega: ['', [Validators.required, Validators.maxLength(50)]],
      direccion_opcional: ['', [Validators.required, Validators.maxLength(50)]],
      barrio: ['', [Validators.required, Validators.maxLength(20)]],
      telefeno: ['', Validators.required],

      productos: [{ value: '', disabled: true }],
      precio_total: [{ value: 0, disabled: true }]
    });

    this.cargarDatosCarrito();
  }

  cargarDatosCarrito(): void {

    const productosCarrito = this.carrito
      .map((item: any) => `${item.name} x${item.cantidad}`)
      .join('\n');

    this.formData.patchValue({
      productos: productosCarrito,
      precio_total: this.totalCarrito
    });

  }

  onSubmit(): void {

    if (this.formData.invalid) return;

    const pedido = {
      ...this.formData.getRawValue(),
      status: 'Pendiente'
    };

    console.log(pedido);

    // this.httpPedidos.newPedidos(pedido).subscribe(...)
  }

}