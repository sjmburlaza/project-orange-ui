import { createFeatureSelector, createSelector } from '@ngrx/store';
import { cartFeatureKey, CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>(cartFeatureKey);

export const selectCartItems = createSelector(
  selectCartState,
  (state) => state.items,
);

export const selectCartLoading = createSelector(
  selectCartState,
  (state) => state.loading,
);

export const selectCartError = createSelector(
  selectCartState,
  (state) => state.error,
);

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.quantity, 0),
);

export const selectCartIsEmpty = createSelector(
  selectCartItems,
  (items) => items.length === 0,
);

export const selectCartSubtotal = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0),
);
