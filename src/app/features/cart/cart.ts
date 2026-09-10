import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpCart } from '../../core/services/http-cart';
import { HttpPedidos } from '../../core/services/http-pedidos';
import { HttpAuth } from '../../core/services/http-auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe, ReactiveFormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private cartService = inject(HttpCart);
  private pedidosService = inject(HttpPedidos);
  private httpAuth = inject(HttpAuth);

  cart$: Observable<any> = this.cartService.cart$;

  paymentStep: 'choice' | 'restaurante' | 'domicilio' | null = null;

  restauranteForm: FormGroup;
  domicilioForm: FormGroup;

  currentUser: any;

  constructor() {
    this.restauranteForm = new FormGroup({
      name_usuario: new FormControl('', [Validators.required]),
      metodo_pago: new FormControl('Efectivo', [Validators.required])
    });

    this.domicilioForm = new FormGroup({
      name_usuario: new FormControl('', [Validators.required]),
      direccion_entrega: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      direccion_opcional: new FormControl('', [Validators.maxLength(50)]),
      barrio: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      telefeno: new FormControl('', [Validators.required]),
      productos: new FormControl('', [Validators.required]),
      precio_total: new FormControl(0, [Validators.required, Validators.min(0)])
    });
  }

  ngOnInit(): void {
    this.cartService.loadCart().subscribe();
    this.httpAuth.user$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  items(cart: any): any[] {
    return cart?.items ?? [];
  }

  total(cart: any): number {
    return this.items(cart).reduce(
      (sum, item) => sum + (item.price ?? item.product?.price ?? 0) * item.quantity,
      0
    );
  }

  userName(): string {
    const u = this.currentUser;
    if (!u) {
      return '';
    }
    const name = u.user?.name ?? u.name ?? '';
    const lastname = u.user?.lastname ?? u.lastname ?? '';
    return `${name} ${lastname}`.trim();
  }

  productsSummary(cart: any): string {
    return this.items(cart)
      .map((item) => `${item.product?.name ?? 'Producto'} x${item.quantity}`)
      .join(', ');
  }

  getProductosList(productos: string): string[] {
    if (typeof productos !== 'string' || !productos.trim()) {
      return [];
    }
    return productos
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
  }

  selectPaymentMode(mode: 'restaurante' | 'domicilio'): void {
    this.paymentStep = mode;
    if (mode === 'restaurante') {
      this.restauranteForm.patchValue({ name_usuario: this.userName() });
    }
    if (mode === 'domicilio') {
      const cart = this.cartService.cart;
      this.domicilioForm.patchValue({
        name_usuario: this.userName(),
        productos: this.productsSummary(cart),
        precio_total: this.total(cart)
      });
    }
  }

  backToChoice(): void {
    this.paymentStep = 'choice';
  }

  emptyCartAndClear(): void {
    this.cartService.clearCart().subscribe({
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.msg || 'No se pudo vaciar el carrito',
          confirmButtonColor: '#E65100'
        });
      }
    });
  }

  payRestaurante(): void {
    if (this.restauranteForm.invalid) {
      this.restauranteForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor complete todos los campos.',
        confirmButtonColor: '#E65100'
      });
      return;
    }

    const cart = this.cartService.cart;
    const body = {
      name_usuario: this.restauranteForm.get('name_usuario')?.value,
      direccion_entrega: 'En restaurante',
      direccion_opcional: '',
      barrio: 'En restaurante',
      telefeno: '0000000000',
      productos: this.productsSummary(cart),
      precio_total: Number(this.total(cart)),
      status: 'Pendiente',
      metodo_pago: this.restauranteForm.get('metodo_pago')?.value
    };

    this.pedidosService.newPedidos(body).subscribe({
      next: () => {
        this.emptyCartAndClear();
        this.paymentStep = null;
        Swal.fire({
          icon: 'success',
          title: '¡Pedido confirmado!',
          text: 'Tu pedido para comer en el restaurante fue enviado.',
          confirmButtonColor: '#E65100'
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.msg || 'No se pudo enviar el pedido',
          confirmButtonColor: '#E65100'
        });
      }
    });
  }

  submitDomicilio(): void {
    if (this.domicilioForm.invalid) {
      this.domicilioForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor complete todos los campos.',
        confirmButtonColor: '#E65100'
      });
      return;
    }

    const f = this.domicilioForm;
    const body = {
      name_usuario: f.get('name_usuario')?.value,
      direccion_entrega: f.get('direccion_entrega')?.value,
      direccion_opcional: f.get('direccion_opcional')?.value || '',
      barrio: f.get('barrio')?.value,
      telefeno: String(f.get('telefeno')?.value),
      productos: f.get('productos')?.value,
      precio_total: Number(f.get('precio_total')?.value),
      status: 'Pendiente'
    };

    this.pedidosService.newPedidos(body).subscribe({
      next: () => {
        this.emptyCartAndClear();
        this.paymentStep = null;
        Swal.fire({
          icon: 'success',
          title: '¡Pedido enviado!',
          text: 'Tu pedido a domicilio fue enviado correctamente.',
          confirmButtonColor: '#E65100'
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.msg || 'No se pudo enviar el pedido',
          confirmButtonColor: '#E65100'
        });
      }
    });
  }

  totalQuantity(cart: any): number {
    return this.items(cart).reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
  }

  productName(item: any): string {
    return item.product?.name ?? 'Producto';
  }

  productImage(item: any): string {
    return item.product?.urlImage ?? '';
  }

  itemPrice(item: any): number {
    return item.price ?? item.product?.price ?? 0;
  }

  removeItem(item: any): void {
    const productId = item.product?._id ?? item.product?.id;

    if (!productId) {
      return;
    }

    this.cartService.removeItem(productId).subscribe({
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.msg || 'No se pudo eliminar el producto',
          confirmButtonColor: '#E65100'
        });
      }
    });
  }

  incrementQty(item: any): void {
    const productId = item.product?._id ?? item.product?.id;
    if (!productId) {
      return;
    }
    this.cartService.updateItemQuantity(productId, (item.quantity || 1) + 1).subscribe({
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.msg || 'No se pudo actualizar la cantidad',
          confirmButtonColor: '#E65100'
        });
      }
    });
  }

  decrementQty(item: any): void {
    const productId = item.product?._id ?? item.product?.id;
    if (!productId) {
      return;
    }
    const newQty = (item.quantity || 1) - 1;

    // Si llega a 0, se elimina el producto del carrito
    if (newQty <= 0) {
      this.removeItem(item);
      return;
    }

    this.cartService.updateItemQuantity(productId, newQty).subscribe({
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.msg || 'No se pudo actualizar la cantidad',
          confirmButtonColor: '#E65100'
        });
      }
    });
  }

  clearCart(): void {
    if (!this.cartService.cart) {
      return;
    }
    if ((this.cartService.cart?.items ?? []).length === 0) {
      return;
    }

    Swal.fire({
      icon: 'warning',
      title: 'Vaciar carrito',
      text: '¿Seguro que quieres eliminar todos los productos?',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#E65100'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart().subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Carrito vaciado',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err?.error?.msg || 'No se pudo vaciar el carrito',
              confirmButtonColor: '#E65100'
            });
          }
        });
      }
    });
  }
}
