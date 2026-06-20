import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list/product-list.component').then(
        (m) => m.ProductListComponent,
      ),
  },
  {
    path: ':productId/configure',
    loadComponent: () =>
      import(
        './pages/product-configurator/product-configurator.component'
      ).then(
        (m) => m.ProductConfiguratorComponent,
      ),
  },
  {
    path: ':productId',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent,
      ),
  },
];
