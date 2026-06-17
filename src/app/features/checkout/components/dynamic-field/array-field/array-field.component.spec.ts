import {
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

import { ArrayFieldComponent } from './array-field.component';

describe('ArrayFieldComponent', () => {
  let component: ArrayFieldComponent;

  beforeEach(() => {
    component = new ArrayFieldComponent();
    component.field = {
      type: 'array',
      name: 'dependents',
      label: 'Dependents',
      fields: [],
    };
    component.form = new FormGroup({
      dependents: new FormArray([
        new FormGroup({
          name: new FormControl(''),
        }),
      ]),
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
