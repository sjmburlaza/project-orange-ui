import {
  InsurancePlan,
  Product,
  ProductDetail,
} from 'src/app/core/models/product.model';
import { ProductActions } from './products.actions';
import { initialState, productFeature } from './products.reducer';

describe('products reducer', () => {
  it('sets loading state when products are requested', () => {
    const state = productFeature.reducer(
      {
        ...initialState,
        productsError: 'Previous failure',
      },
      ProductActions.loadProducts({ filters: { categoryId: 1 } }),
    );

    expect(state.loadingProducts).toBe(true);
    expect(state.productsError).toBeNull();
  });

  it('stores products and clears product loading state on success', () => {
    const products = [createProduct({ id: 1 }), createProduct({ id: 2 })];

    const state = productFeature.reducer(
      {
        ...initialState,
        loadingProducts: true,
        productsError: 'Previous failure',
      },
      ProductActions.loadProductsSuccess({ products }),
    );

    expect(state.products).toEqual(products);
    expect(state.loadingProducts).toBe(false);
    expect(state.productsError).toBeNull();
  });

  it('tracks selected filters and clears them together', () => {
    const filteredState = [
      ProductActions.selectCategory({ categoryId: 7 }),
      ProductActions.selectSort({ sortBy: 'price-desc' }),
      ProductActions.setPriceFilter({ minPrice: 1000, maxPrice: 5000 }),
    ].reduce(productFeature.reducer, initialState);

    expect(filteredState.selectedCategoryId).toBe(7);
    expect(filteredState.selectedSort).toBe('price-desc');
    expect(filteredState.minPrice).toBe(1000);
    expect(filteredState.maxPrice).toBe(5000);

    const clearedState = productFeature.reducer(
      filteredState,
      ProductActions.clearProductFilters(),
    );

    expect(clearedState.selectedCategoryId).toBeNull();
    expect(clearedState.selectedSort).toBeNull();
    expect(clearedState.minPrice).toBeNull();
    expect(clearedState.maxPrice).toBeNull();
  });

  it('caches loaded product details by product id', () => {
    const existingDetail = createProductDetail({ id: 1, name: 'Phone One' });
    const loadedDetail = createProductDetail({ id: 2, name: 'Phone Two' });

    const state = productFeature.reducer(
      {
        ...initialState,
        productDetails: { [existingDetail.id]: existingDetail },
        selectedProductId: 2,
        loadingProductDetail: true,
        productDetailError: 'Previous failure',
      },
      ProductActions.loadProductDetailSuccess({ product: loadedDetail }),
    );

    expect(state.productDetails).toEqual({
      [existingDetail.id]: existingDetail,
      [loadedDetail.id]: loadedDetail,
    });
    expect(state.selectedProductId).toBe(loadedDetail.id);
    expect(state.loadingProductDetail).toBe(false);
    expect(state.productDetailError).toBeNull();
  });

  it('tracks addon loading and errors per product id', () => {
    const plans: InsurancePlan[] = [
      {
        name: 'Screen protection',
        code: 'screen-protect',
        description: 'Accidental damage protection',
        amount: '499.00',
      },
    ];

    const loadingState = productFeature.reducer(
      initialState,
      ProductActions.loadProductInsurancePlans({ productId: 42 }),
    );

    expect(loadingState.loadingInsurancePlans[42]).toBe(true);
    expect(loadingState.insurancePlansError[42]).toBeNull();

    const successState = productFeature.reducer(
      loadingState,
      ProductActions.loadProductInsurancePlansSuccess({
        productId: 42,
        plans,
      }),
    );

    expect(successState.insurancePlans[42]).toEqual(plans);
    expect(successState.loadingInsurancePlans[42]).toBe(false);
    expect(successState.insurancePlansError[42]).toBeNull();

    const failureState = productFeature.reducer(
      successState,
      ProductActions.loadProductMobilePlansFailure({
        productId: 99,
        error: 'Plans unavailable',
      }),
    );

    expect(failureState.loadingMobilePlans[99]).toBe(false);
    expect(failureState.mobilePlansError[99]).toBe('Plans unavailable');
  });
});

function createProduct(overrides: Partial<Product>): Product {
  return {
    id: 1,
    name: 'Orange Phone',
    description: 'A flagship phone',
    price: 39999,
    stockQuantity: 8,
    imageUrl: '/assets/phone.png',
    categoryId: 1,
    ...overrides,
  };
}

function createProductDetail(overrides: Partial<ProductDetail>): ProductDetail {
  return createProduct(overrides);
}
