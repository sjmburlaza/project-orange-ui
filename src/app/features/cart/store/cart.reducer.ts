import { createFeature, createReducer, on } from '@ngrx/store';
import { Cart } from 'src/app/core/models/cart.model';
import { CartActions } from './cart.actions';
import { CartUiMessage } from 'src/app/core/models/cart-message.model';

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  voucherError: CartUiMessage | null;
}

export const initialCartState: CartState = {
  cart: null,
  loading: false,
  error: null,
  voucherError: null,
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
      CartActions.updateShipping,
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
      CartActions.updateShippingSuccess,
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
      CartActions.updateShippingFailure,
      (state, { error }) => ({
        ...state,
        loading: false,
        error,
      }),
    ),

    on(CartActions.applyVoucher, CartActions.removeVoucher, (state) => ({
      ...state,
      loading: true,
      error: null,
      voucherError: null,
    })),

    on(
      CartActions.applyVoucherSuccess,
      CartActions.removeVoucherSuccess,
      (state, { cart }) => ({
        ...state,
        cart,
        loading: false,
        error: null,
        voucherError: null,
      }),
    ),

    on(
      CartActions.applyVoucherFailure,
      CartActions.removeVoucherFailure,
      (state, { error }) => ({
        ...state,
        loading: false,
        voucherError: error,
      }),
    ),

    on(CartActions.clearVoucherError, (state) => ({
      ...state,
      voucherError: null,
    })),

    on(CartActions.clearCart, () => initialCartState),
  ),
});
