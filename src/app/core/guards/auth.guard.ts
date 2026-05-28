import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStore } from 'src/app/core/auth/auth.store';
import { SiteService } from '../services/site.services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly siteService = inject(SiteService);
  private readonly site = this.siteService.currentSite();

  canActivate(): boolean {
    if (this.authStore.isAuthenticated()) {
      return true;
    }
    this.router.navigate([`${this.site}/auth/login`]);
    return false;
  }
}
