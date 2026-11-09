import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Solo deja entrar a usuarios con sesión vigente; si no, redirige al login
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.haySesionValida() ? true : router.createUrlTree(['/login']);
};

// Además de la sesión, exige el rol de administrador
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.haySesionValida()) {
    return router.createUrlTree(['/login']);
  }
  return auth.esAdmin() ? true : router.createUrlTree(['/articulos']);
};

// Evita que alguien ya logueado vea de nuevo el login o el registro
export const invitadoGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.haySesionValida() ? router.createUrlTree(['/dashboard']) : true;
};
