import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'manage-orders',
    loadComponent: () =>
      import('./pages/manage-orders/manage-orders.component').then(
        (m) => m.ManageOrdersComponent,
      ),
  },
  {
    path: 'manage-products',
    loadComponent: () =>
      import('./pages/manage-products/manage-products.component').then(
        (m) => m.ManageProductsComponent,
      ),
  },
];
