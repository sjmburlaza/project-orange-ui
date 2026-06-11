import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthInterceptor } from 'src/app/core/interceptors/auth.interceptor';
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

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useClass: MultiTranslateLoader,
      },
    }),
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
