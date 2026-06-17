import { Routes } from '@angular/router';

export const ORDERS_ROUTES: Routes = [
  {
    path: 'confirmation/:orderId',
    loadComponent: () =>
      import('./pages/order-confirmation/order-confirmation.component').then(
        (m) => m.OrderConfirmationComponent,
      ),
  },
];
