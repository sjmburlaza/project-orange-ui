import { Component, Input } from '@angular/core';
import type { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-admin-bar-chart',
  imports: [BaseChartDirective],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent {
  @Input({ required: true }) data!: ChartData<'bar', number[], string>;
  @Input() options?: ChartOptions<'bar'>;
  @Input() ariaLabel = 'Bar chart';
  @Input() fallbackText = 'Bar chart.';
}
