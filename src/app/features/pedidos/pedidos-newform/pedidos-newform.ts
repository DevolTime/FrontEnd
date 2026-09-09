import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CurrencyPipe } from '@angular/common';

import { BehaviorSubject } from 'rxjs';

import { HttpPedidos } from '../../../core/services/http-pedidos';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-pedidos-newform',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    CurrencyPipe
  ],

  templateUrl: './pedidos-newform.html',

  styleUrl: './pedidos-newform.css',
})


export default class PedidosNewform implements OnInit {


  // ==========================================
  // SERVICIOS
  // ==========================================

  private httpPedidos = inject(HttpPedidos);

  private router = inject(Router);


  // ==========================================
  // LISTA
  // ==========================================

  public pedidoList$ =
    new BehaviorSubject<any[]>([]);

  public pedidos: any[] = [];


  // ==========================================
  // FORMULARIO ADMIN
  // ==========================================

  public formData: FormGroup;


  // ==========================================
  // ID
  // ==========================================

  public PedidoId: string | null = null;


  // ==========================================
  // VISTA
  // ==========================================

  public viewMode: 'form' | 'list' = 'form';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor() {

    this.formData = new FormGroup({

      direccion_entrega: new FormControl('', [
        Validators.required
      ]),

      precio_total: new FormControl('', [
        Validators.required
      ]),

      Productos: new FormControl('', [
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


  // ==========================================
  // CREAR
  // ==========================================

  showCreate(): void {

    this.viewMode = 'form';

    this.resetform();

  }


  // ==========================================
  // LISTAR
  // ==========================================

  showList(): void {

    console.log('LISTAR PRESIONADO');

    this.viewMode = 'list';

    this.httpPedidos.getPedidos().subscribe({

      next: (data: any) => {

        console.log('RESPUESTA DEL BACKEND:', data);

        const lista = data?.data ?? data;

        console.log('LISTA:', lista);

        this.pedidos = Array.isArray(lista)
          ? lista
          : [];

        this.pedidoList$.next(this.pedidos);

      },

      error: (error: any) => {

        console.error('ERROR GET PEDIDOS:', error);

      }

    });

  }


  // ==========================================
  // LIMPIAR
  // ==========================================

  private resetform(): void {

    this.formData.reset({

      direccion_entrega: '',

      precio_total: '',

      Productos: '',

      description: '',

      status: ''

    });

    this.PedidoId = null;

  }


  // ==========================================
  // CARGAR PEDIDOS
  // ==========================================

  loadPedidos(): void {

    this.httpPedidos.getPedidos().subscribe({

      next: (data: any) => {

        console.log(
          'Pedidos recibidos:',
          data
        );


        const lista = data?.data
          ? data.data
          : data;


        this.pedidos =
          Array.isArray(lista)
            ? lista
            : [];


        this.pedidoList$.next(
          this.pedidos
        );


        console.log(
          'Pedidos para mostrar:',
          this.pedidos
        );

      },


      error: (error: any) => {

        console.error(
          'Error al cargar pedidos:',
          error
        );


        Swal.fire(
          'Error',
          'No se pudieron cargar los pedidos.',
          'error'
        );

      }

    });

  }


  // ==========================================
  // CREAR PEDIDO DESDE ADMIN
  // ==========================================

  onSubmit(): void {

    if (this.formData.invalid) {

      this.formData.markAllAsTouched();

      return;

    }


    const body = {

      direccion_entrega:
        this.formData.get(
          'direccion_entrega'
        )?.value,

      precio_total:
        this.formData.get(
          'precio_total'
        )?.value,

      Productos:
        this.formData.get(
          'Productos'
        )?.value,

      description:
        this.formData.get(
          'description'
        )?.value,

      status:
        this.formData.get(
          'status'
        )?.value

    };


    this.httpPedidos.newPedidos(body).subscribe({

      next: () => {

        Swal.fire(
          '¡Creado!',
          'El pedido fue creado correctamente.',
          'success'
        );


        this.resetform();


        this.viewMode = 'list';


        this.loadPedidos();

      },


      error: (error: any) => {

        console.error(
          'Error al crear pedido:',
          error
        );


        Swal.fire(
          'Error',
          'Hubo un problema al crear el pedido.',
          'error'
        );

      }

    });

  }


  // ==========================================
  // ELIMINAR
  // ==========================================

  onDelete(id: string): void {

    Swal.fire({

      title: '¿Seguro?',

      text: '¡No se podrá revertir esto!',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#3085d6',

      cancelButtonColor: '#d33',

      confirmButtonText: '¡Sí, eliminar!',

      cancelButtonText: 'Cancelar'

    }).then((result) => {

      if (!result.isConfirmed) {
        return;
      }


      this.httpPedidos.deletePedidos(id).subscribe({

        next: () => {

          Swal.fire(
            '¡Eliminado!',
            'El pedido ha sido eliminado.',
            'success'
          );


          this.loadPedidos();

        },


        error: (error: any) => {

          console.error(
            'Error al eliminar:',
            error
          );


          Swal.fire(
            'Error',
            'No se pudo eliminar el pedido.',
            'error'
          );

        }

      });

    });

  }


  // ==========================================
  // EDITAR
  // ==========================================

  OnEdit(id: string): void {

    this.router.navigate([
      '/dashboard/editpedidos',
      id
    ]);

  }


  // ==========================================
  // CAMBIAR ESTADO
  // ==========================================

  toggleStatus(pedido: any): void {

    const newStatus =
      pedido.status === 'pendiente'
        ? 'entregado'
        : 'pendiente';


    const body = {

      name_usuario:
        pedido.name_usuario,

      direccion_entrega:
        pedido.direccion_entrega,

      direccion_opcional:
        pedido.direccion_opcional,

      barrio:
        pedido.barrio,

      telefeno:
        pedido.telefeno,

      productos:
        pedido.productos,

      precio_total:
        String(pedido.precio_total),

      status:
        newStatus

    };


    this.httpPedidos.updatePedidos(
      pedido._id,
      body
    ).subscribe({

      next: () => {

        this.pedidos =
          this.pedidos.map(
            (item: any) => {

              if (
                item._id === pedido._id
              ) {

                return {
                  ...item,
                  status: newStatus
                };

              }

              return item;

            }
          );


        this.pedidoList$.next([
          ...this.pedidos
        ]);

      },


      error: (error: any) => {

        console.error(
          'Error al cambiar estado:',
          error
        );


        Swal.fire(
          'Error',
          'No se pudo actualizar el estado.',
          'error'
        );

      }

    });

  }


  // ==========================================
  // INICIAR
  // ==========================================

  ngOnInit(): void {

    this.loadPedidos();

  }

}