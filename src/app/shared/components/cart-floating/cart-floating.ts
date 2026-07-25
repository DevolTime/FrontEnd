import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cart-floating',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './cart-floating.html',
  styleUrl: './cart-floating.css',
})
export class CartFloating implements OnInit {
  private router = inject(Router);

  faShoppingCart = faShoppingCart;
  isVisible = false;
  cartItemCount = 0;

  private allowedRoutes = ['/home', '/menu', '/categoria', '/'];

  ngOnInit(): void {
    // 1. Evaluar la ruta actual inmediatamente al cargar la página
    this.checkVisibility(this.router.url);

    // 2. Escuchar cambios de ruta futuros
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkVisibility(event.urlAfterRedirects);
      });
  }

  private checkVisibility(currentUrl: string): void {
    // Compara si la URL empieza con alguna de las rutas permitidas
    this.isVisible = this.allowedRoutes.some(route => 
      route === '/' ? currentUrl === '/' : currentUrl.startsWith(route)
    );
  }

  openCart(): void {
    console.log('Abriendo carrito...');
  }
}