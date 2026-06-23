import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  AnalyticsDashboard,
  AnalyticsMetricCard,
} from 'src/app/core/models/analytics.model';
import { InfoTooltipComponent } from 'src/app/shared/components/info-tooltip/info-tooltip.component';

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
