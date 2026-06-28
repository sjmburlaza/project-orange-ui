import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AuthSession } from 'src/app/core/auth/auth.models';
import { AuthStore } from 'src/app/core/auth/auth.store';
import { CheckoutFormConfig } from 'src/app/core/models/checkout.model';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { SiteService } from 'src/app/core/services/site.services';
import { CartFacade } from 'src/app/features/cart/store/cart.facade';
import { OrderService } from 'src/app/features/orders/services/order.service';
import { CheckoutApiService } from '../services/checkout-api.service';
import { CheckoutStorageService } from '../services/checkout-storage.service';

import { CheckoutComponent } from './checkout.component';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let authStore: AuthStore;
  let checkoutStorage: CheckoutStorageService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent],
      providers: [
        provideTranslateService({ lang: 'en', fallbackLang: 'en' }),
        {
          provide: CheckoutApiService,
          useValue: {
            getCheckoutForm: () => of(createCheckoutFormConfig()),
          },
        },
        {
          provide: CartFacade,
          useValue: {
            cart$: of(null),
            updateShipping: vi.fn(),
            clearCart: vi.fn(),
          },
        },
        {
          provide: OrderService,
          useValue: {
            placeOrder: vi.fn(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn(),
          },
        },
        {
          provide: SiteService,
          useValue: {
            getCurrentSite: () => 'ph',
          },
        },
        {
          provide: AnalyticsService,
          useValue: {
            trackCheckoutStarted: vi.fn(),
            trackPurchase: vi.fn(),
            trackPaymentFailure: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
    checkoutStorage = TestBed.inject(CheckoutStorageService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    createComponent();

    expect(component).toBeTruthy();
  });

  it('prefills and disables the customer email field for authenticated users', () => {
    checkoutStorage.saveStep('customer', {
      email: 'guest@example.com',
      firstName: 'Ada',
    });
    authStore.setSession(createSession('ada@example.com'));
    createComponent();

    const customerStep = component.steps().find((step) => step.id === 'customer');
    const emailField = customerStep?.fields?.find(
      (field) => field.name === 'email',
    );
    const emailInput = fixture.nativeElement.querySelector(
      'input[type="email"]',
    ) as HTMLInputElement | null;

    expect(emailField).toMatchObject({
      defaultValue: 'ada@example.com',
      disabled: true,
    });
    expect(component.getDynamicFormInitialValue('customer')).toEqual({
      email: 'ada@example.com',
      firstName: 'Ada',
    });
    expect(emailInput?.value).toBe('ada@example.com');
    expect(emailInput?.disabled).toBe(true);
  });

  it('leaves the customer email field editable for guests', () => {
    checkoutStorage.saveStep('customer', {
      email: 'guest@example.com',
    });
    authStore.clearSession();
    createComponent();

    const customerStep = component.steps().find((step) => step.id === 'customer');
    const emailField = customerStep?.fields?.find(
      (field) => field.name === 'email',
    );
    const emailInput = fixture.nativeElement.querySelector(
      'input[type="email"]',
    ) as HTMLInputElement | null;

    expect(emailField?.disabled).toBeUndefined();
    expect(component.getDynamicFormInitialValue('customer')).toEqual({
      email: 'guest@example.com',
    });
    expect(emailInput?.value).toBe('guest@example.com');
    expect(emailInput?.disabled).toBe(false);
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }
});

function createCheckoutFormConfig(): CheckoutFormConfig {
  return {
    version: '1.0',
    steps: [
      {
        id: 'customer',
        label: 'Customer Details',
        fields: [
          {
            name: 'email',
            type: 'email',
            label: 'Email',
            validators: [{ name: 'required' }, { name: 'email' }],
            grid: {
              mobile: 12,
              desktop: 12,
            },
          },
          {
            name: 'firstName',
            type: 'text',
            label: 'First Name',
          },
        ],
      },
      {
        id: 'shipping',
        label: 'Shipping',
        fields: [],
      },
    ],
  };
}

function createSession(email: string): AuthSession {
  return {
    user: {
      id: '52a0adc1-25d3-4cac-9154-48649ebe9d16',
      email,
      fullName: 'Sample User',
      roles: ['customer'],
      permissions: [],
    },
    session: {
      id: 'f48e7a9fc19d4a73b48d4e0720415073',
      createdAtUtc: '2026-06-12T21:37:26.126677+00:00',
      expiresAtUtc: '2026-06-12T23:37:26.126677+00:00',
    },
  };
}
