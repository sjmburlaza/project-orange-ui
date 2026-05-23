import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductSort } from 'src/app/core/models/product.model';

import { FilterSliderComponent } from 'src/app/shared/components/filter-slider/filter-slider.component';
import {
  SelectDropdownComponent,
  SelectOption,
} from 'src/app/shared/components/select-dropdown/select-dropdown.component';

@Component({
  selector: 'app-product-list-toolbar',
  imports: [FilterSliderComponent, SelectDropdownComponent],
  templateUrl: './product-list-toolbar.component.html',
  styleUrl: './product-list-toolbar.component.scss',
})
export class ProductListToolbarComponent {
  @Input() categoryOptions!: SelectOption<number>[] | null;
  @Input() sortOptions!: SelectOption<ProductSort>[] | null;

  @Input() selectedCategory: number | null = null;
  @Input() selectedSort: ProductSort | null = null;

  @Output() categoryChange = new EventEmitter<number | null>();
  @Output() sortChange = new EventEmitter<ProductSort | null>();

  onCategoryChange(value: number | null): void {
    this.categoryChange.emit(value);
  }

  onSortChange(value: ProductSort | null): void {
    this.sortChange.emit(value);
  }
}
