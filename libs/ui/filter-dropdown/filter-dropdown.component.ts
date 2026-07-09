import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

export interface FilterDropdownOption<T = string> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-filter-dropdown',
  imports: [MatOptionModule, MatSelectModule],
  templateUrl: './filter-dropdown.component.html',
  styleUrl: './filter-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDropdownComponent<T = string> {
  @Input() label = '';
  @Input() options: readonly FilterDropdownOption<T>[] = [];
  @Input() selectedValue: T | null = null;
  @Input() emptyOptionLabel = '';
  @Input() disabled = false;

  @Output() selectedValueChange = new EventEmitter<T | null>();

  onSelectionChange(value: T | null): void {
    this.selectedValueChange.emit(value);
  }
}
