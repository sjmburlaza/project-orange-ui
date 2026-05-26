import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-quantity-selector',
  imports: [],
  templateUrl: './quantity-selector.component.html',
  styleUrl: './quantity-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantitySelectorComponent {
  @Input() value = 1;
  @Input() min = 1;
  @Input() max = 5;
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<number>();

  decrease(): void {
    this.setValue(this.value - 1);
  }

  increase(): void {
    this.setValue(this.value + 1);
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.setValue(Number(input.value));
  }

  private setValue(value: number): void {
    if (Number.isNaN(value)) return;

    const nextValue = Math.min(Math.max(value, this.min), this.max);

    this.value = nextValue;
    this.valueChange.emit(this.value);
  }
}
