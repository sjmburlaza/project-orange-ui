import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  AnalyticsDashboard,
  AnalyticsMetricCard,
} from 'src/app/core/models/analytics.model';
import { barWidth } from '../dashboard-tab.utils';

@Component({
  selector: 'app-visitors-tab',
  imports: [DecimalPipe],
  templateUrl: './visitors-tab.component.html',
})
export class VisitorsTabComponent {
  @Input({ required: true }) data!: AnalyticsDashboard;
  @Input({ required: true }) cards!: AnalyticsMetricCard[];
  @Input({ required: true }) maxDailyVisitors!: number;
  @Input({ required: true }) maxDailyViews!: number;

  readonly barWidth = barWidth;
}
