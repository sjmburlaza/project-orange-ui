import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CheckoutConfigService,
  CheckoutStepConfig,
} from 'src/app/features/checkout/services/checkout-config.service';
import { DynamicFormComponent } from 'src/app/shared/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-customer-step',
  imports: [DynamicFormComponent],
  templateUrl: './customer-step.component.html',
  styleUrl: './customer-step.component.scss',
})
export class CustomerStepComponent {
  route = inject(ActivatedRoute);
  checkoutConfigService = inject(CheckoutConfigService);

  @Input() step!: CheckoutStepConfig;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit(value: any) {
    console.log(value);
  }
}
