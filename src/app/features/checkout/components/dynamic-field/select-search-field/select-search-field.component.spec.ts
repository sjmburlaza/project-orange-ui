import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs';

import { SelectSearchFieldComponent } from './select-search-field.component';
import { DynamicField } from 'src/app/core/models/checkout.model';
import { OptionsService } from 'src/app/features/checkout/services/options.service';

describe('SelectSearchFieldComponent', () => {
  let component: SelectSearchFieldComponent;
  let fixture: ComponentFixture<SelectSearchFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSearchFieldComponent],
      providers: [
        {
          provide: OptionsService,
          useValue: {
            getOptions: () => of([{ label: 'Metro Manila', value: 'metro' }]),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSearchFieldComponent);
    component = fixture.componentInstance;
    const field: DynamicField = {
      type: 'select-search',
      name: 'city',
      label: 'City',
      optionsApi: '/api/options/cities',
    };

    component.field = field;
    component.form = new FormGroup({
      city: new FormControl(null),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
