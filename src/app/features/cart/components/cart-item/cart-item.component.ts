import { Component, Input } from '@angular/core';
import { CartItem } from 'src/app/core/models/cart.model';

@Component({
  selector: 'app-cart-item',
  imports: [],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
  @Input() item!: CartItem;
}
