import { CartItem, CartSummaryAttribute } from 'src/app/core/models/cart.model';
import {
  selectCartItemCount,
  selectCartItems,
  selectCartTotal,
} from './cart.selector';

describe('cart selectors', () => {
  it('returns an empty item list when no cart exists', () => {
    expect(selectCartItems.projector(null)).toEqual([]);
  });

  it('sums cart quantities across all line items', () => {
    const items: CartItem[] = [
      createCartItem({ productId: 1, quantity: 2 }),
      createCartItem({ productId: 2, quantity: 3 }),
    ];

    expect(selectCartItemCount.projector(items)).toBe(5);
  });

  it('reads the total amount from the cart summary', () => {
    const summary: CartSummaryAttribute[] = [
      { name: 'Subtotal', amount: 1000 },
      { name: 'Discount', amount: -100 },
      { name: 'Total', amount: 900 },
    ];

    expect(selectCartTotal.projector(summary)).toBe(900);
  });

  it('falls back to zero when the cart summary has no total row', () => {
    expect(selectCartTotal.projector([{ name: 'Subtotal', amount: 1000 }])).toBe(
      0,
    );
  });
});

function createCartItem(overrides: Partial<CartItem>): CartItem {
  return {
    productId: 1,
    productName: 'Orange Phone',
    price: 39999,
    quantity: 1,
    stockQuantity: 8,
    imageUrl: '/assets/phone.png',
    itemSpecs: [],
    addons: [],
    ...overrides,
  };
}
