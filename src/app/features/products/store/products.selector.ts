import { createSelector } from '@ngrx/store';
import { ProductFilters, ProductSort } from 'src/app/core/models/product.model';
import { productFeature } from 'src/app/features/products/store/products.reducer';
import { RangeValue } from 'src/app/shared/components/range-slider/range-slider.component';
import { SelectOption } from 'src/app/shared/components/select-dropdown/select-dropdown.component';

export const {
  selectProducts,
  selectProductConfigures,
  selectInsurancePlans,
  selectMobilePlans,
  selectSelectedProductId,

  selectCategories,
  selectSelectedCategoryId,

  selectSelectedSort,

  selectMinPrice,
  selectMaxPrice,
  selectPriceFilterMax,

  selectLoadingProducts,
  selectLoadingProductConfigure,
  selectLoadingInsurancePlans,
  selectLoadingMobilePlans,
  selectLoadingCategories,

  selectProductsError,
  selectProductConfigureError,
  selectInsurancePlansError,
  selectMobilePlansError,
  selectCategoriesError,
} = productFeature;

export const selectCategoryOptions = createSelector(
  selectCategories,
  (categories) =>
    categories.map((category) => ({
      label: category.name,
      value: category.id,
    })),
);

export const selectProductFilters = createSelector(
  selectSelectedCategoryId,
  selectSelectedSort,
  selectMinPrice,
  selectMaxPrice,
  (categoryId, sortBy, minPrice, maxPrice): ProductFilters => ({
    categoryId,
    sortBy,
    minPrice,
    maxPrice,
  }),
);

export const selectHasActiveProductFilters = createSelector(
  selectSelectedCategoryId,
  selectMinPrice,
  selectMaxPrice,
  (categoryId, minPrice, maxPrice) =>
    categoryId !== null || minPrice !== null || maxPrice !== null,
);

export const selectSelectedProductConfigure = createSelector(
  selectProductConfigures,
  selectSelectedProductId,
  (productConfigures, selectedProductId) => {
    if (selectedProductId === null) {
      return null;
    }

    return productConfigures[selectedProductId] ?? null;
  },
);

export const selectHasSelectedProductConfigure = createSelector(
  selectSelectedProductConfigure,
  (product) => product !== null,
);

export const selectInsurancePlansForProduct = (productId: number) =>
  createSelector(
    selectInsurancePlans,
    (plansByProduct) => plansByProduct[productId] ?? [],
  );

export const selectMobilePlansForProduct = (productId: number) =>
  createSelector(
    selectMobilePlans,
    (plansByProduct) => plansByProduct[productId] ?? [],
  );

export const selectLoadingInsurancePlansForProduct = (productId: number) =>
  createSelector(
    selectLoadingInsurancePlans,
    (loadingByProduct) => loadingByProduct[productId] ?? false,
  );

export const selectLoadingMobilePlansForProduct = (productId: number) =>
  createSelector(
    selectLoadingMobilePlans,
    (loadingByProduct) => loadingByProduct[productId] ?? false,
  );

export const selectInsurancePlansErrorForProduct = (productId: number) =>
  createSelector(
    selectInsurancePlansError,
    (errorsByProduct) => errorsByProduct[productId] ?? null,
  );

export const selectMobilePlansErrorForProduct = (productId: number) =>
  createSelector(
    selectMobilePlansError,
    (errorsByProduct) => errorsByProduct[productId] ?? null,
  );

export const selectProductListWithStockStatus = createSelector(
  selectProducts,
  (products) =>
    products.map((product) => ({
      ...product,
      isInStock: product.stockQuantity > 0,
    })),
);

export const selectPriceMax = createSelector(
  selectPriceFilterMax,
  selectMaxPrice,
  (priceFilterMax, selectedMaxPrice) =>
    Math.max(priceFilterMax ?? 0, selectedMaxPrice ?? 0),
);

const SORT_OPTIONS: SelectOption<ProductSort>[] = [
  {
    label: 'Price: Low to High',
    value: 'price-asc',
  },
  {
    label: 'Price: High to Low',
    value: 'price-desc',
  },
  {
    label: 'Name: A to Z',
    value: 'name-asc',
  },
  {
    label: 'Name: Z to A',
    value: 'name-desc',
  },
];

export const selectSortOptions = createSelector(() => SORT_OPTIONS);

export const selectPriceRange = createSelector(
  selectMinPrice,
  selectMaxPrice,
  selectPriceMax,
  (minPrice, maxPrice, priceMax): RangeValue => ({
    min: minPrice ?? 0,
    max: maxPrice ?? priceMax,
  }),
);
