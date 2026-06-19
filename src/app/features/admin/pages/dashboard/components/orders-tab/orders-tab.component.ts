import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  AnalyticsDashboard,
  AnalyticsMetricCard,
} from 'src/app/core/models/analytics.model';

@Component({
  selector: 'app-orders-tab',
  imports: [CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './orders-tab.component.html',
})
export class OrdersTabComponent {
  @Input({ required: true }) data!: AnalyticsDashboard;
  @Input({ required: true }) cards!: AnalyticsMetricCard[];
  @Input({ required: true }) currency!: string;
}
