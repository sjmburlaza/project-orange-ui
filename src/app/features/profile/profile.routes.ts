import { Routes } from '@angular/router';

export const PROFILE_ROUTES: Routes = [
  { path: '', redirectTo: 'account-settings', pathMatch: 'full' },
  {
    path: 'account-settings',
    loadComponent: () =>
      import('./account-settings/account-settings.component').then(
        (m) => m.AccountSettingsComponent,
      ),
  },
];
