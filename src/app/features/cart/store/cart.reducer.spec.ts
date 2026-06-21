import { Cart } from 'src/app/core/models/cart.model';
import { CartActions } from './cart.actions';
import { cartFeature, initialCartState } from './cart.reducer';

describe('cart reducer', () => {
  const cart = createCart();

  it('sets loading state when cart data is requested', () => {
    const state = cartFeature.reducer({
      ...initialCartState,
      error: 'Previous failure',
    }, CartActions.loadCart());

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores cart data and clears loading state on success', () => {
    const state = cartFeature.reducer(
      {
        ...initialCartState,
        loading: true,
        error: 'Previous failure',
      },
      CartActions.loadCartSuccess({ cart }),
    );

    expect(state.cart).toEqual(cart);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('keeps voucher errors separate from general cart errors', () => {
    const voucherError = {
      key: 'cart.voucher.error.minimumSubtotalNotMet',
      params: { minimumSubtotal: '1500.00' },
    };

    const state = cartFeature.reducer(
      {
        ...initialCartState,
        cart,
        loading: true,
        error: null,
      },
      CartActions.applyVoucherFailure({ error: voucherError }),
    );

    expect(state.cart).toEqual(cart);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.voucherError).toEqual(voucherError);
  });

  it('resets voucher errors without changing cart data', () => {
    const state = cartFeature.reducer(
      {
        ...initialCartState,
        cart,
        voucherError: { key: 'cart.voucher.error.invalidFormat' },
      },
      CartActions.clearVoucherError(),
    );

    expect(state.cart).toEqual(cart);
    expect(state.voucherError).toBeNull();
  });

  it('clears all cart state when the cart is cleared', () => {
    const state = cartFeature.reducer(
      {
        cart,
        loading: true,
        error: 'Failed',
        voucherError: { key: 'cart.voucher.error.invalidFormat' },
      },
      CartActions.clearCart(),
    );

    expect(state).toEqual(initialCartState);
  });
});

function createCart(): Cart {
  return {
    code: 'cart-123',
    appliedVouchers: [
      {
        code: 'WELCOME10',
        name: 'Welcome 10',
        description: '10% off first order',
      },
    ],
    entries: [
      {
        productId: 1,
        variantId: 1001,
        productName: 'Orange Phone',
        price: 39999,
        quantity: 2,
        stockQuantity: 8,
        imageUrl: '/assets/phone.png',
        itemSpecs: [],
        addons: [],
      },
    ],
    cartSummary: [
      { name: 'Subtotal', amount: 79998 },
      { name: 'Total', amount: 75998 },
    ],
  };
}
