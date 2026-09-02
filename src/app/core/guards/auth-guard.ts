import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpAuth } from '../services/http-auth'; // Ajusta la ruta según tu proyecto

export const authGuard: CanActivateFn = (route, state) => {
  const httpAuth = inject(HttpAuth);
  const router = inject(Router);

  // Verificar si existe un token de sesión
  if (httpAuth.token) {
    return true; // Permite el paso a la ruta
  }

  // Si no hay token, redirige al login y bloquea la ruta
  router.navigateByUrl('/login');
  return false;
};