import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSliderComponent } from './filter-slider.component';

describe('FilterSliderComponent', () => {
  let component: FilterSliderComponent;
  let fixture: ComponentFixture<FilterSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
