import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonTradeinComponent } from './addon-tradein.component';

describe('AddonTradeinComponent', () => {
  let component: AddonTradeinComponent;
  let fixture: ComponentFixture<AddonTradeinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonTradeinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddonTradeinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
