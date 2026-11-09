import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { ListaArticulos } from './components/lista-articulos/lista-articulos';
import { FormularioArticulo } from './components/formulario-articulo/formulario-articulo';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { adminGuard, authGuard, invitadoGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Públicas (solo para quien aún no inició sesión)
  { path: 'login', component: Login, canActivate: [invitadoGuard] },
  { path: 'registro', component: Registro, canActivate: [invitadoGuard] },

  // Requieren sesión
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'articulos', component: ListaArticulos, canActivate: [authGuard] },
  { path: 'articulos/nuevo', component: FormularioArticulo, canActivate: [authGuard] },

  // Solo administradores
  { path: 'articulos/editar/:id', component: FormularioArticulo, canActivate: [adminGuard] },

  { path: '**', redirectTo: 'dashboard' }
];
