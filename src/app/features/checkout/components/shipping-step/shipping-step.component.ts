import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicField } from 'src/app/core/models/checkout.model';

@Component({
  selector: 'app-shipping-step',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shipping-step.component.html',
  styleUrl: './shipping-step.component.scss',
})
export class ShippingStepComponent implements OnInit, OnChanges {
  @Input({ required: true }) fields: DynamicField[] = [];
  @Input() initialValue: unknown = {};

  @Output() valueChanged = new EventEmitter<{ shippingMethod: string }>();

  readonly shippingMethod = new FormControl('', Validators.required);

  get field(): DynamicField | undefined {
    return this.fields.find((field) => field.name === 'shippingMethod');
  }

  ngOnInit(): void {
    this.shippingMethod.valueChanges.subscribe(() => {
      this.valueChanged.emit(this.getValue());
    });
  }

  ngOnChanges(): void {
    const value = this.initialValue as { shippingMethod?: string };

    if (value?.shippingMethod) {
      this.shippingMethod.setValue(value.shippingMethod, {
        emitEvent: false,
      });
    }
  }

  selectShipping(value: string): void {
    this.shippingMethod.setValue(value);
    this.shippingMethod.markAsTouched();
  }

  validateAndGetValue(): { shippingMethod: string } | null {
    this.shippingMethod.markAsTouched();

    if (this.shippingMethod.invalid) {
      return null;
    }

    return this.getValue();
  }

  getValue(): { shippingMethod: string } {
    return {
      shippingMethod: this.shippingMethod.value ?? '',
    };
  }
}
