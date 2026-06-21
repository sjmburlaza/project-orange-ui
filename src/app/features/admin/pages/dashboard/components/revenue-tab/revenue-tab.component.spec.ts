import {
  dashboard,
  metricCards,
  renderTab,
  textContent,
} from '../dashboard-tab.spec-fixtures';
import { RevenueTabComponent } from './revenue-tab.component';

describe('RevenueTabComponent', () => {
  it('renders revenue metrics, chart data, and category rows', async () => {
    const fixture = await renderTab(RevenueTabComponent, {
      cards: metricCards,
      currency: 'PHP',
      data: dashboard,
      maxCategoryRevenue: 383936,
    });
    const component = fixture.componentInstance;
    const content = textContent(fixture);

    expect(content).toContain('Revenue Trend');
    expect(
      fixture.nativeElement.querySelector('app-admin-line-chart'),
    ).not.toBeNull();
    expect(component.revenueChartData.labels).toEqual(['Jun 18', 'Jun 19']);
    expect(component.revenueChartData.datasets[0].data).toEqual([
      220000,
      292000,
    ]);
    expect(content).toContain('Jun 19');
    expect(content).toContain('292,000');
    expect(content).toContain('Revenue By Category');
    expect(content).toContain('Phones');
    expect(content).toContain('64 units sold');
  });
});
