import { Routes } from '@angular/router';

const loadOrdersComponent = () =>
  import('./pages/orders/orders.component').then((m) => m.OrdersComponent);

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: loadOrdersComponent,
  },
  {
    path: 'my-orders',
    loadComponent: loadOrdersComponent,
  },
  {
    path: 'confirmation/:orderId',
    loadComponent: () =>
      import('./pages/order-confirmation/order-confirmation.component').then(
        (m) => m.OrderConfirmationComponent,
      ),
  },
];
