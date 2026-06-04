import { createSelector } from '@ngrx/store';
import { tradeInFeature } from './trade-in.reducer';

export const {
  selectConfig,
  selectCategories,
  selectBrands,
  selectDevices,
  selectStorages,
  selectCurrentSession,
  selectLoadingConfig,
  selectLoadingCategories,
  selectLoadingBrands,
  selectLoadingDevices,
  selectLoadingStorages,
  selectLoadingSession,
  selectSavingSession,
  selectConfirmingSession,
  selectError,
} = tradeInFeature;

export const selectLoadingOptions = createSelector(
  selectLoadingCategories,
  selectLoadingBrands,
  selectLoadingDevices,
  selectLoadingStorages,
  (
    loadingCategories,
    loadingBrands,
    loadingDevices,
    loadingStorages,
  ): boolean =>
    loadingCategories || loadingBrands || loadingDevices || loadingStorages,
);

export const selectBusy = createSelector(
  selectLoadingConfig,
  selectLoadingOptions,
  selectLoadingSession,
  selectSavingSession,
  selectConfirmingSession,
  (
    loadingConfig,
    loadingOptions,
    loadingSession,
    savingSession,
    confirmingSession,
  ): boolean =>
    loadingConfig ||
    loadingOptions ||
    loadingSession ||
    savingSession ||
    confirmingSession,
);
