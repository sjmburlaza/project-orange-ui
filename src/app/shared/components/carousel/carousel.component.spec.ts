import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  CarouselComponent,
  CarouselItemDirective,
} from './carousel.component';

@Component({
  imports: [CarouselComponent, CarouselItemDirective],
  template: `
    <app-carousel
      [items]="items"
      [visibleItemCount]="2"
      previousLabel="Previous products"
      nextLabel="Next products"
    >
      <h2 carouselTitle>Featured</h2>
      <ng-template appCarouselItem let-item let-index="index">
        <article class="test-card">{{ index }}: {{ item.name }}</article>
      </ng-template>
    </app-carousel>
  `,
})
class CarouselHostComponent {
  items = [
    { id: 1, name: 'One' },
    { id: 2, name: 'Two' },
    { id: 3, name: 'Three' },
  ];
}

describe('CarouselComponent', () => {
  let fixture: ComponentFixture<CarouselHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselHostComponent);
    fixture.detectChanges();
  });

  it('renders the visible item window', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelectorAll('.test-card').length).toBe(2);
    expect(element.textContent).toContain('0: One');
    expect(element.textContent).toContain('1: Two');
    expect(element.textContent).not.toContain('Three');
  });

  it('moves to the next item window', () => {
    const element: HTMLElement = fixture.nativeElement;
    const nextButton = element.querySelectorAll<HTMLButtonElement>(
      '.carousel__control',
    )[1];

    nextButton.click();
    fixture.detectChanges();

    expect(element.textContent).not.toContain('One');
    expect(element.textContent).toContain('1: Two');
    expect(element.textContent).toContain('2: Three');
  });
});
