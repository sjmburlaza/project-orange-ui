import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { InputFieldComponent } from './input-field.component';
import { DynamicField } from 'src/app/core/models/checkout.model';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;
    const field: DynamicField = {
      type: 'text',
      name: 'firstName',
      label: 'First name',
    };

    component.field = field;
    component.form = new FormGroup({
      firstName: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
