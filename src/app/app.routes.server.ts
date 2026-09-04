import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'dashboard/user/edit/:id', renderMode: RenderMode.Client },
  { path: 'menu/:categoryId', renderMode: RenderMode.Client },
  { path: 'dashboard/categories/edit/:id', renderMode: RenderMode.Client },
  { path: 'dashboard/editproducts/:id', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Prerender }
];