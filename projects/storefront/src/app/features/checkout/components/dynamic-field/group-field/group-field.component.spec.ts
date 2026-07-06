import { FormControl, FormGroup } from '@angular/forms';

import { GroupFieldComponent } from './group-field.component';

describe('GroupFieldComponent', () => {
  let component: GroupFieldComponent;

  beforeEach(() => {
    component = new GroupFieldComponent();
    component.field = {
      type: 'group',
      name: 'address',
      label: 'Address',
      fields: [],
    };
    component.form = new FormGroup({
      address: new FormGroup({
        street: new FormControl(''),
      }),
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
