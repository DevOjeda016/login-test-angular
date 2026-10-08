import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./blocks/login-two-column/login-two-column'),
  },
];
