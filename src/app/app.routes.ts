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
          import('../app/layout-component/match-info-component/match-info-component').then(
            (m) => m.MatchInfoComponent
          ),
        children: [
          {
            path: 'Add',
            loadComponent: () =>
              import(
                '../app/layout-component/match-info-component/match-info-detail-component/match-info-detail-component'
              ).then((m) => m.MatchInfoDetailComponent),
          },
        ],
      },
    ],
  },
];
