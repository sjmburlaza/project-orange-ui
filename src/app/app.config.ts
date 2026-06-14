import {
  inject,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  PLATFORM_ID,
  provideAppInitializer,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
  withXsrfConfiguration,
} from '@angular/common/http';
import { ApiSitePrefixInterceptor } from 'src/app/core/interceptors/api-site-prefix.interceptor';
import { AuthInterceptor } from 'src/app/core/interceptors/auth.interceptor';
import { MockAuthInterceptor } from 'src/app/core/interceptors/mock-auth.interceptor';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthStore } from 'src/app/core/auth/auth.store';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateLoader } from 'src/app/core/i18n/multi-translate-loader';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { productFeature } from 'src/app/features/products/store/products.reducer';
import { ProductEffects } from 'src/app/features/products/store/products.effects';
import { cartFeature } from './features/cart/store/cart.reducer';
import { CartEffects } from './features/cart/store/cart.effects';
import { tradeInFeature } from './features/trade-in/store/trade-in.reducer';
import { TradeInEffects } from './features/trade-in/store/trade-in.effects';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { catchError, firstValueFrom, map, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SiteService } from 'src/app/core/services/site.services';
import { normalizeSiteCode, SiteConfig } from 'src/app/core/i18n/sites';

const mockInterceptors = environment.useMockAuth
  ? [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: MockAuthInterceptor,
        multi: true,
      },
    ]
  : [];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
      withInterceptorsFromDi(),
    ),
    provideAppInitializer(() => {
      const platformId = inject(PLATFORM_ID);

      if (!isPlatformBrowser(platformId)) {
        return;
      }

      const authService = inject(AuthService);
      const authStore = inject(AuthStore);
      const siteService = inject(SiteService);
      const document = inject(DOCUMENT);
      const initialSite = getSiteFromPath(document.location.pathname);

      return firstValueFrom(
        loadInitialSite(siteService, initialSite).pipe(
          switchMap(() =>
            authService.getSession().pipe(
              tap((session) => authStore.setSession(session)),
              catchError(() => {
                authStore.clearSession();
                return of(null);
              }),
            ),
          ),
        ),
      );
    }),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useClass: MultiTranslateLoader,
      },
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiSitePrefixInterceptor,
      multi: true,
    },
    ...mockInterceptors,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideStore({
      [productFeature.name]: productFeature.reducer,
      [cartFeature.name]: cartFeature.reducer,
      [tradeInFeature.name]: tradeInFeature.reducer,
    }),
    provideEffects([ProductEffects, CartEffects, TradeInEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
  ],
};

function getSiteFromPath(pathname: string): string | null {
  const [site] = pathname.split('/').filter(Boolean);
  return normalizeSiteCode(site);
}

function loadInitialSite(
  siteService: SiteService,
  site: string | null,
) {
  if (!site) {
    return siteService.loadSites().pipe(catchError(() => of([])));
  }

  return siteService.loadSite(site).pipe(
    map((config): SiteConfig[] => (config ? [config] : [])),
    catchError(() => of([])),
  );
}
