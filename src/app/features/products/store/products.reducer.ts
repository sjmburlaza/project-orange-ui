import { createFeature, createReducer, on } from '@ngrx/store';
import { Category } from 'src/app/core/models/category.model';
import { Product, ProductDetail } from 'src/app/core/models/product.model';
import { ProductActions } from 'src/app/features/products/store/products.actions';

export const productFeatureKey = 'products';

export interface ProductState {
  products: Product[];
  productDetails: Record<number, ProductDetail>;
  selectedProductId: number | null;

  categories: Category[];
  selectedCategoryId: number | null;

  loadingProducts: boolean;
  loadingProductDetail: boolean;
  loadingCategories: boolean;

  productsError: string | null;
  productDetailError: string | null;
  categoriesError: string | null;
}

export const initialState: ProductState = {
  products: [],
  productDetails: {},
  selectedProductId: null,

  categories: [],
  selectedCategoryId: null,

  loadingProducts: false,
  loadingProductDetail: false,
  loadingCategories: false,

  productsError: null,
  productDetailError: null,
  categoriesError: null,
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

  // LOAD CATEGORIES
  on(ProductActions.loadCategories, (state) => ({
    ...state,
    loadingCategories: true,
    categoriesError: null,
  })),

  on(ProductActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    loadingCategories: false,
    categoriesError: null,
  })),

  on(ProductActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loadingCategories: false,
    categoriesError: error,
  })),

  // SELECT CATEGORY
  on(ProductActions.selectCategory, (state, { categoryId }) => ({
    ...state,
    selectedCategoryId: categoryId,
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
