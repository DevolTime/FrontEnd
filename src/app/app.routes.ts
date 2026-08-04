import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { features } from 'process';

export const routes: Routes = [
    { path: 'home', component: Home },


    { path: 'login', loadComponent: () => import('./features/login/login')},
    {path: 'dashboard/user-new', loadComponent: ()=> import('./features/users/user-new-form/user-new-form').then(m=>m.UserNewForm)},
    {path: 'dashboard/user/edit/:id', loadComponent:()=> import('./features/users/user-edit-form/user-edit-form')},
    { path: 'register', loadComponent: () => import('./features/register/register')},
    //{ path: 'dashboard/checkout', loadComponent: () => import('./features/checkout/checkout').then(m => m.Checkout) },
    { path: 'menu', loadComponent: () => import('./features/menu/menu').then(m => m.Menu) },
    { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard') },
    { path: 'categoria', loadComponent: () => import('./features/categoria/categoria').then(m => m.Categoria) },
    { path: 'contacto', loadComponent: () => import('./features/contacto/contacto').then(m => m.Contacto) },

    { path: 'dashboard/user/list', loadComponent: () => import('./features/users/user-list/user-list') },
    { path: 'cart', loadComponent: () => import('./shared/components/cart-floating/cart-floating').then(m => m.CartFloating) },
    { path: '404', loadComponent: () => import('./features/page-not-found/page-not-found') },
    { path: 'ProductosNewForm', loadComponent: () => import('./features/productos-new-form/productos-new-form') },
    { path: 'editproducts/:id', loadComponent: () => import('./features/products-edit/products-edit') },
    { path: 'PedidosNewForm', loadComponent: () => import('./features/pedidos/pedidos-newform/pedidos-newform') },
    { path: 'dashboard/categories/edit/:id', loadComponent: () => import('./features/category-edit-form/category-edit-form') },
    { path: 'dashboard/registrar-category', loadComponent: () => import('./features/category/category-new-form/category-new-form') },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: '404', pathMatch: 'full' }
];