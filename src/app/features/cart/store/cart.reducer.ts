import { createFeature, createReducer, on } from '@ngrx/store';
import { Cart } from 'src/app/core/models/cart.model';
import { CartActions } from './cart.actions';

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

export const initialCartState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

export const cartFeature = createFeature({
  name: 'cart',

  reducer: createReducer(
    initialCartState,

    on(
      CartActions.loadCart,
      CartActions.addToCart,
      CartActions.updateQuantity,
      CartActions.removeItem,
      CartActions.applyVoucher,
      (state) => ({
        ...state,
        loading: true,
        error: null,
      }),
    ),

    on(
      CartActions.loadCartSuccess,
      CartActions.addToCartSuccess,
      CartActions.updateQuantitySuccess,
      CartActions.removeItemSuccess,
      CartActions.applyVoucherSuccess,
      (state, { cart }) => ({
        ...state,
        cart,
        loading: false,
        error: null,
      }),
    ),

    on(
      CartActions.loadCartFailure,
      CartActions.addToCartFailure,
      CartActions.updateQuantityFailure,
      CartActions.removeItemFailure,
      CartActions.applyVoucherFailure,
      (state, { error }) => ({
        ...state,
        loading: false,
        error,
      }),
    ),

    on(CartActions.clearCart, () => initialCartState),
  ),
});
