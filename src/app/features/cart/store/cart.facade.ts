import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectCartCount,
  selectCartError,
  selectCartIsEmpty,
  selectCartItems,
  selectCartLoading,
  selectCartSubtotal,
} from './cart.selector';
import { CartActions } from './cart.actions';

@Injectable({ providedIn: 'root' })
export class CartFacade {
  private readonly store = inject(Store);

  readonly cartItems$ = this.store.select(selectCartItems);
  readonly cartLoading$ = this.store.select(selectCartLoading);
  readonly cartError$ = this.store.select(selectCartError);

  readonly cartCount$ = this.store.select(selectCartCount);
  readonly cartSubtotal$ = this.store.select(selectCartSubtotal);
  readonly cartIsEmpty$ = this.store.select(selectCartIsEmpty);

  loadCart(): void {
    this.store.dispatch(CartActions.loadCart());
  }

  addToCart(productId: number): void {
    this.store.dispatch(CartActions.addToCart({ productId }));
  }

  removeFromCart(productId: number): void {
    this.store.dispatch(CartActions.removeFromCart({ productId }));
  }

  clearCart(): void {
    this.store.dispatch(CartActions.clearCart());
  }
}
