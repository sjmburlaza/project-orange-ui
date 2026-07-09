import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDropdownComponent } from './filter-dropdown.component';

describe('FilterDropdownComponent', () => {
  let component: FilterDropdownComponent<string>;
  let fixture: ComponentFixture<FilterDropdownComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterDropdownComponent<string>);
    component = fixture.componentInstance;
    component.label = 'Sort by';
    component.emptyOptionLabel = 'Default';
    component.options = [{ label: 'Price: Low to High', value: 'price-asc' }];
    fixture.detectChanges();
  });

  it('renders its label and options', () => {
    expect(
      fixture.nativeElement.querySelector('.filter-dropdown__label')
        .textContent,
    ).toContain('Sort by');
    expect(component.options).toHaveLength(1);
  });

  it('emits the selected value', () => {
    const emit = vi.spyOn(component.selectedValueChange, 'emit');

    component.onSelectionChange('price-asc');

    expect(emit).toHaveBeenCalledWith('price-asc');
  });
});
