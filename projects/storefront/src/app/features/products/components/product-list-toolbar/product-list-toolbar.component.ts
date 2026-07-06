import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ProductSort } from 'libs/core/models/product.model';
import {
  RangeSliderComponent,
  RangeValue,
} from 'libs/shared/components/range-slider/range-slider.component';

import {
  SelectDropdownComponent,
  SelectOption,
} from 'libs/shared/components/select-dropdown/select-dropdown.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-product-list-toolbar',
  imports: [
    RangeSliderComponent,
    SelectDropdownComponent,
    MatButtonModule,
    TranslatePipe,
  ],
  templateUrl: './product-list-toolbar.component.html',
  styleUrl: './product-list-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListToolbarComponent {
  @Input() sortOptions!: SelectOption<ProductSort>[] | null;
  @Input() selectedSort: ProductSort | null = null;
  @Input() productsCount = 0;

  @Output() sortChange = new EventEmitter<ProductSort | null>();
  @Output() priceRangeChange = new EventEmitter<RangeValue>();
  @Output() clearFilters = new EventEmitter();

  readonly priceMin = 0;
  @Input() priceMax: number | null = 0;
  @Input() pricePrefix = '';

  @Input() priceRange: RangeValue | null = {
    min: this.priceMin,
    max: this.priceMin,
  };

  onPriceRangeChange(value: RangeValue): void {
    this.priceRangeChange.emit(value);
  }

  onSortChange(value: ProductSort | null): void {
    this.sortChange.emit(value);
  }
}
