import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingStepComponent } from './shipping-step.component';

describe('ShippingStepComponent', () => {
  let component: ShippingStepComponent;
  let fixture: ComponentFixture<ShippingStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
