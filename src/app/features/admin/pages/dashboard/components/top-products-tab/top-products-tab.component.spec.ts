import {
  dashboard,
  renderTab,
  textContent,
} from '../dashboard-tab.spec-fixtures';
import { TopProductsTabComponent } from './top-products-tab.component';

describe('TopProductsTabComponent', () => {
  it('renders product and category rankings', async () => {
    const fixture = await renderTab(TopProductsTabComponent, {
      currency: 'PHP',
      data: dashboard,
      maxProductRevenue: 383936,
    });
    const content = textContent(fixture);

    expect(content).toContain('Top Products');
    expect(content).toContain('Ranked by revenue');
    expect(content).toContain('iPhone 15');
    expect(content).toContain('1,800 views');
    expect(content).toContain('260 carts');
    expect(content).toContain('Top Categories');
    expect(content).toContain('3.6%');
  });
});
