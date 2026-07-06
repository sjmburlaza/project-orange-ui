import {
  dashboard,
  renderTab,
  textContent,
} from '../dashboard-tab.spec-fixtures';
import { FunnelTabComponent } from './funnel-tab.component';

describe('FunnelTabComponent', () => {
  it('renders conversion rows', async () => {
    const fixture = await renderTab(FunnelTabComponent, {
      data: dashboard,
    });
    const content = textContent(fixture);

    expect(content).toContain('Conversion Funnel');
    expect(content).toContain('7.0% purchase conversion');
    expect(content).toContain('Product views');
    expect(content).toContain('Purchases');
    expect(content).toContain('84');
  });
});
