import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

export interface RangeValue {
  min: number;
  max: number;
}

@Component({
  selector: 'app-range-slider',
  imports: [FormsModule, MatSliderModule],
  templateUrl: './range-slider.component.html',
  styleUrl: './range-slider.component.scss',
})
export class RangeSliderComponent {
  @Input() label = 'Range';
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() value: RangeValue = { min: 0, max: 100 };

  @Output() valueChange = new EventEmitter<RangeValue>();

  onValueChange(): void {
    this.valueChange.emit({
      min: this.value.min,
      max: this.value.max,
    });
  }
}
