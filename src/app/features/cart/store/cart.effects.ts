import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CartApiService } from '../services/cart-api.service';
import { CartActions } from './cart.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';

@Injectable()
export class CartEffects {
  private readonly actions$ = inject(Actions);
  private readonly cartApi = inject(CartApiService);

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      switchMap(() =>
        this.cartApi.getCart().pipe(
          map((cart) => CartActions.loadCartSuccess({ cart })),
          catchError((error) =>
            of(
              CartActions.loadCartFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addToCart),
      switchMap(({ request }) =>
        this.cartApi.addToCart(request).pipe(
          tap((cart) => {
            this.cartApi.saveCartCode(cart.code);
          }),
          map((cart) => CartActions.addToCartSuccess({ cart })),
          catchError((error) =>
            of(
              CartActions.addToCartFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateQuantity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.updateQuantity),
      switchMap(({ productId, quantity }) =>
        this.cartApi.updateQuantity(productId, { quantity }).pipe(
          map((cart) => CartActions.updateQuantitySuccess({ cart })),
          catchError((error) =>
            of(
              CartActions.updateQuantityFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  removeItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.removeItem),
      switchMap(({ productId }) =>
        this.cartApi.removeItem(productId).pipe(
          map((cart) => CartActions.removeItemSuccess({ cart })),
          catchError((error) =>
            of(
              CartActions.removeItemFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  applyVoucher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.applyVoucher),
      switchMap(({ code }) =>
        this.cartApi.applyVoucher({ code }).pipe(
          map((cart) => CartActions.applyVoucherSuccess({ cart })),
          catchError((error) =>
            of(
              CartActions.applyVoucherFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  clearCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.clearCart),
        tap(() => {
          this.cartApi.clearCartCode();
        }),
      ),
    { dispatch: false },
  );

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Something went wrong.';
  }
}
