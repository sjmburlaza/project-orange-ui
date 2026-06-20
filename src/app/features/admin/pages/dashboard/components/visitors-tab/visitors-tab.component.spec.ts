import {
  dashboard,
  metricCards,
  renderTab,
} from '../dashboard-tab.spec-fixtures';
import { VisitorsTabComponent } from './visitors-tab.component';

describe('VisitorsTabComponent', () => {
  it('sorts visitor activity by latest day first', async () => {
    const fixture = await renderTab(VisitorsTabComponent, {
      cards: metricCards,
      data: dashboard,
      maxDailyViews: 2000,
      maxDailyVisitors: 680,
    });
    const component = fixture.componentInstance;
    const rows = fixture.nativeElement.querySelectorAll('.daily-row');

    expect(component.dailyLatestFirst.map((day) => day.dateKey)).toEqual([
      '2026-06-19',
      '2026-06-18',
    ]);
    expect(rows[0].textContent).toContain('Jun 19');
    expect(rows[0].textContent).toContain('680 / 2,000');
  });
});
