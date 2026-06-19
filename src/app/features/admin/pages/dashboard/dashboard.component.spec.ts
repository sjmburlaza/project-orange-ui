import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsDashboard } from 'src/app/core/models/analytics.model';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const req = http.expectOne(
      (request) =>
        request.url === '/api/admin/analytics/dashboard' &&
        request.params.get('period') === 'last-7-days',
    );

    expect(req.request.method).toBe('GET');
    req.flush(createDashboard());
  });

  afterEach(() => {
    http.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows period options and reloads dashboard when a period is selected', () => {
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '.analytics__period-trigger',
    ) as HTMLButtonElement;

    expect(trigger).toBeTruthy();
    expect(trigger.textContent?.trim()).toBe('Last 7 days');

    trigger.click();
    fixture.detectChanges();

    const options = [
      ...fixture.nativeElement.querySelectorAll('.analytics__period-option'),
    ] as HTMLButtonElement[];

    expect(options.map((option) => option.textContent?.trim())).toEqual([
      'Last 7 days',
      'Past month',
      'Past year',
      'From the start',
    ]);

    options[2].click();

    const req = http.expectOne(
      (request) =>
        request.url === '/api/admin/analytics/dashboard' &&
        request.params.get('period') === 'past-year',
    );

    expect(req.request.method).toBe('GET');
    req.flush(createDashboard());
    fixture.detectChanges();

    expect(component.selectedPeriod()).toBe('past-year');
  });
});

function createDashboard(): AnalyticsDashboard {
  return {
    visitors: 0,
    productViews: 0,
    addToCarts: 0,
    checkoutStarts: 0,
    purchases: 0,
    revenue: 0,
    averageOrderValue: 0,
    addToCartRate: 0,
    checkoutStartRate: 0,
    purchaseConversionRate: 0,
    cartAbandonmentRate: 0,
    paymentFailures: 0,
    paymentFailureRate: 0,
    unitsSold: 0,
    daily: [],
    funnel: [],
    topProducts: [],
    topCategories: [],
    orders: [],
    paymentFailureEvents: [],
  };
}
