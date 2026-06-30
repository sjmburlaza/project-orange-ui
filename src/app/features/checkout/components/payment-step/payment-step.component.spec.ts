import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideTranslateService } from '@ngx-translate/core';

import { CardPaymentMethodComponent } from './card-payment-method/card-payment-method.component';
import { PaymentStepComponent } from './payment-step.component';

describe('PaymentStepComponent', () => {
  let component: PaymentStepComponent;
  let fixture: ComponentFixture<PaymentStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentStepComponent],
      providers: [
        provideNoopAnimations(),
        provideTranslateService({ lang: 'en', fallbackLang: 'en' }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentStepComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('fields', [
      {
        name: 'paymentMethod',
        type: 'select',
        options: [
          { label: 'Credit / Debit Card', value: 'card', icon: 'credit_card' },
          {
            label: 'GCash',
            value: 'gcash',
            icon: 'account_balance_wallet',
          },
          { label: 'Cash on Delivery', value: 'cod', icon: 'payments' },
          { label: '银行卡 / 银联', value: 'unionpay', icon: 'credit_card' },
          {
            label: '支付宝',
            value: 'alipay',
            icon: 'account_balance_wallet',
          },
          { label: '微信支付', value: 'wechat-pay', icon: 'qr_code' },
          { label: 'コンビニ払い', value: 'konbini', icon: 'store' },
          {
            label: 'PayPal',
            value: 'paypal',
            icon: 'account_balance_wallet',
          },
          {
            label: 'Virement bancaire',
            value: 'bank-transfer',
            icon: 'account_balance',
          },
        ],
      },
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requires card details for card payments', async () => {
    component.selectPayment('card');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const cardMethod = getCardMethod();

    expect(component.validateAndGetValue()).toBeNull();
    expect(cardMethod.form.controls.cardholderName.invalid).toBe(true);
    expect(cardMethod.form.controls.cardNumber.invalid).toBe(true);
    expect(cardMethod.form.controls.expiryDate.invalid).toBe(true);
    expect(cardMethod.form.controls.securityCode.invalid).toBe(true);
  });

  it('requires card details for UnionPay payments', async () => {
    component.selectPayment('unionpay');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const cardMethod = getCardMethod();

    expect(component.validateAndGetValue()).toBeNull();
    expect(cardMethod.form.controls.cardholderName.invalid).toBe(true);
    expect(cardMethod.form.controls.cardNumber.invalid).toBe(true);
    expect(cardMethod.form.controls.expiryDate.invalid).toBe(true);
    expect(cardMethod.form.controls.securityCode.invalid).toBe(true);
  });

  it('requires accepting the terms and conditions', () => {
    component.selectPayment('cod');

    expect(component.validateAndGetValue()).toBeNull();
    expect(component.paymentForm.controls.termsAccepted.invalid).toBe(true);
  });

  it('returns sanitized card payment details', async () => {
    component.selectPayment('card');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const cardMethod = getCardMethod();

    cardMethod.form.patchValue({
      cardholderName: ' Ada Lovelace ',
      cardNumber: '4242 4242 4242 1111',
      expiryDate: '12/30',
      securityCode: '123',
      installmentPlan: 'three_months',
      savePaymentMethod: true,
    });
    component.paymentForm.patchValue({
      termsAccepted: true,
    });

    expect(component.validateAndGetValue()).toEqual({
      paymentMethod: 'card',
      termsAccepted: true,
      cardholderName: 'Ada Lovelace',
      cardLast4: '1111',
      expiryDate: '12/30',
      installmentPlan: 'three_months',
      savePaymentMethod: true,
    });
  });

  it('preserves a trailing cardholder name space while typing', async () => {
    component.selectPayment('card');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const cardMethod = getCardMethod();

    cardMethod.form.controls.cardholderName.setValue('Ada ');
    fixture.detectChanges();

    expect(cardMethod.form.controls.cardholderName.value).toBe('Ada ');
    expect(component.getValue().cardholderName).toBe('Ada ');
  });

  it('returns Alipay payment details after terms acceptance', () => {
    component.selectPayment('alipay');
    component.paymentForm.patchValue({
      termsAccepted: true,
    });

    expect(component.validateAndGetValue()).toEqual({
      paymentMethod: 'alipay',
      termsAccepted: true,
    });
  });

  it('renders generic instructions for simple payment methods', () => {
    component.selectPayment('bank-transfer');
    component.paymentForm.patchValue({
      termsAccepted: true,
    });
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.payment-instructions')?.textContent,
    ).toContain('Virement bancaire');
    expect(component.validateAndGetValue()).toEqual({
      paymentMethod: 'bank-transfer',
      termsAccepted: true,
    });
  });

  it('clears smart payment details when switching to a simple method', async () => {
    component.selectPayment('card');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const cardMethod = getCardMethod();

    cardMethod.form.patchValue({
      cardholderName: 'Ada Lovelace',
      cardNumber: '4242 4242 4242 1111',
      expiryDate: '12/30',
      securityCode: '123',
    });
    component.paymentForm.patchValue({
      termsAccepted: true,
    });

    component.selectPayment('paypal');

    expect(component.getValue()).toEqual({
      paymentMethod: 'paypal',
      termsAccepted: true,
    });
  });

  function getCardMethod(): CardPaymentMethodComponent {
    const debugElement = fixture.debugElement.query(
      By.directive(CardPaymentMethodComponent),
    );

    expect(debugElement).toBeTruthy();

    return debugElement.componentInstance as CardPaymentMethodComponent;
  }
});
