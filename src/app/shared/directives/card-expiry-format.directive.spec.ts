import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CardExpiryFormatDirective } from './card-expiry-format.directive';

@Component({
  imports: [ReactiveFormsModule, CardExpiryFormatDirective],
  template: `<input appCardExpiryFormat [formControl]="expiryDate" />`,
})
class CardExpiryFormatHostComponent {
  readonly expiryDate = new FormControl('', { nonNullable: true });
}

describe('CardExpiryFormatDirective', () => {
  let fixture: ComponentFixture<CardExpiryFormatHostComponent>;
  let component: CardExpiryFormatHostComponent;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardExpiryFormatHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardExpiryFormatHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
  });

  it('adds a slash after the month digits while typing', () => {
    writeInputValue('1230');

    expect(input.value).toBe('12/30');
    expect(component.expiryDate.value).toBe('12/30');
  });

  it('removes non-digits before formatting pasted values', () => {
    writeInputValue('12-ab-30');

    expect(input.value).toBe('12/30');
    expect(component.expiryDate.value).toBe('12/30');
  });

  it('limits the value to month and year digits', () => {
    writeInputValue('123045');

    expect(input.value).toBe('12/30');
    expect(component.expiryDate.value).toBe('12/30');
  });

  it('formats expiry dates written by the form control', () => {
    component.expiryDate.setValue('0929');
    fixture.detectChanges();

    expect(input.value).toBe('09/29');
  });

  it('marks the control as touched on blur', () => {
    input.dispatchEvent(new Event('blur'));

    expect(component.expiryDate.touched).toBe(true);
  });

  function writeInputValue(value: string): void {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  }
});
