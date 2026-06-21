import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'manage-orders', pathMatch: 'full' },
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
