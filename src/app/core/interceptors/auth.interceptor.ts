import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthStore } from 'src/app/core/auth/auth.store';
import { SiteService } from 'src/app/core/services/site.services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly siteService = inject(SiteService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const authReq = req.url.startsWith('/api/')
      ? req.clone({ withCredentials: true })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authStore.clearSession();

          if (!this.isAuthEndpoint(authReq.url)) {
            void this.router.navigate([
              `/${this.siteService.getCurrentSite()}/auth/login`,
            ]);
          }
        }

        return throwError(() => error);
      }),
    );
  }

  private isAuthEndpoint(url: string): boolean {
    return url.startsWith('/api/auth/');
  }
}
