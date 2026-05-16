import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AddToCartRequest, Cart } from 'src/app/core/models/cart.model';

export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    'Load Cart': emptyProps(),
    'Load Cart Success': props<{ cart: Cart | null }>(),
    'Load Cart Failure': props<{ error: string }>(),

    'Add To Cart': props<{ request: AddToCartRequest }>(),
    'Add To Cart Success': props<{ cart: Cart }>(),
    'Add To Cart Failure': props<{ error: string }>(),

    'Update Quantity': props<{ productId: number; quantity: number }>(),
    'Update Quantity Success': props<{ cart: Cart }>(),
    'Update Quantity Failure': props<{ error: string }>(),

    'Remove Item': props<{ productId: number }>(),
    'Remove Item Success': props<{ cart: Cart }>(),
    'Remove Item Failure': props<{ error: string }>(),

    'Apply Voucher': props<{ code: string }>(),
    'Apply Voucher Success': props<{ cart: Cart }>(),
    'Apply Voucher Failure': props<{ error: string }>(),

    'Clear Cart': emptyProps(),
  },
});
