import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpUsers } from '../../core/services/http-users';
import { HttpProducts } from '../../core/services/http-products';
import { HttpCategory } from '../../core/services/http-category';
import { HttpPedidos } from '../../core/services/http-pedidos';
import { HttpAuth } from '../../core/services/http-auth';
import { BehaviorSubject } from 'rxjs';

interface NavItem {
  label: string;   
  icon: string;      
  route: string;     
  exact?: boolean;   
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,RouterLink, RouterOutlet,AsyncPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export default class Dashboard implements OnInit {
  private httpUsers = inject(HttpUsers);
  private httpProducts = inject(HttpProducts);
  private httpCategory = inject(HttpCategory);
  private httpPedidos = inject(HttpPedidos);
  private httpAuth = inject(HttpAuth);  
  private router = inject(Router);     

  navItems: NavItem[] = [
    { label: 'Dashboard',   icon: '📊', route: '/dashboard', exact: true },
    { label: 'Usuarios',    icon: '👤', route: 'user/list' },
    { label: 'Categorías',  icon: '🗂️', route: 'registrar-category' },
    { label: 'Productos',   icon: '🍔', route: 'ProductosNewForm' },
    { label: 'Pedidos',     icon: '🧾', route: 'PedidosNewForm' },
  ];

  totalUsers= new BehaviorSubject<number>(0);
  totalCategorias= new BehaviorSubject<number>(0);
  totalProductos= new BehaviorSubject<number>(0);
  totalPedidos= new BehaviorSubject<number>(0);
  currentUser$ = this.httpAuth.user$;

  loading: boolean = true;  
  error: string = '';  
  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarPedidos();
  }
  private extraerLista(res: any): any[] {
    if (Array.isArray(res)) return res;             
    if (Array.isArray(res?.data)) return res.data;   
    return [];
  }
 
  cargarUsuarios(): void {
    this.httpUsers.getUsers().subscribe({
      next: (res: any) => {
        console.log('Respuesta usuarios:', res); 
        this.totalUsers.next(this.extraerLista(res).length);
        this.loading = false;
      },
      error: (err) => {
        console.log('Error cargando usuarios', err);
        this.error = 'No se pudo cargar el resumen de usuarios';
        this.loading = false;
      }
    });
  }

  cargarProductos(): void {
    this.httpProducts.getProduct().subscribe({
      next: (res: any) => {
        console.log('Respuesta productos:', res);
        this.totalProductos.next(this.extraerLista(res).length);
      },
      error: (err) => console.log('Error cargando productos', err)
    });
  }

  cargarCategorias(): void {
    this.httpCategory.getCategories().subscribe({
      next: (res: any) => {
        console.log('Respuesta categorías:', res);
        this.totalCategorias.next(this.extraerLista(res).length);
      },
      error: (err) => console.log('Error cargando categorías', err)
    });
  }

  cargarPedidos(): void {
    this.httpPedidos.getPedidos().subscribe({
      next: (res: any) => {
        console.log('Respuesta pedidos:', res);
        this.totalPedidos.next(this.extraerLista(res).length);
      },
      error: (err) => console.log('Error cargando pedidos', err)
    });
  }

  logout(): void {
    this.httpAuth.logoutUser();          
    this.router.navigateByUrl('/login');
  }

}