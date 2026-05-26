import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Product } from 'src/app/core/models/product.model';
import { CategoryIconPipe } from 'src/app/shared/pipes/category-icon-pipe';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, MatButtonModule, CategoryIconPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() currency!: string;
  @Output() addToCart = new EventEmitter<Product>();

  onAddToCart(value: Product): void {
    if (value) {
      this.addToCart.emit(value);
    }
  }
}
