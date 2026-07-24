import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  AnalyticsDashboard,
  AnalyticsMetricCard,
} from '@orange/models';
import { InfoTooltipComponent } from '@orange/ui';
import { barWidth } from '../dashboard-tab.utils';

@Component({
  selector: 'app-overview-tab',
  imports: [InfoTooltipComponent, CurrencyPipe, DecimalPipe, PercentPipe],
  templateUrl: './overview-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewTabComponent {
  @Input({ required: true }) data!: AnalyticsDashboard;
  @Input({ required: true }) cards!: AnalyticsMetricCard[];
  @Input({ required: true }) currency!: string;

  readonly barWidth = barWidth;
}
