import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonComponent } from './addon.component';

describe('AddonComponent', () => {
  let component: AddonComponent;
  let fixture: ComponentFixture<AddonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddonComponent);
    component = fixture.componentInstance;
    component.addon = {
      id: 'insurance',
      name: 'Device protection',
      title: 'Device protection',
      description: 'Coverage for accidental damage.',
      imageUrl: '',
      isAdded: false,
    };
    component.productId = 1;
    component.variantId = 1001;
    component.currency = 'USD';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
