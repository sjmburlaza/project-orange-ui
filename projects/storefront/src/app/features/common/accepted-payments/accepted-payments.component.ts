import { ChangeDetectionStrategy, Component } from '@angular/core';

interface AcceptedPayment {
  name: string;
  logoUrl: string;
}

@Component({
  selector: 'app-accepted-payments',
  templateUrl: './accepted-payments.component.html',
  styleUrl: './accepted-payments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptedPaymentsComponent {
  readonly acceptedPayments: AcceptedPayment[] = [
    {
      name: 'Visa',
      logoUrl: 'assets/payment-methods/visa.svg',
    },
    {
      name: 'Mastercard',
      logoUrl: 'assets/payment-methods/mastercard.svg',
    },
    {
      name: 'American Express',
      logoUrl: 'assets/payment-methods/amex.svg',
    },
    {
      name: 'GCash',
      logoUrl: 'assets/payment-methods/gcash.svg',
    },
  ];
}
