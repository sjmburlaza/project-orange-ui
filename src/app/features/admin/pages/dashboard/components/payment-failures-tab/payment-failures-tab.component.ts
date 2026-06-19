import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  AnalyticsDashboard,
  AnalyticsMetricCard,
} from 'src/app/core/models/analytics.model';

@Component({
  selector: 'app-payment-failures-tab',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './payment-failures-tab.component.html',
})
export class PaymentFailuresTabComponent {
  @Input({ required: true }) data!: AnalyticsDashboard;
  @Input({ required: true }) cards!: AnalyticsMetricCard[];
  @Input({ required: true }) currency!: string;
}
