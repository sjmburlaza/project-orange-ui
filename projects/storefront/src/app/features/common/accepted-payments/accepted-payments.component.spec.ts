import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptedPaymentsComponent } from './accepted-payments.component';

describe('AcceptedPaymentsComponent', () => {
  let fixture: ComponentFixture<AcceptedPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptedPaymentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AcceptedPaymentsComponent);
    fixture.detectChanges();
  });

  it('renders the accepted payment logos', () => {
    const element = fixture.nativeElement as HTMLElement;
    const logos = Array.from(element.querySelectorAll('img'));

    expect(element.textContent).toContain('We accept');
    expect(logos.map((logo) => logo.alt)).toEqual([
      'Visa',
      'Mastercard',
      'American Express',
      'GCash',
    ]);
  });
});
