import {
  dashboard,
  metricCards,
  renderTab,
  textContent,
} from '../dashboard-tab.spec-fixtures';
import { PaymentFailuresTabComponent } from './payment-failures-tab.component';

describe('PaymentFailuresTabComponent', () => {
  it('renders failure rows and fallback empty state', async () => {
    const fixture = await renderTab(PaymentFailuresTabComponent, {
      cards: metricCards,
      currency: 'PHP',
      data: dashboard,
    });
    const component = fixture.componentInstance;

    expect(textContent(fixture)).toContain('Failure Trend');
    expect(
      fixture.nativeElement.querySelector('app-admin-bar-chart'),
    ).not.toBeNull();
    expect(component.failureChartData.labels).toEqual(['Jun 18', 'Jun 19']);
    expect(component.failureChartData.datasets[0].data).toEqual([1, 2]);
    expect(textContent(fixture)).toContain('Failure Log');
    expect(textContent(fixture)).toContain('Payment authorization timed out');
    expect(textContent(fixture)).toContain('1 item(s)');

    fixture.componentRef.setInput('data', {
      ...dashboard,
      paymentFailureEvents: [],
    });
    fixture.detectChanges();

    expect(textContent(fixture)).toContain('No payment failures recorded.');
  });
});
