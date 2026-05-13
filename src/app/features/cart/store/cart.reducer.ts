import { createReducer, on } from '@ngrx/store';
import { CartItem } from 'src/app/core/models/cart.model';
import { CartActions } from './cart.actions';

export const cartFeatureKey = 'cart';

export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

export const initialCartState: CartState = {
  items: [],
  loading: false,
  error: null,
};

export const cartReducer = createReducer(
  initialCartState,

  on(
    CartActions.loadCart,
    CartActions.addToCart,
    CartActions.removeFromCart,
    CartActions.clearCart,
    (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),

  on(
    CartActions.loadCartSuccess,
    CartActions.addToCartSuccess,
    CartActions.removeFromCartSuccess,
    CartActions.clearCartSuccess,
    (state, { items }) => ({
      ...state,
      items,
      loading: false,
      error: null,
    }),
  ),

  on(
    CartActions.loadCartFailure,
    CartActions.addToCartFailure,
    CartActions.removeFromCartFailure,
    CartActions.clearCartFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    }),
  ),
);
