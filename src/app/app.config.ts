import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { MockAuthInterceptor } from 'src/app/core/interceptors/mock-auth.interceptor';
import { AuthInterceptor } from 'src/app/core/interceptors/auth.interceptor';
import { environment } from 'src/environments/environment';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { translateLoaderFactory } from 'src/app/core/i18n/translate-loader';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { productFeature } from 'src/app/features/products/store/products.reducer';
import { ProductEffects } from 'src/app/features/products/store/products.effects';
import { CheckoutConfigService } from 'src/app/features/checkout/services/checkout-config.service';
import { cartFeature } from './features/cart/store/cart.reducer';
import { CartEffects } from './features/cart/store/cart.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ...(environment.useMockAuth
      ? [
          {
            provide: HTTP_INTERCEPTORS,
            useClass: MockAuthInterceptor,
            multi: true,
          },
        ]
      : []),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    CheckoutConfigService,
    provideAppInitializer(() => {
      const configService = inject(CheckoutConfigService);
      return configService.loadCheckoutConfig();
    }),
    provideStore({
      [productFeature.name]: productFeature.reducer,
      [cartFeature.name]: cartFeature.reducer,
    }),
    provideEffects([ProductEffects, CartEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
