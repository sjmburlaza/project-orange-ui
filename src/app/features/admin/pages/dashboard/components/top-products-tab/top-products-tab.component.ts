import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AnalyticsDashboard } from 'src/app/core/models/analytics.model';
import { barWidth } from '../dashboard-tab.utils';

@Component({
  selector: 'app-top-products-tab',
  imports: [CurrencyPipe, DecimalPipe, PercentPipe],
  templateUrl: './top-products-tab.component.html',
})
export class TopProductsTabComponent {
  @Input({ required: true }) data!: AnalyticsDashboard;
  @Input({ required: true }) currency!: string;
  @Input({ required: true }) maxProductRevenue!: number;

  readonly barWidth = barWidth;
}
