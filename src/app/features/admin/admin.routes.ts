import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'analytics-dashboard', pathMatch: 'full' },
  {
    path: 'analytics-dashboard',
    loadComponent: () =>
      import('./analytics-dashboard/dashboard.component').then(
        (m) => m.AnalyticsDashboardComponent,
      ),
  },
];
