import { Routes } from '@angular/router';
import { loginGuard } from './guards/login.guard';
import { ingresoGuard } from './guards/ingreso.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'ingreso',
    pathMatch: 'full',
  },
  {
    path: 'theme',
    loadComponent: () => import('./pages/theme/theme.page').then( m => m.ThemePage)
  },
  {
    path: 'miruta',
    loadComponent: () => import('./pages/miruta/miruta.page').then( m => m.MapPage)
  },
  {
    path: 'correcto',
    loadComponent: () => import('./pages/correcto/correcto.page').then( m => m.CorrectoPage)
  },
  {
    path: 'correo',
    loadComponent: () => import('./pages/correo/correo.page').then( m => m.CorreoPage)
  },
  {
    path: 'incorrecto',
    loadComponent: () => import('./pages/incorrecto/incorrecto.page').then( m => m.IncorrectoPage)
  },
  {
    path: 'ingreso',
    loadComponent: () => import('./pages/ingreso/ingreso.page').then( m => m.IngresoPage),
    canActivate: [loginGuard]
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage)
  },
  {
    path: 'pregunta',
    loadComponent: () => import('./pages/pregunta/pregunta.page').then( m => m.PreguntaPage)
  },
  {
    path: 'registrarse',
    loadComponent: () => import('./pages/registrarse/registrarse.page').then( m => m.RegistrarsePage)
  },
];
