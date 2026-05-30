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
import { CheckoutApiService } from '../services/checkout-api.service';
import { CheckoutStep } from 'src/app/core/models/checkout.model';
import { DynamicFormComponent } from '../components/dynamic-form/dynamic-form.component';
import { ShippingStepComponent } from '../components/shipping-step/shipping-step.component';
import { PaymentStepComponent } from '../components/payment-step/payment-step.component';
import { CheckoutStorageService } from '../services/checkout-storage.service';

type CheckoutStepComponent =
  | DynamicFormComponent
  | ShippingStepComponent
  | PaymentStepComponent;

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

  @ViewChild('activeStep')
  activeStep?: CheckoutStepComponent;

  readonly steps = signal<CheckoutStep[]>([]);
  readonly currentIndex = signal(0);
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

  onStepValueChanged(stepId: string, value: any): void {
    this.saveStepData(stepId, value);
  }

  private saveCurrentStep(validate: boolean): unknown | null {
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
    console.log('Final checkout payload:', this.checkoutData());
  }

  private saveStepData(stepId: string, value: Record<string, any>): void {
    this.checkoutStorage.saveStep(stepId, value);
  }
}
