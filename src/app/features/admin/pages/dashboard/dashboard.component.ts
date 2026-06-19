import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import {
  AnalyticsDashboardPeriod,
  AnalyticsInfoTooltip,
  AnalyticsMetricCard,
} from 'src/app/core/models/analytics.model';
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
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly siteService = inject(SiteService);

  readonly periodOptions: readonly AnalyticsPeriodOption[] = [
    { value: 'last-7-days', label: 'Last 7 days' },
    { value: 'past-month', label: 'Past month' },
    { value: 'past-year', label: 'Past year' },
    { value: 'from-start', label: 'From the start' },
  ];
  readonly isPeriodMenuOpen = signal(false);
  readonly selectedPeriod = signal<AnalyticsDashboardPeriod>('last-7-days');
  readonly dashboard = this.analytics.dashboard;
  readonly currency = computed(() => this.siteService.currency() || 'PHP');
  readonly selectedPeriodLabel = computed(
    () =>
      this.periodOptions.find(
        (option) => option.value === this.selectedPeriod(),
      )?.label ?? 'Last 7 days',
  );
  readonly overviewCards = computed<AnalyticsMetricCard[]>(() => {
    const data = this.dashboard();

    return [
      {
        label: 'Visitors',
        value: this.formatNumber(data.visitors),
        helper: 'Unique visitors',
        info: cardInfo('Unique visitors recorded during the selected period.'),
      },
      {
        label: 'Product views',
        value: this.formatNumber(data.productViews),
        helper: 'Catalog item views',
        info: cardInfo('Total product view events tracked for catalog items.'),
      },
      {
        label: 'Add-to-cart rate',
        value: this.formatPercent(data.addToCartRate),
        helper: `${this.formatNumber(data.addToCarts)} add-to-cart events`,
        info: cardInfo('Add-to-cart events divided by product view events.'),
        tone: 'good',
      },
      {
        label: 'Checkout start rate',
        value: this.formatPercent(data.checkoutStartRate),
        helper: `${this.formatNumber(data.checkoutStarts)} checkout starts`,
        info: cardInfo('Checkout starts divided by add-to-cart events.'),
      },
      {
        label: 'Purchase conversion',
        value: this.formatPercent(data.purchaseConversionRate),
        helper: `${this.formatNumber(data.purchases)} completed orders`,
        info: cardInfo('Completed purchases divided by unique visitors.'),
        tone: 'good',
      },
      {
        label: 'Revenue',
        value: this.formatMoney(data.revenue),
        helper: 'Gross sales',
        info: cardInfo('Gross sales value from completed purchases.'),
        tone: 'good',
      },
      {
        label: 'Average order value',
        value: this.formatMoney(data.averageOrderValue),
        helper: `${this.formatNumber(data.unitsSold)} units sold`,
        info: cardInfo('Gross revenue divided by completed purchases.'),
      },
      {
        label: 'Cart abandonment',
        value: this.formatPercent(data.cartAbandonmentRate),
        helper: 'Add-to-cart sessions without purchase',
        info: cardInfo('Add-to-cart activity that did not convert to purchases.'),
        tone: data.cartAbandonmentRate > 0.7 ? 'warning' : 'default',
      },
      {
        label: 'Payment failure rate',
        value: this.formatPercent(data.paymentFailureRate),
        helper: `${this.formatNumber(data.paymentFailures)} failed payments`,
        info: cardInfo(
          'Failed payment attempts divided by all payment attempts.',
        ),
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
        helper: this.selectedPeriodLabel(),
        info: cardInfo('Gross sales value from completed purchases.'),
        tone: 'good',
      },
      {
        label: 'Average order value',
        value: this.formatMoney(data.averageOrderValue),
        helper: 'Revenue divided by purchases',
        info: cardInfo('Gross revenue divided by completed purchases.'),
      },
      {
        label: 'Revenue per visitor',
        value: this.formatMoney(data.revenue / Math.max(data.visitors, 1)),
        helper: 'Gross revenue efficiency',
        info: cardInfo('Gross revenue divided by unique visitors.'),
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
        info: cardInfo('Completed purchase events in the selected period.'),
      },
      {
        label: 'Units sold',
        value: this.formatNumber(data.unitsSold),
        helper: 'Items in completed orders',
        info: cardInfo('Total item quantity across completed purchases.'),
      },
      {
        label: 'Cart abandonment',
        value: this.formatPercent(data.cartAbandonmentRate),
        helper: 'Carts not converted',
        info: cardInfo('Add-to-cart activity that did not convert to purchases.'),
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
        info: cardInfo('Unique visitors recorded during the selected period.'),
      },
      {
        label: 'Product views',
        value: this.formatNumber(data.productViews),
        helper: 'Tracked product impressions',
        info: cardInfo('Total product view events tracked for catalog items.'),
      },
      {
        label: 'Add-to-cart rate',
        value: this.formatPercent(data.addToCartRate),
        helper: 'Add-to-cart events per product view',
        info: cardInfo('Add-to-cart events divided by product view events.'),
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
        info: cardInfo('Checkout payment attempts that failed.'),
        tone: data.paymentFailures > 0 ? 'warning' : 'good',
      },
      {
        label: 'Payment failure rate',
        value: this.formatPercent(data.paymentFailureRate),
        helper: 'Failures among payment attempts',
        info: cardInfo(
          'Failed payment attempts divided by purchases plus failures.',
        ),
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
        info: cardInfo('Cart value associated with failed payment attempts.'),
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
    this.loadSelectedDashboard();
  }

  @HostListener('document:click', ['$event'])
  closePeriodMenuOnDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;

    if (target && !this.host.nativeElement.contains(target)) {
      this.closePeriodMenu();
    }
  }

  togglePeriodMenu(): void {
    this.isPeriodMenuOpen.update((isOpen) => !isOpen);
  }

  closePeriodMenu(): void {
    this.isPeriodMenuOpen.set(false);
  }

  selectPeriod(period: AnalyticsDashboardPeriod): void {
    this.closePeriodMenu();

    if (period === this.selectedPeriod()) return;

    this.selectedPeriod.set(period);
    this.loadSelectedDashboard();
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

  private loadSelectedDashboard(): void {
    this.analytics.loadDashboard(this.selectedPeriod());
  }
}

interface AnalyticsPeriodOption {
  value: AnalyticsDashboardPeriod;
  label: string;
}

function cardInfo(description: string): AnalyticsInfoTooltip {
  return { description };
}

function maxBy<T>(items: T[], getValue: (item: T) => number): number {
  return Math.max(...items.map(getValue), 1);
}
