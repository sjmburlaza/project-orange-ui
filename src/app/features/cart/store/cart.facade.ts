import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AddToCartRequest } from 'src/app/core/models/cart.model';
import { CartActions } from './cart.actions';
import {
  selectCart,
  selectCartItems,
  selectCartSummary,
  selectCartItemCount,
  selectCartTotal,
  selectLoading,
  selectError,
} from './cart.selector';
import { Actions, ofType } from '@ngrx/effects';

@Injectable({ providedIn: 'root' })
export class CartFacade {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  readonly cart$ = this.store.select(selectCart);
  readonly items$ = this.store.select(selectCartItems);
  readonly summary$ = this.store.select(selectCartSummary);
  readonly itemCount$ = this.store.select(selectCartItemCount);
  readonly total$ = this.store.select(selectCartTotal);
  readonly loading$ = this.store.select(selectLoading);
  readonly error$ = this.store.select(selectError);

  readonly addToCartSuccess$ = this.actions$.pipe(
    ofType(CartActions.addToCartSuccess),
  );

  loadCart(): void {
    this.store.dispatch(CartActions.loadCart());
  }

  addToCart(request: AddToCartRequest): void {
    this.store.dispatch(CartActions.addToCart({ request }));
  }

  updateQuantity(productId: number, quantity: number): void {
    this.store.dispatch(
      CartActions.updateQuantity({
        productId,
        quantity,
      }),
    );
  }

  removeItem(productId: number): void {
    this.store.dispatch(CartActions.removeItem({ productId }));
  }

  applyVoucher(code: string): void {
    this.store.dispatch(CartActions.applyVoucher({ code }));
  }

  clearCart(): void {
    this.store.dispatch(CartActions.clearCart());
  }
}
