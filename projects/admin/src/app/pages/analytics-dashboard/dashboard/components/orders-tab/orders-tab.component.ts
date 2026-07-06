import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  AnalyticsDashboard,
  AnalyticsMetricCard,
} from 'libs/core/models/analytics.model';
import { InfoTooltipComponent } from 'libs/shared/components/info-tooltip/info-tooltip.component';

@Component({
  selector: 'app-orders-tab',
  imports: [InfoTooltipComponent, CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './orders-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersTabComponent {
  @Input({ required: true }) data!: AnalyticsDashboard;
  @Input({ required: true }) cards!: AnalyticsMetricCard[];
  @Input({ required: true }) currency!: string;
}
