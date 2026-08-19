import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpCart } from '../../core/services/http-cart';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private cartService = inject(HttpCart);

  cart: any = null;

  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
    });
  }

  get items(): any[] {
    return this.cart?.items ?? [];
  }

  get total(): number {
    return this.items.reduce(
      (sum, item) => sum + (item.price ?? item.product?.price ?? 0) * item.quantity,
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

  clearCart(): void {
    if (this.items.length === 0) {
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
            this.cartService.loadCart().subscribe();
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
