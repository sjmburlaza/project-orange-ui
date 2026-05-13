import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CartItem } from 'src/app/core/models/cart.model';

export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    'Load Cart': emptyProps(),
    'Load Cart Success': props<{ items: CartItem[] }>(),
    'Load Cart Failure': props<{ error: string }>(),

    'Add To Cart': props<{ productId: number }>(),
    'Add To Cart Success': props<{ items: CartItem[] }>(),
    'Add To Cart Failure': props<{ error: string }>(),

    'Remove From Cart': props<{ productId: number }>(),
    'Remove From Cart Success': props<{ items: CartItem[] }>(),
    'Remove From Cart Failure': props<{ error: string }>(),

    'Clear Cart': emptyProps(),
    'Clear Cart Success': props<{ items: CartItem[] }>(),
    'Clear Cart Failure': props<{ error: string }>(),
  },
});
