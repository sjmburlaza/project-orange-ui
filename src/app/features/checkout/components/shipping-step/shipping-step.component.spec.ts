import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  FulfillmentOption,
  FulfillmentService,
} from '../../services/fulfillment.service';
import { ShippingStepComponent } from './shipping-step.component';

describe('ShippingStepComponent', () => {
  let component: ShippingStepComponent;
  let fixture: ComponentFixture<ShippingStepComponent>;
  let requestedPostalCodes: string[];

  const fulfillmentOptions: FulfillmentOption[] = [
    {
      code: 'jnt-standard',
      type: 'delivery',
      courierCode: 'jnt',
      courierName: 'J&T Express',
      label: 'Standard Delivery',
      price: 120,
      estimatedAvailability: '2–4 business days',
    },
    {
      code: 'pickup-sm-megamall',
      type: 'pickup',
      pickupLocationId: 'sm-megamall',
      pickupLocationName: 'SM Megamall Pickup Point',
      pickupAddress: 'Mandaluyong City',
      label: 'Pick up in store',
      price: 0,
      estimatedAvailability: 'Ready in 1–2 days',
    },
  ];

  beforeEach(async () => {
    requestedPostalCodes = [];

    await TestBed.configureTestingModule({
      imports: [ShippingStepComponent],
      providers: [
        {
          provide: FulfillmentService,
          useValue: {
            getOptions: (postalCode: string) => {
              requestedPostalCodes.push(postalCode);

              return of(fulfillmentOptions);
            },
          },
        },
        provideTranslateService({ lang: 'en', fallbackLang: 'en' }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingStepComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('fields', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not reload fulfillment options when only the selected value changes', () => {
    fixture.componentRef.setInput('postalCode', '1000');
    fixture.detectChanges();

    fixture.componentRef.setInput('initialValue', {
      shippingMethod: 'jnt-standard',
    });
    fixture.detectChanges();

    expect(requestedPostalCodes).toEqual(['1000']);
    expect(component.shippingMethod.value).toBe('jnt-standard');
  });

  it('reloads fulfillment options when the postal code changes', () => {
    fixture.componentRef.setInput('postalCode', '1000');
    fixture.detectChanges();

    fixture.componentRef.setInput('postalCode', '1001');
    fixture.detectChanges();

    expect(requestedPostalCodes).toEqual(['1000', '1001']);
  });
});
