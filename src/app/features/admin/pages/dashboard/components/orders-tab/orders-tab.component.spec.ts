import {
  dashboard,
  metricCards,
  renderTab,
  textContent,
} from '../dashboard-tab.spec-fixtures';
import { OrdersTabComponent } from './orders-tab.component';

describe('OrdersTabComponent', () => {
  it('renders recent orders with order metric cards', async () => {
    const fixture = await renderTab(OrdersTabComponent, {
      cards: metricCards,
      currency: 'PHP',
      data: dashboard,
    });
    const content = textContent(fixture);

    expect(content).toContain('Orders');
    expect(content).toContain('Completed purchases');
    expect(content).toContain('Recent Orders');
    expect(content).toContain('1 latest');
    expect(content).toContain('OR-20260618-0007');
    expect(content).toContain('96');
  });
});
