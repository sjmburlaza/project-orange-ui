import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DynamicField } from 'src/app/core/models/checkout.model';

@Component({
  selector: 'app-payment-step',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './payment-step.component.html',
  styleUrl: './payment-step.component.scss',
})
export class PaymentStepComponent implements OnInit, OnChanges {
  private readonly destroyRef = inject(DestroyRef);
  @Input({ required: true }) fields: DynamicField[] = [];
  @Input() initialValue: unknown = {};

  @Output() valueChanged = new EventEmitter<{ paymentMethod: string }>();

  readonly paymentMethod = new FormControl('', Validators.required);

  get field(): DynamicField | undefined {
    return this.fields.find((field) => field.name === 'paymentMethod');
  }

  ngOnInit(): void {
    this.paymentMethod.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.valueChanged.emit(this.getValue());
      });
  }

  ngOnChanges(): void {
    const value = this.initialValue as { paymentMethod?: string };

    if (value?.paymentMethod) {
      this.paymentMethod.setValue(value.paymentMethod, {
        emitEvent: false,
      });
    }
  }

  selectPayment(value: string): void {
    this.paymentMethod.setValue(value);
    this.paymentMethod.markAsTouched();
  }

  validateAndGetValue(): { paymentMethod: string } | null {
    this.paymentMethod.markAsTouched();

    if (this.paymentMethod.invalid) {
      return null;
    }

    return this.getValue();
  }

  getValue(): { paymentMethod: string } {
    return {
      paymentMethod: this.paymentMethod.value ?? '',
    };
  }
}
