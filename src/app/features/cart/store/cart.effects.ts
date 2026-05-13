import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CartApiService } from '../services/cart-api.service';
import { CartActions } from './cart.actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class CartEffects {
  private readonly actions$ = inject(Actions);
  private readonly cartApi = inject(CartApiService);

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      switchMap(() =>
        this.cartApi.getCart().pipe(
          map((items) => CartActions.loadCartSuccess({ items })),
          catchError((error) =>
            of(CartActions.loadCartFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addToCart),
      switchMap(({ productId }) =>
        this.cartApi.addToCart(productId).pipe(
          map((items) => CartActions.addToCartSuccess({ items })),
          catchError((error) =>
            of(CartActions.addToCartFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  removeFromCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.removeFromCart),
      switchMap(({ productId }) =>
        this.cartApi.removeFromCart(productId).pipe(
          map((items) => CartActions.removeFromCartSuccess({ items })),
          catchError((error) =>
            of(CartActions.removeFromCartFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  clearCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.clearCart),
      switchMap(() =>
        this.cartApi.clearCart().pipe(
          map((items) => CartActions.clearCartSuccess({ items })),
          catchError((error) =>
            of(CartActions.clearCartFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );
}
