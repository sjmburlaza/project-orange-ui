import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

export interface FilterOption<T = string> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-filter-dropdown',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatOptionModule],
  templateUrl: './filter-dropdown.component.html',
  styleUrl: './filter-dropdown.component.scss',
})
export class FilterDropdownComponent<T = string> {
  @Input() label = '';
  @Input() placeholder = 'Select option';
  @Input() options: FilterOption<T>[] = [];
  @Input() selectedValue: T | null = null;

  @Output() selectedValueChange = new EventEmitter<T | null>();

  onSelectionChange(value: T | null): void {
    this.selectedValueChange.emit(value);
  }
}
