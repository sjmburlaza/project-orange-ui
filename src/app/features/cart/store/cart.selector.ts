import { createSelector } from '@ngrx/store';
import { cartFeature } from './cart.reducer';

export const { selectCartState, selectCart, selectLoading, selectError } =
  cartFeature;

export const selectCartItems = createSelector(
  selectCart,
  (cart) => cart?.entries ?? [],
);

export const selectAppliedVouchers = createSelector(
  selectCart,
  (cart) => cart?.appliedVouchers ?? [],
);

export const selectCartSummary = createSelector(
  selectCart,
  (cart) => cart?.cartSummary ?? [],
);

export const selectCartCode = createSelector(
  selectCart,
  (cart) => cart?.code ?? null,
);

export const selectCartItemCount = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.quantity, 0),
);

export const selectCartTotal = createSelector(
  selectCartSummary,
  (summary) => summary.find((item) => item.name === 'Total')?.amount ?? 0,
);
