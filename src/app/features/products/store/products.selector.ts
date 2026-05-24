import { createSelector } from '@ngrx/store';
import { ProductFilters, ProductSort } from 'src/app/core/models/product.model';
import { productFeature } from 'src/app/features/products/store/products.reducer';
import { RangeValue } from 'src/app/shared/components/range-slider/range-slider.component';
import { SelectOption } from 'src/app/shared/components/select-dropdown/select-dropdown.component';

export const {
  selectProducts,
  selectProductDetails,
  selectSelectedProductId,

  selectCategories,
  selectSelectedCategoryId,

  selectSelectedSort,

  selectMinPrice,
  selectMaxPrice,

  selectLoadingProducts,
  selectLoadingProductDetail,
  selectLoadingCategories,

  selectProductsError,
  selectProductDetailError,
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
  (minPrice, maxPrice): RangeValue => ({
    min: minPrice ?? 0,
    max: maxPrice ?? 100000,
  }),
);
