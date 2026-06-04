import { createFeature, createReducer, on } from '@ngrx/store';
import { Category } from 'src/app/core/models/category.model';
import {
  InsurancePlan,
  MobilePlan,
  Product,
  ProductDetail,
  ProductSort,
} from 'src/app/core/models/product.model';
import { ProductActions } from 'src/app/features/products/store/products.actions';

export const productFeatureKey = 'products';

export interface ProductState {
  products: Product[];
  productDetails: Record<number, ProductDetail>;
  insurancePlans: Record<number, InsurancePlan[]>;
  mobilePlans: Record<number, MobilePlan[]>;
  selectedProductId: number | null;

  categories: Category[];

  selectedCategoryId: number | null;
  selectedSort: ProductSort | null;
  minPrice: number | null;
  maxPrice: number | null;

  loadingProducts: boolean;
  loadingProductDetail: boolean;
  loadingInsurancePlans: Record<number, boolean>;
  loadingMobilePlans: Record<number, boolean>;
  loadingCategories: boolean;

  productsError: string | null;
  productDetailError: string | null;
  insurancePlansError: Record<number, string | null>;
  mobilePlansError: Record<number, string | null>;
  categoriesError: string | null;
}

export const initialState: ProductState = {
  products: [],
  productDetails: {},
  insurancePlans: {},
  mobilePlans: {},
  selectedProductId: null,

  categories: [],

  selectedCategoryId: null,
  selectedSort: null,
  minPrice: null,
  maxPrice: null,

  loadingProducts: false,
  loadingProductDetail: false,
  loadingInsurancePlans: {},
  loadingMobilePlans: {},
  loadingCategories: false,

  productsError: null,
  productDetailError: null,
  insurancePlansError: {},
  mobilePlansError: {},
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

  on(ProductActions.selectSort, (state, { sortBy }) => ({
    ...state,
    selectedSort: sortBy,
  })),

  on(ProductActions.setPriceFilter, (state, { minPrice, maxPrice }) => ({
    ...state,
    minPrice,
    maxPrice,
  })),

  on(ProductActions.clearProductFilters, (state) => ({
    ...state,
    selectedCategoryId: null,
    selectedSort: null,
    minPrice: null,
    maxPrice: null,
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

  // LOAD PRODUCT INSURANCE PLANS
  on(ProductActions.loadProductInsurancePlans, (state, { productId }) => ({
    ...state,
    loadingInsurancePlans: {
      ...state.loadingInsurancePlans,
      [productId]: true,
    },
    insurancePlansError: {
      ...state.insurancePlansError,
      [productId]: null,
    },
  })),

  on(
    ProductActions.loadProductInsurancePlansSuccess,
    (state, { productId, plans }) => ({
      ...state,
      insurancePlans: {
        ...state.insurancePlans,
        [productId]: plans,
      },
      loadingInsurancePlans: {
        ...state.loadingInsurancePlans,
        [productId]: false,
      },
      insurancePlansError: {
        ...state.insurancePlansError,
        [productId]: null,
      },
    }),
  ),

  on(
    ProductActions.loadProductInsurancePlansFailure,
    (state, { productId, error }) => ({
      ...state,
      loadingInsurancePlans: {
        ...state.loadingInsurancePlans,
        [productId]: false,
      },
      insurancePlansError: {
        ...state.insurancePlansError,
        [productId]: error,
      },
    }),
  ),

  // LOAD PRODUCT MOBILE PLANS
  on(ProductActions.loadProductMobilePlans, (state, { productId }) => ({
    ...state,
    loadingMobilePlans: {
      ...state.loadingMobilePlans,
      [productId]: true,
    },
    mobilePlansError: {
      ...state.mobilePlansError,
      [productId]: null,
    },
  })),

  on(
    ProductActions.loadProductMobilePlansSuccess,
    (state, { productId, plans }) => ({
      ...state,
      mobilePlans: {
        ...state.mobilePlans,
        [productId]: plans,
      },
      loadingMobilePlans: {
        ...state.loadingMobilePlans,
        [productId]: false,
      },
      mobilePlansError: {
        ...state.mobilePlansError,
        [productId]: null,
      },
    }),
  ),

  on(
    ProductActions.loadProductMobilePlansFailure,
    (state, { productId, error }) => ({
      ...state,
      loadingMobilePlans: {
        ...state.loadingMobilePlans,
        [productId]: false,
      },
      mobilePlansError: {
        ...state.mobilePlansError,
        [productId]: error,
      },
    }),
  ),

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
