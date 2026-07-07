import { Routes } from '@angular/router';
import { ROLES } from 'libs/core/auth/auth.constants';
import { AuthGuard } from 'libs/core/guards/auth.guard';
import { RoleGuard } from 'libs/core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'admin/analytics', pathMatch: 'full' },
  {
    path: 'admin',
    children: [
      {
        path: '',
        redirectTo: 'analytics',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: '',
        canActivate: [AuthGuard, RoleGuard],
        data: { role: ROLES.ADMIN },
        children: [
          {
            path: 'analytics',
            loadComponent: () =>
              import('./pages/analytics/analytics.component').then(
                (m) => m.AnalyticsComponent,
              ),
          },
          {
            path: 'orders',
            loadComponent: () =>
              import('./pages/orders/orders.component').then(
                (m) => m.OrdersComponent,
              ),
          },
          {
            path: 'products',
            loadComponent: () =>
              import('./pages/products/products.component').then(
                (m) => m.ProductsComponent,
              ),
          },
        ],
      },
    ],
  },
];
