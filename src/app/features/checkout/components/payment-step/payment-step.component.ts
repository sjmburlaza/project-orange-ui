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
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { DynamicField } from 'src/app/core/models/checkout.model';
import { TranslatePipe } from '@ngx-translate/core';
import {
  PaymentConfirmation,
  PaymentIntent,
  PaymentStepValue,
} from 'src/app/core/models/payment.model';
import { SiteService } from 'src/app/core/services/site.services';
import {
  PaymentMethodFormComponent,
  PaymentShellFormGroup,
} from './payment-form.model';
import { CardPaymentMethodComponent } from './card-payment-method/card-payment-method.component';
import { CodPaymentMethodComponent } from './cod-payment-method/cod-payment-method.component';
import { GcashPaymentMethodComponent } from './gcash-payment-method/gcash-payment-method.component';
import { AlipayPaymentMethodComponent } from './alipay-payment-method/alipay-payment-method.component';
import { UnionpayPaymentMethodComponent } from './unionpay-payment-method/unionpay-payment-method.component';
import { WechatPayPaymentMethodComponent } from './wechat-pay-payment-method/wechat-pay-payment-method.component';

@Component({
  selector: 'app-payment-step',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatIconModule,
    TranslatePipe,
    CardPaymentMethodComponent,
    CodPaymentMethodComponent,
    GcashPaymentMethodComponent,
    AlipayPaymentMethodComponent,
    UnionpayPaymentMethodComponent,
    WechatPayPaymentMethodComponent,
  ],
  templateUrl: './payment-step.component.html',
  styleUrl: './payment-step.component.scss',
})
export class PaymentStepComponent implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly siteService = inject(SiteService);

  @ViewChild('activeMethod')
  private activeMethod?: PaymentMethodFormComponent;

  @Input({ required: true }) fields: DynamicField[] = [];
  @Input() initialValue: unknown = {};
  @Input() paymentIntent: PaymentIntent | null = null;
  @Input() paymentAmount = 0;
  @Input() paymentCurrency = '';
  @Input() isCreatingPaymentIntent = false;
  @Input() isConfirmingPayment = false;
  @Input() confirmationResult: PaymentConfirmation | null = null;
  @Input() paymentErrorMessage = '';

  @Output() valueChanged = new EventEmitter<PaymentStepValue>();

  readonly currency = this.siteService.currency;
  readonly paymentForm: PaymentShellFormGroup = this.fb.nonNullable.group({
    paymentMethod: ['', [Validators.required]],
    termsAccepted: [false, [Validators.requiredTrue]],
  });

  readonly methodContent: Record<string, { detailKey: string }> = {
    card: {
      detailKey: 'checkout.payment.methods.card.detail',
    },
    gcash: {
      detailKey: 'checkout.payment.methods.gcash.detail',
    },
    cod: {
      detailKey: 'checkout.payment.methods.cod.detail',
    },
    unionpay: {
      detailKey: 'checkout.payment.methods.unionpay.detail',
    },
    alipay: {
      detailKey: 'checkout.payment.methods.alipay.detail',
    },
    'wechat-pay': {
      detailKey: 'checkout.payment.methods.wechatPay.detail',
    },
  };
  methodValue: Partial<PaymentStepValue> = {};

  get field(): DynamicField | undefined {
    return this.fields.find((field) => field.name === 'paymentMethod');
  }

  get paymentMethod(): FormControl<string> {
    return this.paymentForm.controls.paymentMethod;
  }

  get selectedPaymentMethod(): string {
    return this.paymentMethod.value;
  }

  ngOnInit(): void {
    this.paymentForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.valueChanged.emit(this.getValue());
      });
  }

  ngOnChanges(): void {
    const value = this.initialValue as Partial<PaymentStepValue>;

    if (value) {
      this.paymentForm.patchValue(
        {
          paymentMethod: value.paymentMethod ?? '',
          termsAccepted: value.termsAccepted ?? false,
        },
        {
          emitEvent: false,
        },
      );
      this.methodValue = this.getInitialMethodValue(value);
    }
  }

  getMethodDetailKey(value: string): string {
    return (
      this.methodContent[value]?.detailKey ?? 'checkout.payment.methods.default'
    );
  }

  selectPayment(value: string): void {
    if (this.paymentMethod.value === value) {
      return;
    }

    this.paymentForm.patchValue(
      {
        paymentMethod: value,
      },
      {
        emitEvent: true,
      },
    );
    this.methodValue = {};
    this.paymentMethod.markAsTouched();
  }

  collapsePayment(value: string): void {
    if (this.paymentMethod.value !== value) {
      return;
    }

    this.paymentMethod.setValue('');
    this.methodValue = {};
    this.paymentMethod.markAsTouched();
  }

  onMethodValueChanged(value: Partial<PaymentStepValue>): void {
    this.methodValue = value;
    this.valueChanged.emit(this.getValue());
  }

  validateAndGetValue(): PaymentStepValue | null {
    this.paymentForm.markAllAsTouched();
    const methodValue = this.validateMethodValue();

    if (this.paymentForm.invalid || methodValue === null) {
      return null;
    }

    return this.buildValue(methodValue);
  }

  getValue(): PaymentStepValue {
    return this.buildValue(this.activeMethod?.getValue() ?? this.methodValue);
  }

  private validateMethodValue(): Partial<PaymentStepValue> | null {
    if (!this.requiresSmartMethodValidation(this.selectedPaymentMethod)) {
      return {};
    }

    return this.activeMethod?.validateAndGetValue() ?? null;
  }

  private buildValue(methodValue: Partial<PaymentStepValue>): PaymentStepValue {
    const value = this.paymentForm.getRawValue();

    return {
      paymentMethod: value.paymentMethod,
      termsAccepted: value.termsAccepted,
      ...methodValue,
    };
  }

  private getInitialMethodValue(
    value: Partial<PaymentStepValue>,
  ): Partial<PaymentStepValue> {
    const methodValue: Partial<PaymentStepValue> = {};

    if (value.cardholderName) {
      methodValue.cardholderName = value.cardholderName;
    }

    if (value.cardLast4) {
      methodValue.cardLast4 = value.cardLast4;
    }

    if (value.expiryDate) {
      methodValue.expiryDate = value.expiryDate;
    }

    if (value.walletMobileNumber) {
      methodValue.walletMobileNumber = value.walletMobileNumber;
    }

    if (value.installmentPlan) {
      methodValue.installmentPlan = value.installmentPlan;
    }

    if (typeof value.savePaymentMethod === 'boolean') {
      methodValue.savePaymentMethod = value.savePaymentMethod;
    }

    return methodValue;
  }

  private requiresSmartMethodValidation(method: string): boolean {
    return method === 'card' || method === 'unionpay' || method === 'gcash';
  }
}
