import {
  dashboard,
  firstBarWidth,
  metricCards,
  renderTab,
  textContent,
} from '../dashboard-tab.spec-fixtures';
import { OverviewTabComponent } from './overview-tab.component';

describe('OverviewTabComponent', () => {
  it('renders metrics, funnel health, and top products', async () => {
    const fixture = await renderTab(OverviewTabComponent, {
      cards: metricCards,
      currency: 'PHP',
      data: dashboard,
    });
    const content = textContent(fixture);

    expect(content).toContain('Visitors');
    expect(content).toContain('1,200');
    expect(content).toContain('Unique visitors');
    expect(content).toContain('Funnel Health');
    expect(content).toContain('Top Products');
    expect(content).toContain('iPhone 15');
    expect(firstBarWidth(fixture)).toBe('100%');
  });
});
