import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FilterDropdownComponent,
  FilterOption,
} from 'src/app/shared/components/filter-dropdown/filter-dropdown.component';
import { FilterSliderComponent } from 'src/app/shared/components/filter-slider/filter-slider.component';

@Component({
  selector: 'app-product-list-toolbar',
  imports: [FilterSliderComponent, FilterDropdownComponent],
  templateUrl: './product-list-toolbar.component.html',
  styleUrl: './product-list-toolbar.component.scss',
})
export class ProductListToolbarComponent {
  @Input() categoryOptions!: FilterOption<number>[] | null;
  @Output() selectedCategoryChange = new EventEmitter<number | null>();

  selectedCategory: number | null = null;

  onCategoryChange(value: number | null): void {
    this.selectedCategory = value;
    this.selectedCategoryChange.emit(value);
  }
}
