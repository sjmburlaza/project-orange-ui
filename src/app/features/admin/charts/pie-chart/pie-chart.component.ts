import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-admin-pie-chart',
  imports: [BaseChartDirective],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartComponent {
  @Input({ required: true }) data!: ChartData<'pie', number[], string>;
  @Input() options?: ChartOptions<'pie'>;
  @Input() ariaLabel = 'Pie chart';
  @Input() fallbackText = 'Pie chart.';
}
