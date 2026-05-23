import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from 'src/app/features/home/home.component';
import { MainLayoutComponent } from 'src/app/layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from 'src/app/layout/auth-layout/auth-layout.component';
import { CheckoutLayoutComponent } from 'src/app/layout/checkout-layout/checkout-layout.component';
import { siteGuard } from 'src/app/core/guards/site.guard';

export const routes: Routes = [
  {
    path: ':site',
    canActivate: [siteGuard],
    children: [
      {
        path: '',
        component: MainLayoutComponent,
        children: [
          {
            path: '',
            component: HomeComponent,
          },
          {
            path: 'admin',
            canActivate: [],
            loadChildren: () =>
              import('./features/admin/admin.routes').then(
                (m) => m.ADMIN_ROUTES,
              ),
          },
          {
            path: 'products',
            loadChildren: () =>
              import('./features/products/products.routes').then(
                (m) => m.PRODUCTS_ROUTES,
              ),
          },
        ],
      },
      {
        path: '',
        component: CheckoutLayoutComponent,
        children: [
          {
            path: 'cart',
            loadChildren: () =>
              import('./features/cart/cart.routes').then((m) => m.CART_ROUTES),
          },
          {
            path: 'checkout',
            // canActivate: [AuthGuard],
            loadChildren: () =>
              import('./features/checkout/checkout.routes').then(
                (m) => m.CHECKOUT_ROUTES,
              ),
          },
        ],
      },
      {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
          },
        ],
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/profile/profile.routes').then(
            (m) => m.PROFILE_ROUTES,
          ),
      },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'ph' },
  { path: '**', redirectTo: 'ph' },
];
