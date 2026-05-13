import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, MatButtonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() currency!: string;
  @Output() addToCart = new EventEmitter<number>();

  onAddToCart(value: number): void {
    if (value) {
      this.addToCart.emit(value);
    }
  }
}
