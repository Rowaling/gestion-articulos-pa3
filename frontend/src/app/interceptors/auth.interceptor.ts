import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ErrorApi } from '../models/usuario.model';

const CODIGOS_SESION = ['TOKEN_EXPIRED', 'TOKEN_INVALID', 'NO_TOKEN'];

// Agrega "Authorization: Bearer <token>" a cada petición y, si el backend
// responde que el token venció o es inválido, cierra la sesión.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.obtenerToken();

  const peticion = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      const cuerpo = error.error as ErrorApi | null;
      if (error.status === 401 && cuerpo?.codigo && CODIGOS_SESION.includes(cuerpo.codigo)) {
        auth.logout(cuerpo.mensaje ?? 'Tu sesión ha expirado, inicia sesión de nuevo');
      }
      return throwError(() => error);
    })
  );
};
