import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthStore } from 'src/app/core/auth/auth.store';
import { SiteService } from '../services/site.services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly siteService = inject(SiteService);

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> {
    const session = this.authStore.getSessionSnapshot();

    if (session) {
      return true;
    }

    if (session === null) {
      return this.loginUrlTree();
    }

    return this.authService.getSession().pipe(
      tap((currentSession) => this.authStore.setSession(currentSession)),
      map(() => true),
      catchError(() => {
        this.authStore.clearSession();
        return of(this.loginUrlTree());
      }),
    );
  }

  private loginUrlTree(): UrlTree {
    return this.router.createUrlTree([
      `/${this.siteService.getCurrentSite()}/auth/login`,
    ]);
  }
}
