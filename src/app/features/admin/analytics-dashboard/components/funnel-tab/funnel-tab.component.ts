import { DecimalPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AnalyticsDashboard } from 'src/app/core/models/analytics.model';
import { barWidth } from '../dashboard-tab.utils';

@Component({
  selector: 'app-funnel-tab',
  imports: [DecimalPipe, PercentPipe],
  templateUrl: './funnel-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FunnelTabComponent {
  @Input({ required: true }) data!: AnalyticsDashboard;

  readonly barWidth = barWidth;
}
