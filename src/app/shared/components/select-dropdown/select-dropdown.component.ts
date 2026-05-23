import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-select-dropdown',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatOptionModule],
  templateUrl: './select-dropdown.component.html',
  styleUrl: './select-dropdown.component.scss',
})
export class SelectDropdownComponent<T = string> {
  @Input() label = '';
  @Input() placeholder = 'Select option';
  @Input() options: SelectOption<T>[] = [];
  @Input() selectedValue: T | null = null;

  @Output() selectedValueChange = new EventEmitter<T | null>();

  onSelectionChange(value: T | null): void {
    this.selectedValueChange.emit(value);
  }
}
