import {
  dashboard,
  metricCards,
  renderTab,
  textContent,
} from '../dashboard-tab.spec-fixtures';
import { RevenueTabComponent } from './revenue-tab.component';

describe('RevenueTabComponent', () => {
  it('renders revenue metrics and trend/category rows', async () => {
    const fixture = await renderTab(RevenueTabComponent, {
      cards: metricCards,
      currency: 'PHP',
      data: dashboard,
      maxCategoryRevenue: 383936,
      maxDailyRevenue: 292000,
    });
    const content = textContent(fixture);

    expect(content).toContain('Revenue Trend');
    expect(content).toContain('Jun 19');
    expect(content).toContain('292,000');
    expect(content).toContain('Revenue By Category');
    expect(content).toContain('Phones');
    expect(content).toContain('64 units sold');
  });
});
