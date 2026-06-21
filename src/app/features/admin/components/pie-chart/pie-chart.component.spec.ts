import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { ChartData } from 'chart.js';

import { PieChartComponent } from './pie-chart.component';

describe('PieChartComponent', () => {
  let fixture: ComponentFixture<PieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PieChartComponent);
    fixture.componentRef.setInput('ariaLabel', 'Category revenue split');
    fixture.componentRef.setInput('data', {
      labels: ['Phones', 'Accessories'],
      datasets: [{ label: 'Revenue', data: [383936, 128064] }],
    } satisfies ChartData<'pie', number[], string>);
    fixture.detectChanges();
  });

  it('renders a pie chart canvas with an accessible label', () => {
    const canvas = fixture.nativeElement.querySelector(
      'canvas[baseChart]',
    ) as HTMLCanvasElement;

    expect(canvas).not.toBeNull();
    expect(canvas.getAttribute('aria-label')).toBe('Category revenue split');
  });
});
