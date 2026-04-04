import { Component, inject, OnInit, Type } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';

import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { PaymentStepComponent } from 'src/app/features/checkout/components/payment-step/payment-step.component';
import { CustomerStepComponent } from 'src/app/features/checkout/components/customer-step/customer-step.component';
import { CommonModule } from '@angular/common';
import { ShippingStepComponent } from 'src/app/features/checkout/components/shipping-step/shipping-step.component';
import {
  CheckoutConfigService,
  CheckoutStepConfig,
} from 'src/app/features/checkout/services/checkout-config.service';

@Component({
  selector: 'app-checkout',
  imports: [MatStepperModule, MatAnchor, CommonModule, MatButtonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  checkoutConfig = inject(CheckoutConfigService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  steps: CheckoutStepConfig[] = [];
  currentIndex = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stepComponentMap: Record<string, Type<any>> = {
    customer: CustomerStepComponent,
    shipping: ShippingStepComponent,
    payment: PaymentStepComponent,
  };

  ngOnInit() {
    this.steps = this.checkoutConfig.steps;

    // Initialize current step from URL param
    const stepId = this.route.snapshot.paramMap.get('step');
    const index = this.steps.findIndex((s) => s.id === stepId);
    this.currentIndex = index >= 0 ? index : 0;

    // If no param, navigate to first step
    if (!stepId && this.steps.length > 0) {
      this.navigateToStep(this.currentIndex);
    }

    // Listen to route param changes (deep-linking)
    this.route.paramMap.subscribe((params) => {
      const stepId = params.get('step');
      const index = this.steps.findIndex((s) => s.id === stepId);
      if (index >= 0) this.currentIndex = index;
    });
  }

  get currentStepId() {
    return this.steps[this.currentIndex]?.id;
  }

  get currentStep() {
    return this.steps[this.currentIndex];
  }

  next() {
    if (this.currentIndex < this.steps.length - 1) {
      this.currentIndex++;
      this.navigateToStep(this.currentIndex);
    }
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.navigateToStep(this.currentIndex);
    }
  }

  navigateToStep(index: number) {
    const step = this.steps[index];
    if (step) {
      this.router.navigate(['../', step.id], {
        relativeTo: this.route,
      });
    }
  }
}
