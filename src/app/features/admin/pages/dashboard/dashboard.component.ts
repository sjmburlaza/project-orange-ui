import {
  Component,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AnalyticsMetricCard } from 'src/app/core/models/analytics.model';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { SiteService } from 'src/app/core/services/site.services';
import { FunnelTabComponent } from './components/funnel-tab/funnel-tab.component';
import { OrdersTabComponent } from './components/orders-tab/orders-tab.component';
import { OverviewTabComponent } from './components/overview-tab/overview-tab.component';
import { PaymentFailuresTabComponent } from './components/payment-failures-tab/payment-failures-tab.component';
import { RevenueTabComponent } from './components/revenue-tab/revenue-tab.component';
import { TopProductsTabComponent } from './components/top-products-tab/top-products-tab.component';
import { VisitorsTabComponent } from './components/visitors-tab/visitors-tab.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    FunnelTabComponent,
    MatTabsModule,
    OrdersTabComponent,
    OverviewTabComponent,
    PaymentFailuresTabComponent,
    RevenueTabComponent,
    TopProductsTabComponent,
    VisitorsTabComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  private readonly analytics = inject(AnalyticsService);
  private readonly siteService = inject(SiteService);

  readonly dashboard = this.analytics.dashboard;
  readonly currency = computed(() => this.siteService.currency() || 'PHP');
  readonly overviewCards = computed<AnalyticsMetricCard[]>(() => {
    const data = this.dashboard();

    return [
      {
        label: 'Visitors',
        value: this.formatNumber(data.visitors),
        helper: 'Unique visitors',
      },
      {
        label: 'Product views',
        value: this.formatNumber(data.productViews),
        helper: 'Catalog item views',
      },
      {
        label: 'Add-to-cart rate',
        value: this.formatPercent(data.addToCartRate),
        helper: `${this.formatNumber(data.addToCarts)} add-to-cart events`,
        tone: 'good',
      },
      {
        label: 'Checkout start rate',
        value: this.formatPercent(data.checkoutStartRate),
        helper: `${this.formatNumber(data.checkoutStarts)} checkout starts`,
      },
      {
        label: 'Purchase conversion',
        value: this.formatPercent(data.purchaseConversionRate),
        helper: `${this.formatNumber(data.purchases)} completed orders`,
        tone: 'good',
      },
      {
        label: 'Revenue',
        value: this.formatMoney(data.revenue),
        helper: 'Gross sales',
        tone: 'good',
      },
      {
        label: 'Average order value',
        value: this.formatMoney(data.averageOrderValue),
        helper: `${this.formatNumber(data.unitsSold)} units sold`,
      },
      {
        label: 'Cart abandonment',
        value: this.formatPercent(data.cartAbandonmentRate),
        helper: 'Add-to-cart sessions without purchase',
        tone: data.cartAbandonmentRate > 0.7 ? 'warning' : 'default',
      },
      {
        label: 'Payment failure rate',
        value: this.formatPercent(data.paymentFailureRate),
        helper: `${this.formatNumber(data.paymentFailures)} failed payments`,
        tone: data.paymentFailureRate > 0.12 ? 'danger' : 'default',
      },
    ];
  });
  readonly revenueCards = computed<AnalyticsMetricCard[]>(() => {
    const data = this.dashboard();

    return [
      {
        label: 'Revenue',
        value: this.formatMoney(data.revenue),
        helper: 'Last 7 days',
        tone: 'good',
      },
      {
        label: 'Average order value',
        value: this.formatMoney(data.averageOrderValue),
        helper: 'Revenue divided by purchases',
      },
      {
        label: 'Revenue per visitor',
        value: this.formatMoney(data.revenue / Math.max(data.visitors, 1)),
        helper: 'Gross revenue efficiency',
      },
    ];
  });
  readonly orderCards = computed<AnalyticsMetricCard[]>(() => {
    const data = this.dashboard();

    return [
      {
        label: 'Orders',
        value: this.formatNumber(data.purchases),
        helper: 'Completed purchases',
      },
      {
        label: 'Units sold',
        value: this.formatNumber(data.unitsSold),
        helper: 'Items in completed orders',
      },
      {
        label: 'Cart abandonment',
        value: this.formatPercent(data.cartAbandonmentRate),
        helper: 'Carts not converted',
      },
    ];
  });
  readonly visitorCards = computed<AnalyticsMetricCard[]>(() => {
    const data = this.dashboard();

    return [
      {
        label: 'Visitors',
        value: this.formatNumber(data.visitors),
        helper: 'Unique visitor events',
      },
      {
        label: 'Product views',
        value: this.formatNumber(data.productViews),
        helper: 'Tracked product impressions',
      },
      {
        label: 'Add-to-cart rate',
        value: this.formatPercent(data.addToCartRate),
        helper: 'Add-to-cart events per product view',
      },
    ];
  });
  readonly paymentCards = computed<AnalyticsMetricCard[]>(() => {
    const data = this.dashboard();

    return [
      {
        label: 'Payment failures',
        value: this.formatNumber(data.paymentFailures),
        helper: 'Failed checkout attempts',
        tone: data.paymentFailures > 0 ? 'warning' : 'good',
      },
      {
        label: 'Payment failure rate',
        value: this.formatPercent(data.paymentFailureRate),
        helper: 'Failures among payment attempts',
        tone: data.paymentFailureRate > 0.12 ? 'danger' : 'default',
      },
      {
        label: 'Failed value',
        value: this.formatMoney(
          data.paymentFailureEvents.reduce(
            (total, failure) => total + failure.amount,
            0,
          ),
        ),
        helper: 'Recoverable gross value',
      },
    ];
  });
  readonly maxDailyRevenue = computed(() =>
    maxBy(this.dashboard().daily, (point) => point.revenue),
  );
  readonly maxDailyVisitors = computed(() =>
    maxBy(this.dashboard().daily, (point) => point.visitors),
  );
  readonly maxDailyViews = computed(() =>
    maxBy(this.dashboard().daily, (point) => point.productViews),
  );
  readonly maxProductRevenue = computed(() =>
    maxBy(this.dashboard().topProducts, (product) => product.revenue),
  );
  readonly maxCategoryRevenue = computed(() =>
    maxBy(this.dashboard().topCategories, (category) => category.revenue),
  );

  ngOnInit(): void {
    this.analytics.loadDashboard();
  }

  private formatNumber(value: number): string {
    return new Intl.NumberFormat('en', {
      maximumFractionDigits: 0,
    }).format(value);
  }

  private formatPercent(value: number): string {
    return new Intl.NumberFormat('en', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  }

  private formatMoney(value: number): string {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: this.currency(),
      maximumFractionDigits: 0,
    }).format(value);
  }
}

function maxBy<T>(items: T[], getValue: (item: T) => number): number {
  return Math.max(...items.map(getValue), 1);
}
