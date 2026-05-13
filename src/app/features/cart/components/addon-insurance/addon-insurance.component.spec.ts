import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonInsuranceComponent } from './addon-insurance.component';

describe('AddonInsuranceComponent', () => {
  let component: AddonInsuranceComponent;
  let fixture: ComponentFixture<AddonInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonInsuranceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddonInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
