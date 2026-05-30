import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSearchFieldComponent } from './select-search-field.component';

describe('SelectSearchFieldComponent', () => {
  let component: SelectSearchFieldComponent;
  let fixture: ComponentFixture<SelectSearchFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSearchFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSearchFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
