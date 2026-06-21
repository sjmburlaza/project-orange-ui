import { EnvironmentProviders, Provider } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Actions } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideTranslateService } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PieController,
  PointElement,
  Tooltip,
} from 'chart.js';
import { provideCharts } from 'ng2-charts';

import { cartFeature } from 'src/app/features/cart/store/cart.reducer';
import { productFeature } from 'src/app/features/products/store/products.reducer';
import { tradeInFeature } from 'src/app/features/trade-in/store/trade-in.reducer';

if (typeof HTMLCanvasElement !== 'undefined') {
  type CanvasGetContext = HTMLCanvasElement['getContext'];

  // jsdom does not render canvas; chart component tests assert generated data.
  HTMLCanvasElement.prototype.getContext = (() => null) as CanvasGetContext;
}

const activatedRouteStub = {
  params: of({}),
  queryParams: of({}),
  data: of({}),
  paramMap: of(convertToParamMap({})),
  queryParamMap: of(convertToParamMap({})),
  snapshot: {
    params: {},
    queryParams: {},
    data: {},
    paramMap: convertToParamMap({}),
    queryParamMap: convertToParamMap({}),
  },
};

const matDialogRefStub = {
  close: () => undefined,
  afterClosed: () => of(undefined),
};

const addonDialogData = {
  productId: 1,
  addon: {
    id: 'insurance',
    name: 'Device protection',
    title: 'Device protection',
    description: 'Coverage for accidental damage.',
    imageUrl: '',
    isAdded: false,
    amount: 9.99,
    billingFrequency: 'month',
  },
};

const providers: (Provider | EnvironmentProviders)[] = [
  provideHttpClient(),
  provideHttpClientTesting(),
  provideNoopAnimations(),
  provideRouter([]),
  provideTranslateService({ lang: 'en', fallbackLang: 'en' }),
  provideCharts({
    registerables: [
      ArcElement,
      BarController,
      BarElement,
      CategoryScale,
      Filler,
      Legend,
      LinearScale,
      LineController,
      LineElement,
      PieController,
      PointElement,
      Tooltip,
    ],
  }),
  provideStore({
    [cartFeature.name]: cartFeature.reducer,
    [productFeature.name]: productFeature.reducer,
    [tradeInFeature.name]: tradeInFeature.reducer,
  }),
  {
    provide: Actions,
    useValue: EMPTY,
  },
  {
    provide: ActivatedRoute,
    useValue: activatedRouteStub,
  },
  {
    provide: MAT_DIALOG_DATA,
    useValue: addonDialogData,
  },
  {
    provide: MatDialogRef,
    useValue: matDialogRefStub,
  },
];

export default providers;
