import { Component, inject, OnInit } from '@angular/core';
import { CartItemComponent } from '../components/cart-item/cart-item.component';
import { CartFacade } from '../store/cart.facade';
import { AsyncPipe } from '@angular/common';
import { AddonComponent } from '../components/addon/addon.component';

@Component({
  selector: 'app-cart',
  imports: [AsyncPipe, CartItemComponent, AddonComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private readonly cartFacade = inject(CartFacade);

  readonly cartItems$ = this.cartFacade.cartItems$;
  readonly cartCount$ = this.cartFacade.cartCount$;
  readonly cartSubtotal$ = this.cartFacade.cartSubtotal$;
  readonly cartLoading$ = this.cartFacade.cartLoading$;
  readonly cartError$ = this.cartFacade.cartError$;
  readonly cartIsEmpty$ = this.cartFacade.cartIsEmpty$;

  ngOnInit(): void {
    this.cartFacade.loadCart();
  }
}
