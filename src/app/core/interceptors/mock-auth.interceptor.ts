import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { PERMISSIONS, ROLES } from 'src/app/core/auth/auth.constants';
import {
  AuthSession,
  LoginDto,
  User,
} from 'src/app/core/auth/auth.models';
import { SiteService } from 'src/app/core/services/site.services';

@Injectable()
export class MockAuthInterceptor implements HttpInterceptor {
  private readonly siteService = inject(SiteService);
  private readonly mockUser: User = {
    id: '52a0adc1-25d3-4cac-9154-48649ebe9d16',
    email: 'admin@example.com',
    fullName: 'Sample Admin',
    roles: [ROLES.ADMIN],
    permissions: [
      PERMISSIONS.INVENTORY_READ,
      PERMISSIONS.INVENTORY_UPDATE,
      PERMISSIONS.ORDERS_CANCEL,
      PERMISSIONS.ORDERS_READ,
      PERMISSIONS.ORDERS_UPDATE,
      PERMISSIONS.PRODUCTS_CREATE,
      PERMISSIONS.PRODUCTS_DELETE,
      PERMISSIONS.PRODUCTS_READ,
      PERMISSIONS.PRODUCTS_UPDATE,
      PERMISSIONS.USERS_MANAGE,
      PERMISSIONS.USERS_READ,
    ],
  };

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const apiPath = this.getApiPath(req.url);

    if (apiPath === '/geo/country' && req.method === 'GET') {
      return of(
        new HttpResponse({
          status: 200,
          body: { code: 'ph' },
        }),
      ).pipe(delay(100));
    }

    if (apiPath === '/auth/login' && req.method === 'POST') {
      const body = req.body as Partial<LoginDto> | null;

      return of(
        new HttpResponse({
          status: 200,
          body: this.createMockSession(body?.email),
        }),
      ).pipe(delay(800));
    }

    if (apiPath === '/auth/register' && req.method === 'POST') {
      return of(
        new HttpResponse({
          status: 201,
        }),
      ).pipe(delay(800));
    }

    if (apiPath === '/auth/session' && req.method === 'GET') {
      return of(
        new HttpResponse({
          status: 200,
          body: this.createMockSession(),
        }),
      ).pipe(delay(300));
    }

    if (apiPath === '/auth/logout' && req.method === 'POST') {
      return of(
        new HttpResponse({
          status: 204,
        }),
      ).pipe(delay(300));
    }

    return next.handle(req);
  }

  private getApiPath(url: string): string | null {
    if (!url.startsWith('/api/')) {
      return null;
    }

    const segments = url.slice('/api/'.length).split('/');

    return this.siteService.isSupportedSite(segments[0])
      ? `/${segments.slice(1).join('/')}`
      : `/${segments.join('/')}`;
  }

  private createMockSession(email = this.mockUser.email): AuthSession {
    return {
      user: {
        ...this.mockUser,
        email,
      },
      session: {
        id: 'f48e7a9fc19d4a73b48d4e0720415073',
        createdAtUtc: '2026-06-12T21:37:26.126677+00:00',
        expiresAtUtc: '2026-06-12T23:37:26.126677+00:00',
      },
    };
  }
}
