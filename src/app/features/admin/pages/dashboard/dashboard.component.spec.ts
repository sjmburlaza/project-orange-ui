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

    const req = http.expectOne('/api/admin/analytics/dashboard');

    expect(req.request.method).toBe('GET');
    req.flush(createDashboard());
  });

  afterEach(() => {
    http.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
