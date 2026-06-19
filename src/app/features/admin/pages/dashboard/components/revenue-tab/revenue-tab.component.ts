import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  AnalyticsDashboard,
  AnalyticsMetricCard,
} from 'src/app/core/models/analytics.model';
import { InfoTooltipComponent } from '../../../../components/info-tooltip/info-tooltip.component';
import { barWidth } from '../dashboard-tab.utils';

@Component({
  selector: 'app-revenue-tab',
  imports: [InfoTooltipComponent, CurrencyPipe, DecimalPipe],
  templateUrl: './revenue-tab.component.html',
})
export class RevenueTabComponent {
  @Input({ required: true }) data!: AnalyticsDashboard;
  @Input({ required: true }) cards!: AnalyticsMetricCard[];
  @Input({ required: true }) currency!: string;
  @Input({ required: true }) maxDailyRevenue!: number;
  @Input({ required: true }) maxCategoryRevenue!: number;

  readonly barWidth = barWidth;
}
