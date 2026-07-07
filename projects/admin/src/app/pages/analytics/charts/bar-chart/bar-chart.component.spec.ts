import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { ChartData } from 'chart.js';

import { BarChartComponent } from './bar-chart.component';

describe('BarChartComponent', () => {
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BarChartComponent);
    fixture.componentRef.setInput('ariaLabel', 'Failure trend');
    fixture.componentRef.setInput('data', {
      labels: ['Jun 18', 'Jun 19'],
      datasets: [{ label: 'Payment failures', data: [1, 2] }],
    } satisfies ChartData<'bar', number[], string>);
    fixture.detectChanges();
  });

  it('renders a bar chart canvas with an accessible label', () => {
    const canvas = fixture.nativeElement.querySelector(
      'canvas[baseChart]',
    ) as HTMLCanvasElement;

    expect(canvas).not.toBeNull();
    expect(canvas.getAttribute('aria-label')).toBe('Failure trend');
  });
});
