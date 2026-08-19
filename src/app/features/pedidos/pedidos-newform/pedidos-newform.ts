import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { HttpPedidos } from '../../../core/services/http-pedidos';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos-newform',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pedidos-newform.html',
  styleUrl: './pedidos-newform.css',
})
export default class PedidosNewform implements OnInit {

  public pedidoList$ = new BehaviorSubject<any[]>([]);

  private httpPedidos = inject(HttpPedidos);
  private router = inject(Router);

  formData: FormGroup;

  PedidoId: string | null = null;

  viewMode: 'form' | 'list' = 'form';

  pedidos: any[] = [];

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


  // ==============================
  // MOSTRAR FORMULARIO
  // ==============================

  showCreate(): void {

    this.viewMode = 'form';

    this.resetform();

  }


  // ==============================
  // REINICIAR FORMULARIO
  // ==============================

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


  // ==============================
  // MOSTRAR LISTA
  // ==============================

  showList(): void {

    this.viewMode = 'list';

    this.loadPedidos();

  }


  // ==============================
  // CARGAR PEDIDOS
  // ==============================

  loadPedidos(): void {

    this.httpPedidos.getPedidos().subscribe({

      next: (data: any) => {

        const list = data.data ? data.data : data;

        this.pedidoList$.next(list);

        this.pedidos = list;

      },

      error: (err: any) => {

        console.error(
          'Error al cargar pedidos:',
          err
        );

      }

    });

  }


  // ==============================
  // CREAR PEDIDO
  // ==============================

  onSubmit(): void {

    if (this.formData.invalid) {

      this.formData.markAllAsTouched();

      return;

    }

    const body = {

      direccion_entrega:
        this.formData.get('direccion_entrega')?.value,

      precio_total:
        this.formData.get('precio_total')?.value,

      Productos:
        this.formData.get('Productos')?.value,

      description:
        this.formData.get('description')?.value,

      status:
        this.formData.get('status')?.value

    };


    console.log(
      'Enviando pedido:',
      body
    );


    this.httpPedidos.newPedidos(body).subscribe({

      next: (data: any) => {

        console.log(
          'Pedido creado con éxito:',
          data
        );

        Swal.fire(
          '¡Creado!',
          'El pedido fue creado correctamente.',
          'success'
        );

        this.resetform();

        this.loadPedidos();

      },

      error: (error: any) => {

        console.error(
          'Error al guardar pedido:',
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


  // ==============================
  // ELIMINAR PEDIDO
  // ==============================

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

      if (result.isConfirmed) {

        this.httpPedidos.deletePedidos(id).subscribe({

          next: () => {

            Swal.fire({

              title: '¡Eliminado!',

              text: 'El pedido ha sido eliminado.',

              icon: 'success'

            });

            this.formData.reset();

            this.PedidoId = null;

            this.loadPedidos();

          },

          error: (err: any) => {

            console.error(
              'Error al eliminar pedido:',
              err
            );

            Swal.fire(
              'Error',
              'Hubo un problema al eliminar el pedido.',
              'error'
            );

          }

        });

      }

    });

  }


  // ==============================
  // EDITAR PEDIDO
  // ==============================

  OnEdit(id: string): void {

    this.router.navigate([
      '/dashboard/editpedidos',
      id
    ]);

  }


  // ==============================
  // CAMBIAR ESTADO
  // ==============================

  toggleStatus(pedido: any): void {

    const newStatus =
      pedido.status === 'pendiente'
        ? 'entregado'
        : 'pendiente';


    const body = {

      direccion_entrega:
        pedido.direccion_entrega,

      precio_total:
        String(pedido.precio_total),

      Productos:
        pedido.Productos,

      description:
        pedido.description,

      status:
        newStatus

    };


    this.httpPedidos.updatePedidos(
      pedido._id,
      body
    ).subscribe({

      next: () => {

        this.pedidos = this.pedidos.map(item => {

          if (item._id === pedido._id) {

            return {

              ...item,

              status: newStatus

            };

          }

          return item;

        });


        this.pedidoList$.next([
          ...this.pedidos
        ]);

      },

      error: (err: any) => {

        console.error(
          'Error al cambiar el estatus:',
          err
        );

        Swal.fire(
          'Error',
          'No se pudo actualizar el estatus',
          'error'
        );

      }

    });

  }


  // ==============================
  // INICIALIZAR
  // ==============================

  ngOnInit(): void {

    this.loadPedidos();

  }

}