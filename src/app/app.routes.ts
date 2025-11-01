import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../app/layout-component/layout-component').then((m) => m.LayoutComponent),
  },
];
