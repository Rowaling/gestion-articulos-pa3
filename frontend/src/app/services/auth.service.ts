import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../config';
import { CredencialesLogin, DatosRegistro, RespuestaAuth, Rol, Usuario } from '../models/usuario.model';

const TOKEN_KEY = 'token';
const USUARIO_KEY = 'usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${API_URL}/auth`;

  // Estado de sesión como signals: la interfaz se actualiza sola al cambiar
  private usuarioSignal = signal<Usuario | null>(this.leerUsuarioGuardado());
  usuario = this.usuarioSignal.asReadonly();
  estaLogueado = computed(() => this.usuarioSignal() !== null);
  esAdmin = computed(() => this.usuarioSignal()?.rol === Rol.Admin);

  // Mensaje que se muestra en el login cuando la sesión terminó sin que el usuario lo pidiera
  avisoSesion = signal('');

  login(credenciales: CredencialesLogin): Observable<RespuestaAuth> {
    return this.http
      .post<RespuestaAuth>(`${this.apiUrl}/login`, credenciales)
      .pipe(tap((res) => this.guardarSesion(res)));
  }

  registrar(datos: DatosRegistro): Observable<RespuestaAuth> {
    return this.http
      .post<RespuestaAuth>(`${this.apiUrl}/registro`, datos)
      .pipe(tap((res) => this.guardarSesion(res)));
  }

  logout(aviso = ''): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    this.usuarioSignal.set(null);
    this.avisoSesion.set(aviso);
    this.router.navigate(['/login']);
  }

  // Devuelve el token solo si existe y no está vencido
  obtenerToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    return token && !this.tokenExpirado(token) ? token : null;
  }

  // Comprueba si hay un token vigente; si venció, cierra la sesión con un aviso
  haySesionValida(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return false;
    }
    if (this.tokenExpirado(token)) {
      this.logout('Tu sesión ha expirado, inicia sesión de nuevo');
      return false;
    }
    return true;
  }

  private guardarSesion(res: RespuestaAuth): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(res.usuario));
    this.usuarioSignal.set(res.usuario);
    this.avisoSesion.set('');
  }

  private leerUsuarioGuardado(): Usuario | null {
    try {
      const guardado = localStorage.getItem(USUARIO_KEY);
      const token = localStorage.getItem(TOKEN_KEY);
      return guardado && token && !this.tokenExpirado(token) ? (JSON.parse(guardado) as Usuario) : null;
    } catch {
      return null;
    }
  }

  // Lee "exp" del payload del JWT. La firma la verifica siempre el backend.
  private tokenExpirado(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return !payload.exp || payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }
}
