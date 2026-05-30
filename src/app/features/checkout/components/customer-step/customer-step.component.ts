import { Component, Input } from '@angular/core';
import { CheckoutStep } from 'src/app/core/models/checkout.model';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-customer-step',
  imports: [DynamicFormComponent],
  templateUrl: './customer-step.component.html',
  styleUrl: './customer-step.component.scss',
})
export class CustomerStepComponent {
  @Input() step!: CheckoutStep;

  onSubmit(value: any) {
    console.log(value);
  }
}
