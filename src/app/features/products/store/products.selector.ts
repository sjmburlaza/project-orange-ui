import { createSelector } from '@ngrx/store';
import { productFeature } from 'src/app/features/products/store/products.reducer';

export const {
  selectProductsState,
  selectProducts,
  selectProductDetails,
  selectSelectedProductId,
  selectLoadingProducts,
  selectLoadingProductDetail,
  selectProductsError,
  selectProductDetailError,
} = productFeature;

export const selectSelectedProductDetail = createSelector(
  selectProductDetails,
  selectSelectedProductId,
  (productDetails, selectedProductId) => {
    if (selectedProductId === null) {
      return null;
    }

    return productDetails[selectedProductId] ?? null;
  },
);

export const selectHasSelectedProductDetail = createSelector(
  selectSelectedProductDetail,
  (product) => product !== null,
);

export const selectProductListWithStockStatus = createSelector(
  selectProducts,
  (products) =>
    products.map((product) => ({
      ...product,
      isInStock: product.stockQuantity > 0,
    })),
);
