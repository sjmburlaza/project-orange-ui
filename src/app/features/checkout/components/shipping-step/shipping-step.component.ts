import { CommonModule, CurrencyPipe } from '@angular/common';
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
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicField } from 'src/app/core/models/checkout.model';
import {
  ShippingOption,
  ShippingPricingService,
} from '../../services/shipping-pricing.service';
import { SiteService } from 'src/app/core/services/site.services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shipping-step',
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './shipping-step.component.html',
  styleUrl: './shipping-step.component.scss',
})
export class ShippingStepComponent implements OnInit, OnChanges {
  private readonly shippingPricingService = inject(ShippingPricingService);
  private readonly destroyRef = inject(DestroyRef);
  readonly siteService = inject(SiteService);
  readonly currency = this.siteService.currency;
  @Input({ required: true }) fields: DynamicField[] = [];
  @Input() initialValue: unknown = {};
  @Input() postalCode = '';

  @Output() valueChanged = new EventEmitter<{ shippingMethod: string }>();

  readonly shippingMethod = new FormControl('', Validators.required);

  shippingOptions: ShippingOption[] = [];
  isLoading = false;

  get field(): DynamicField | undefined {
    return this.fields.find((field) => field.name === 'shippingMethod');
  }

  ngOnInit(): void {
    this.shippingMethod.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.valueChanged.emit(this.getValue());
      });
  }

  ngOnChanges(): void {
    const value = this.initialValue as {
      shippingMethod?: string;
    };
    if (this.postalCode) {
      this.loadShippingOptions(this.postalCode);
    }

    if (value?.shippingMethod) {
      this.shippingMethod.setValue(value.shippingMethod, {
        emitEvent: false,
      });
    }
  }

  private loadShippingOptions(postalCode: string): void {
    this.isLoading = true;
    this.shippingOptions = [];

    this.shippingPricingService
      .getOptions(postalCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (options) => {
          this.shippingOptions = options;
          this.isLoading = false;
        },
        error: () => {
          this.shippingOptions = [];
          this.isLoading = false;
        },
      });
  }

  selectShipping(option: ShippingOption): void {
    this.shippingMethod.setValue(option.code);
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
