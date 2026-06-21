import {
  dashboard,
  metricCards,
  renderTab,
} from '../dashboard-tab.spec-fixtures';
import { VisitorsTabComponent } from './visitors-tab.component';

describe('VisitorsTabComponent', () => {
  it('renders visitor activity as a chronological chart', async () => {
    const fixture = await renderTab(VisitorsTabComponent, {
      cards: metricCards,
      data: dashboard,
    });
    const component = fixture.componentInstance;

    expect(
      fixture.nativeElement.querySelector('app-admin-line-chart'),
    ).not.toBeNull();
    expect(component.dailyTrend.map((day) => day.dateKey)).toEqual([
      '2026-06-18',
      '2026-06-19',
    ]);
    expect(component.trafficChartData.labels).toEqual(['Jun 18', 'Jun 19']);
    expect(component.trafficChartData.datasets[0].data).toEqual([520, 680]);
    expect(component.trafficChartData.datasets[1].data).toEqual([1400, 2000]);
  });
});
