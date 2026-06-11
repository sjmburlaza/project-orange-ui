import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { Product } from 'src/app/core/models/product.model';
import { IconPipe } from 'src/app/shared/pipes/icon-pipe';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, MatButtonModule, IconPipe, TranslatePipe],
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
