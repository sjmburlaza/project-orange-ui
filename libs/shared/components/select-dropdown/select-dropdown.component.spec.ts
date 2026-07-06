import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDropdownComponent } from './select-dropdown.component';

describe('SelectDropdownComponent', () => {
  let component: SelectDropdownComponent<unknown>;
  let fixture: ComponentFixture<SelectDropdownComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
