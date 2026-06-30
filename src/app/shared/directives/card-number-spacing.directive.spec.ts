import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CardNumberSpacingDirective } from './card-number-spacing.directive';

@Component({
  imports: [ReactiveFormsModule, CardNumberSpacingDirective],
  template: `<input appCardNumberSpacing [formControl]="cardNumber" />`,
})
class CardNumberSpacingHostComponent {
  readonly cardNumber = new FormControl('', { nonNullable: true });
}

describe('CardNumberSpacingDirective', () => {
  let fixture: ComponentFixture<CardNumberSpacingHostComponent>;
  let component: CardNumberSpacingHostComponent;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardNumberSpacingHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardNumberSpacingHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
  });

  it('adds spaces every four card number digits while typing', () => {
    writeInputValue('4242424242421111');

    expect(input.value).toBe('4242 4242 4242 1111');
    expect(component.cardNumber.value).toBe('4242 4242 4242 1111');
  });

  it('removes non-digits before formatting pasted values', () => {
    writeInputValue('4242-abcd-4242');

    expect(input.value).toBe('4242 4242');
    expect(component.cardNumber.value).toBe('4242 4242');
  });

  it('formats card numbers written by the form control', () => {
    component.cardNumber.setValue('5555444433332222');
    fixture.detectChanges();

    expect(input.value).toBe('5555 4444 3333 2222');
  });

  it('marks the control as touched on blur', () => {
    input.dispatchEvent(new Event('blur'));

    expect(component.cardNumber.touched).toBe(true);
  });

  function writeInputValue(value: string): void {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  }
});
