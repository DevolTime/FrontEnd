import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpCart } from '../../core/services/http-cart';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private cartService = inject(HttpCart);

  cart$: Observable<any> = this.cartService.cart$;

  ngOnInit(): void {
    this.cartService.loadCart().subscribe();
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
