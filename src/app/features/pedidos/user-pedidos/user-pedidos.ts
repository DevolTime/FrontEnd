import { Component, inject, OnInit } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CurrencyPipe } from '@angular/common';

import { HttpPedidos } from '../../../core/services/http-pedidos';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-user-pedidos',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    CurrencyPipe
  ],

  templateUrl: './user-pedidos.html',

  styleUrl: './user-pedidos.css'
})


export default class UserPedidos implements OnInit {


  private httpPedidos = inject(HttpPedidos);


  formData: FormGroup;


  pedidos: any[] = [];


  carrito: any[] = [];


  totalCarrito = 0;


  viewMode: 'form' | 'list' = 'form';


  constructor() {

    this.formData = new FormGroup({

      name_usuario: new FormControl('', [
        Validators.required
      ]),

      direccion_entrega: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)
      ]),

      direccion_opcional: new FormControl('', [
        Validators.maxLength(50)
      ]),

      barrio: new FormControl('', [
        Validators.required,
        Validators.maxLength(20)
      ]),

      telefeno: new FormControl('', [
        Validators.required
      ]),

      productos: new FormControl('', [
        Validators.required
      ]),

      precio_total: new FormControl(0, [
        Validators.required,
        Validators.min(0)
      ])

    });

  }


  ngOnInit(): void {

    this.cargarDatosCarrito();

  }


  cargarDatosCarrito(): void {

    const productosCarrito = this.carrito

      .map((item: any) =>
        `${item.name} x${item.cantidad}`
      )

      .join(', ');


    this.formData.patchValue({

      productos: productosCarrito,

      precio_total: this.totalCarrito

    });

  }


  onSubmit(): void {


    if (this.formData.invalid) {

      this.formData.markAllAsTouched();

      Swal.fire(

        'Formulario incompleto',

        'Por favor complete todos los campos.',

        'warning'

      );

      return;

    }


    const body = {

      name_usuario:
        this.formData.get('name_usuario')?.value,

      direccion_entrega:
        this.formData.get('direccion_entrega')?.value,

      direccion_opcional:
        this.formData.get('direccion_opcional')?.value || '',

      barrio:
        this.formData.get('barrio')?.value,

      telefeno:
        String(this.formData.get('telefeno')?.value),

      productos:
        this.formData.get('productos')?.value,

      precio_total:
        Number(this.formData.get('precio_total')?.value),

      status: 'Pendiente'

    };


    console.log(
      'ENVIANDO PEDIDO:',
      body
    );


    this.httpPedidos.newPedidos(body).subscribe({

      next: (response: any) => {


        console.log(
          'PEDIDO GUARDADO EN MONGODB:',
          response
        );


        Swal.fire(

          '¡Pedido enviado!',

          'Tu pedido fue enviado correctamente.',

          'success'

        );


        this.formData.reset({

          name_usuario: '',

          direccion_entrega: '',

          direccion_opcional: '',

          barrio: '',

          telefeno: '',

          productos: '',

          precio_total: 0

        });


      },


      error: (error: any) => {


        console.error(
          'ERROR AL ENVIAR PEDIDO:',
          error
        );


        Swal.fire(

          'Error',

          error?.error?.error ||
          'No se pudo enviar el pedido.',

          'error'

        );

      }

    });

  }

}