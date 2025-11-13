import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../app/layout-component/layout-component').then((m) => m.LayoutComponent),
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
];
