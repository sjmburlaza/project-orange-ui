import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  AnalyticsDashboard,
  AnalyticsMetricCard,
} from 'src/app/core/models/analytics.model';
import { InfoTooltipComponent } from '../../../../components/info-tooltip/info-tooltip.component';
import { barWidth } from '../dashboard-tab.utils';

@Component({
  selector: 'app-overview-tab',
  imports: [
    InfoTooltipComponent,
    CurrencyPipe,
    DecimalPipe,
    PercentPipe,
  ],
  templateUrl: './overview-tab.component.html',
})
export class OverviewTabComponent {
  @Input({ required: true }) data!: AnalyticsDashboard;
  @Input({ required: true }) cards!: AnalyticsMetricCard[];
  @Input({ required: true }) currency!: string;

  readonly barWidth = barWidth;
}
