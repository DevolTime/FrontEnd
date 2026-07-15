import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { features } from 'process';

export const routes: Routes = [
    { path: 'home', component: Home },
    { path: 'login', loadComponent: () => import('./features/login/login').then(m => m.Login) },
    { path: 'register', loadComponent: () => import('./features/register/register').then(m => m.Register) },
    { path: 'checkout', loadComponent: () => import('./features/checkout/checkout').then(m => m.Checkout) },
    { path: 'menu', loadComponent: () => import('./features/menu/menu').then(m => m.Menu) },
    { path: 'categoria', loadComponent: () => import('./features/categoria/categoria').then(m => m.Categoria) },
    { path: 'contacto', loadComponent: () => import('./features/contacto/contacto').then(m => m.Contacto) },
    { path: '404', loadComponent: () => import('./features/page-not-found/page-not-found') },
    { path: 'registrar-category', loadComponent: () => import('./features/category/category-new-form/category-new-form').then(m => m.CategoryNewForm) },
    { path: 'products-details', loadComponent: () => import('./features/products-details/products-details').then(m => m.ProductsDetails) },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: '404', pathMatch: 'full' }
];