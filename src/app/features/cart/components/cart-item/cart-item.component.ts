import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CartItem } from 'src/app/core/models/cart.model';
import { QuantitySelectorComponent } from 'src/app/shared/components/quantity-selector/quantity-selector.component';
import { CategoryIconPipe } from 'src/app/shared/pipes/category-icon-pipe';

@Component({
  selector: 'app-cart-item',
  imports: [
    CategoryIconPipe,
    QuantitySelectorComponent,
    CurrencyPipe,
    TranslatePipe,
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartItem;
  @Input({ required: true }) currency!: string;
  @Output() quantityChange = new EventEmitter<{
    productId: number;
    quantity: number;
  }>();

  onQuantityChange(productId: number, quantity: number): void {
    this.quantityChange.emit({ productId, quantity });
  }
}
