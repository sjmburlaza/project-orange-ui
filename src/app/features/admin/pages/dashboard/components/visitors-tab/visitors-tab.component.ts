import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  AnalyticsDashboard,
  AnalyticsDailyPoint,
  AnalyticsMetricCard,
} from 'src/app/core/models/analytics.model';
import { InfoTooltipComponent } from '../../../../components/info-tooltip/info-tooltip.component';
import { barWidth } from '../dashboard-tab.utils';

@Component({
  selector: 'app-visitors-tab',
  imports: [InfoTooltipComponent, DecimalPipe],
  templateUrl: './visitors-tab.component.html',
})
export class VisitorsTabComponent {
  @Input({ required: true }) data!: AnalyticsDashboard;
  @Input({ required: true }) cards!: AnalyticsMetricCard[];
  @Input({ required: true }) maxDailyVisitors!: number;
  @Input({ required: true }) maxDailyViews!: number;

  readonly barWidth = barWidth;

  get dailyLatestFirst(): AnalyticsDailyPoint[] {
    return [...this.data.daily].sort((a, b) =>
      b.dateKey.localeCompare(a.dateKey),
    );
  }
}
