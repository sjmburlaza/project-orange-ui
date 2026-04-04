import { Component, Input } from '@angular/core';
import { CheckoutStepConfig } from 'src/app/features/checkout/services/checkout-config.service';

@Component({
  selector: 'app-shipping-step',
  imports: [],
  templateUrl: './shipping-step.component.html',
  styleUrl: './shipping-step.component.scss',
})
export class ShippingStepComponent {
  @Input() step!: CheckoutStepConfig;
}
