import { Component, Input } from '@angular/core';
import { CartItem } from 'src/app/core/models/cart.model';
import { CategoryIconPipe } from 'src/app/shared/pipes/category-icon-pipe';

@Component({
  selector: 'app-cart-item',
  imports: [CategoryIconPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
  @Input() item!: CartItem;
}
