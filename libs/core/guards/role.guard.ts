import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthService } from 'libs/core/auth/auth.service';
import { AuthStore } from 'libs/core/auth/auth.store';
import { SiteService } from 'libs/core/services/site.services';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly siteService = inject(SiteService);

  canActivate(
    route: ActivatedRouteSnapshot,
  ): boolean | UrlTree | Observable<boolean | UrlTree> {
    const requiredRoles = this.readStringArray(route.data['roles']);
    const requiredRole = this.readString(route.data['role']);
    const requiredPermissions = this.readStringArray(route.data['permissions']);

    if (requiredRole) {
      requiredRoles.push(requiredRole);
    }

    const session = this.authStore.getSessionSnapshot();

    if (session) {
      return this.canAccess(requiredRoles, requiredPermissions);
    }

    if (session === null) {
      return this.loginUrlTree();
    }

    return this.authService.getSession().pipe(
      tap((currentSession) => this.authStore.setSession(currentSession)),
      map(() => this.canAccess(requiredRoles, requiredPermissions)),
      catchError(() => {
        this.authStore.clearSession();
        return of(this.loginUrlTree());
      }),
    );
  }

  private canAccess(
    requiredRoles: readonly string[],
    requiredPermissions: readonly string[],
  ): boolean | UrlTree {
    const hasRequiredRole =
      requiredRoles.length === 0 || this.authStore.hasAnyRole(requiredRoles);
    const hasRequiredPermissions = this.authStore.hasAllPermissions(
      requiredPermissions,
    );

    return hasRequiredRole && hasRequiredPermissions
      ? true
      : this.unauthorizedUrlTree();
  }

  private loginUrlTree(): UrlTree {
    return this.router.createUrlTree([
      `/${this.siteService.getCurrentSite()}/auth/login`,
    ]);
  }

  private unauthorizedUrlTree(): UrlTree {
    return this.router.createUrlTree([
      `/${this.siteService.getCurrentSite()}/products`,
    ]);
  }

  private readString(value: unknown): string | null {
    return typeof value === 'string' ? value : null;
  }

  private readStringArray(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string');
    }

    return typeof value === 'string' ? [value] : [];
  }
}
