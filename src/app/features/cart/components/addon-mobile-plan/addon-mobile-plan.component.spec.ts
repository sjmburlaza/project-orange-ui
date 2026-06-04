import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonMobilePlanComponent } from './addon-mobile-plan.component';

describe('AddonMobilePlanComponent', () => {
  let component: AddonMobilePlanComponent;
  let fixture: ComponentFixture<AddonMobilePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonMobilePlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddonMobilePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
