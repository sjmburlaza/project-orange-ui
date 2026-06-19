import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideTranslateService } from '@ngx-translate/core';
import { OrderItem } from 'src/app/core/models/order.model';
import { SiteService } from 'src/app/core/services/site.services';

import { OrderItemComponent } from './order-item.component';

describe('OrderItemComponent', () => {
  let component: OrderItemComponent;
  let fixture: ComponentFixture<OrderItemComponent>;

  const order: OrderItem = {
    orderNumber: 'OR-20260618-0001',
    customerEmail: 'ada@example.com',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    items: [
      {
        productId: 1,
        productName: 'Galaxy S25 Ultra',
        price: 84990,
        quantity: 1,
        imageUrl: '',
        categoryName: 'Phones',
        itemSpecs: ['512GB', 'Titanium Black'],
      },
    ],
    shippingAddress: {
      recipientName: 'Ada Lovelace',
      mobileNumber: '09171234567',
      addressLine1: '123 Orange Avenue',
      city: 'Manila',
      postalCode: '1000',
      country: 'Philippines',
    },
    deliveryEstimate: '3-5 business days',
    deliveredAt: '2026-06-21T00:00:00.000Z',
    trackingNumber: 'ABC123456',
    courier: 'Orange Express',
    invoiceUrl: '/invoice.pdf',
    totalAmount: 79990,
    discountAmount: 5000,
    shippingAmount: 0,
    nextSteps: [],
    placedAt: '2026-06-19T00:00:00.000Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderItemComponent],
      providers: [
        provideNoopAnimations(),
        provideTranslateService({ lang: 'en', fallbackLang: 'en' }),
        {
          provide: SiteService,
          useValue: {
            currency: () => 'PHP',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('order', order);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts collapsed and expands on request', () => {
    expect(component.isExpanded()).toBe(false);

    component.setExpanded(true);

    expect(component.isExpanded()).toBe(true);
  });

  it('computes the expanded payment summary', () => {
    expect(component.subtotal()).toBe(84990);
    expect(component.shippingAmount()).toBe(0);
    expect(component.discountAmount()).toBe(5000);
  });
});
