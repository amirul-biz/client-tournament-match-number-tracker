import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./auth-component/auth-component').then((m) => m.AuthComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('../app/layout-component/layout-component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./layout-component/match-component/match-component').then(
            (m) => m.MatchComponent
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './layout-component/match-component/match-listing-component/match-listing-component'
              ).then((m) => m.MatchListingComponent),
          },
          {
            path: 'Add',
            loadComponent: () =>
              import(
                './layout-component/match-component/match-detail-component/match-detail-component'
              ).then((m) => m.MatchDetailComponent),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
