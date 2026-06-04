import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CartItem } from 'src/app/core/models/cart.model';
import { QuantitySelectorComponent } from 'src/app/shared/components/quantity-selector/quantity-selector.component';
import { IconPipe } from 'src/app/shared/pipes/icon-pipe';

@Component({
  selector: 'app-cart-item',
  imports: [IconPipe, QuantitySelectorComponent, CurrencyPipe, TranslatePipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartItem;
  @Input({ required: true }) currency!: string;

  @Output() removeItem = new EventEmitter<number>();
  @Output() quantityChange = new EventEmitter<{
    productId: number;
    quantity: number;
  }>();

  onQuantityChange(productId: number, quantity: number): void {
    if (productId != null && quantity != null) {
      this.quantityChange.emit({ productId, quantity });
    }
  }

  onRemoveItem(productId: number) {
    if (productId != null) {
      this.removeItem.emit(productId);
    }
  }
}
