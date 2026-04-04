import { createFeature, createReducer, on } from '@ngrx/store';
import { Product, ProductDetail } from 'src/app/core/models/product.model';
import { ProductActions } from 'src/app/features/products/store/products.actions';

export const productFeatureKey = 'products';

export interface ProductState {
  products: Product[];
  productDetails: Record<number, ProductDetail>;
  selectedProductId: number | null;

  loadingProducts: boolean;
  loadingProductDetail: boolean;

  productsError: string | null;
  productDetailError: string | null;
}

export const initialState: ProductState = {
  products: [],
  productDetails: {},
  selectedProductId: null,

  loadingProducts: false,
  loadingProductDetail: false,

  productsError: null,
  productDetailError: null,
};

const reducer = createReducer(
  initialState,

  // LOAD PRODUCTS
  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loadingProducts: true,
    productsError: null,
  })),

  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loadingProducts: false,
    productsError: null,
  })),

  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loadingProducts: false,
    productsError: error,
  })),

  // LOAD PRODUCT DETAIL
  on(ProductActions.loadProductDetail, (state, { id }) => ({
    ...state,
    selectedProductId: id,
    loadingProductDetail: true,
    productDetailError: null,
  })),

  on(ProductActions.loadProductDetailSuccess, (state, { product }) => ({
    ...state,
    productDetails: {
      ...state.productDetails,
      [product.id]: product,
    },
    selectedProductId: product.id,
    loadingProductDetail: false,
    productDetailError: null,
  })),

  on(ProductActions.loadProductDetailFailure, (state, { error }) => ({
    ...state,
    loadingProductDetail: false,
    productDetailError: error,
  })),

  // SELECT PRODUCT
  on(ProductActions.selectProduct, (state, { id }) => ({
    ...state,
    selectedProductId: id,
  })),

  // CLEAR SELECTION
  on(ProductActions.clearSelectedProduct, (state) => ({
    ...state,
    selectedProductId: null,
    productDetailError: null,
  })),
);

export const productFeature = createFeature({
  name: productFeatureKey,
  reducer,
});
