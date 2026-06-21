import { Component, Input } from '@angular/core';
import type { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-admin-line-chart',
  imports: [BaseChartDirective],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent {
  @Input({ required: true }) data!: ChartData<'line', number[], string>;
  @Input() options?: ChartOptions<'line'>;
  @Input() ariaLabel = 'Line chart';
  @Input() fallbackText = 'Line chart.';
}
