import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';

import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, EMPTY, from, switchMap, take, tap } from 'rxjs';
import { CheckoutApiService } from '../services/checkout-api.service';
import {
  CheckoutStep,
  DynamicFormObject,
} from 'src/app/core/models/checkout.model';
import { DynamicFormComponent } from '../components/dynamic-form/dynamic-form.component';
import { ShippingStepComponent } from '../components/shipping-step/shipping-step.component';
import { PaymentStepComponent } from '../components/payment-step/payment-step.component';
import { CheckoutStorageService } from '../services/checkout-storage.service';
import { CartFacade } from '../../cart/store/cart.facade';
import { OrderService } from 'src/app/features/orders/services/order.service';
import { SiteService } from 'src/app/core/services/site.services';

type CheckoutStepComponent =
  | DynamicFormComponent
  | ShippingStepComponent
  | PaymentStepComponent;

type CheckoutStepValue = Record<string, unknown>;

@Component({
  selector: 'app-checkout',
  imports: [
    MatStepperModule,
    MatAnchor,
    CommonModule,
    MatButtonModule,
    DynamicFormComponent,
    ShippingStepComponent,
    PaymentStepComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  private readonly checkoutApiService = inject(CheckoutApiService);
  private readonly checkoutStorage = inject(CheckoutStorageService);
  private readonly cartFacade = inject(CartFacade);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  private readonly siteService = inject(SiteService);

  @ViewChild('activeStep')
  activeStep?: CheckoutStepComponent;

  readonly steps = signal<CheckoutStep[]>([]);
  readonly currentIndex = signal(0);
  readonly isPlacingOrder = signal(false);
  readonly checkoutData = this.checkoutStorage.checkoutData;

  readonly currentStep = computed(() => {
    return this.steps()[this.currentIndex()];
  });

  ngOnInit(): void {
    this.checkoutData.set(this.checkoutStorage.getAll());

    this.checkoutApiService.getCheckoutForm().subscribe({
      next: (config) => {
        this.steps.set(config.steps);
      },
      error: (error) => {
        console.error('Failed to load checkout form config:', error);
      },
    });
  }

  previous(): void {
    this.saveCurrentStep(false);

    if (this.currentIndex() > 0) {
      this.currentIndex.update((index) => index - 1);
    }
  }

  next(): void {
    const value = this.saveCurrentStep(true);

    if (!value) return;

    const isLastStep = this.currentIndex() === this.steps().length - 1;

    if (isLastStep) {
      this.placeOrder();
      return;
    }

    this.currentIndex.update((index) => index + 1);
  }

  onStepValueChanged(stepId: string, value: CheckoutStepValue): void {
    this.saveStepData(stepId, value);

    if (stepId === 'shipping') {
      this.updateCartShipping(this.readString(value, 'shippingMethod'));
    }
  }

  private updateCartShipping(shippingMethodCode: string): void {
    const postalCode = this.getPostalCode();

    if (!postalCode || !shippingMethodCode) return;

    this.cartFacade.updateShipping(postalCode, shippingMethodCode);
  }

  getPostalCode(): string {
    const data = this.checkoutStorage.getAll();
    const customer = this.asRecord(data['customer']);
    const deliveryAddress = this.asRecord(customer['deliveryAddress']);
    const shippingAddress = this.asRecord(customer['shippingAddress']);

    return (
      this.readString(deliveryAddress, 'postalCode') ||
      this.readString(shippingAddress, 'postalCode')
    );
  }

  getDynamicFormInitialValue(stepId: string): DynamicFormObject | null {
    const value = this.checkoutData()[stepId];

    return this.isDynamicFormObject(value) ? value : null;
  }

  private saveCurrentStep(validate: boolean): CheckoutStepValue | null {
    const step = this.steps()[this.currentIndex()];
    const component = this.activeStep;

    if (!step || !component) return null;

    if (validate) {
      const value = component.validateAndGetValue();

      if (!value) return null;

      this.saveStepData(step.id, value);
      return value;
    }

    const value = component.getValue();
    this.saveStepData(step.id, value);

    return value;
  }

  private placeOrder(): void {
    if (this.isPlacingOrder()) {
      return;
    }

    this.isPlacingOrder.set(true);

    this.cartFacade.cart$
      .pipe(
        take(1),
        switchMap((cart) =>
          this.orderService.placeOrder({
            checkoutData: this.checkoutData(),
            cart,
          }),
        ),
        tap(() => {
          this.checkoutStorage.clear();
          this.cartFacade.clearCart();
        }),
        switchMap((order) =>
          from(
            this.router.navigate([
              '/',
              this.siteService.getCurrentSite(),
              'orders',
              'confirmation',
              order.orderNumber || order.id,
            ]),
          ),
        ),
        catchError((error) => {
          console.error('Failed to place order:', error);
          this.isPlacingOrder.set(false);

          return EMPTY;
        }),
      )
      .subscribe();
  }

  private saveStepData(stepId: string, value: CheckoutStepValue): void {
    this.checkoutStorage.saveStep(stepId, value);
  }

  private asRecord(value: unknown): Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  }

  private readString(record: Record<string, unknown>, key: string): string {
    const value = record[key];

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number') {
      return String(value);
    }

    return '';
  }

  private isDynamicFormObject(value: unknown): value is DynamicFormObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
