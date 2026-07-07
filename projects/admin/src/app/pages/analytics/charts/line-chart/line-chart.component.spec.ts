import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { ChartData } from 'chart.js';

import { LineChartComponent } from './line-chart.component';

describe('LineChartComponent', () => {
  let fixture: ComponentFixture<LineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartComponent);
    fixture.componentRef.setInput('ariaLabel', 'Revenue trend');
    fixture.componentRef.setInput('data', {
      labels: ['Jun 18', 'Jun 19'],
      datasets: [{ label: 'Revenue', data: [220000, 292000] }],
    } satisfies ChartData<'line', number[], string>);
    fixture.detectChanges();
  });

  it('renders a line chart canvas with an accessible label', () => {
    const canvas = fixture.nativeElement.querySelector(
      'canvas[baseChart]',
    ) as HTMLCanvasElement;

    expect(canvas).not.toBeNull();
    expect(canvas.getAttribute('aria-label')).toBe('Revenue trend');
  });
});
