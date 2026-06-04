import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ProductActions } from 'src/app/features/products/store/products.actions';
import {
  InsurancePlan,
  MobilePlan,
  ProductSort,
} from 'src/app/core/models/product.model';

import {
  selectProducts,
  selectProductListWithStockStatus,
  selectSelectedProductId,
  selectSelectedProductDetail,
  selectLoadingProducts,
  selectLoadingProductDetail,
  selectProductsError,
  selectProductDetailError,
  selectCategories,
  selectCategoriesError,
  selectCategoryOptions,
  selectLoadingCategories,
  selectSelectedCategoryId,
  selectSelectedSort,
  selectSortOptions,
  selectProductFilters,
  selectPriceRange,
  selectInsurancePlansForProduct,
  selectMobilePlansForProduct,
  selectLoadingInsurancePlansForProduct,
  selectLoadingMobilePlansForProduct,
  selectInsurancePlansErrorForProduct,
  selectMobilePlansErrorForProduct,
} from 'src/app/features/products/store/products.selector';

@Injectable({
  providedIn: 'root',
})
export class ProductFacade {
  private readonly store = inject(Store);

  readonly products$ = this.store.select(selectProducts);
  readonly productCards$ = this.store.select(selectProductListWithStockStatus);

  readonly selectedProductId$ = this.store.select(selectSelectedProductId);
  readonly selectedProductDetail$ = this.store.select(
    selectSelectedProductDetail,
  );

  readonly loadingProducts$ = this.store.select(selectLoadingProducts);
  readonly loadingProductDetail$ = this.store.select(
    selectLoadingProductDetail,
  );

  readonly productsError$ = this.store.select(selectProductsError);
  readonly productDetailError$ = this.store.select(selectProductDetailError);

  readonly categories$ = this.store.select(selectCategories);
  readonly categoryOptions$ = this.store.select(selectCategoryOptions);
  readonly selectedCategoryId$ = this.store.select(selectSelectedCategoryId);
  readonly loadingCategories$ = this.store.select(selectLoadingCategories);
  readonly categoriesError$ = this.store.select(selectCategoriesError);

  readonly selectedSort$ = this.store.select(selectSelectedSort);
  readonly sortOptions$ = this.store.select(selectSortOptions);

  readonly priceRange$ = this.store.select(selectPriceRange);

  readonly filters$ = this.store.select(selectProductFilters);

  loadProducts(): void {
    this.store.dispatch(ProductActions.loadProducts({ filters: {} }));
  }

  loadCategories(): void {
    this.store.dispatch(ProductActions.loadCategories());
  }

  selectCategory(categoryId: number | null): void {
    this.store.dispatch(ProductActions.selectCategory({ categoryId }));
  }

  selectSort(sortBy: ProductSort | null): void {
    this.store.dispatch(ProductActions.selectSort({ sortBy }));
  }

  setPriceFilter(minPrice: number | null, maxPrice: number | null): void {
    this.store.dispatch(
      ProductActions.setPriceFilter({
        minPrice,
        maxPrice,
      }),
    );
  }

  clearProductFilters(): void {
    this.store.dispatch(ProductActions.clearProductFilters());
  }

  loadProductDetail(id: number): void {
    this.store.dispatch(ProductActions.loadProductDetail({ id }));
  }

  loadProductInsurancePlans(productId: number): void {
    this.store.dispatch(ProductActions.loadProductInsurancePlans({ productId }));
  }

  loadProductMobilePlans(productId: number): void {
    this.store.dispatch(ProductActions.loadProductMobilePlans({ productId }));
  }

  insurancePlans$(productId: number): Observable<InsurancePlan[]> {
    return this.store.select(selectInsurancePlansForProduct(productId));
  }

  mobilePlans$(productId: number): Observable<MobilePlan[]> {
    return this.store.select(selectMobilePlansForProduct(productId));
  }

  loadingInsurancePlans$(productId: number): Observable<boolean> {
    return this.store.select(selectLoadingInsurancePlansForProduct(productId));
  }

  loadingMobilePlans$(productId: number): Observable<boolean> {
    return this.store.select(selectLoadingMobilePlansForProduct(productId));
  }

  insurancePlansError$(productId: number): Observable<string | null> {
    return this.store.select(selectInsurancePlansErrorForProduct(productId));
  }

  mobilePlansError$(productId: number): Observable<string | null> {
    return this.store.select(selectMobilePlansErrorForProduct(productId));
  }

  selectProduct(id: number): void {
    this.store.dispatch(ProductActions.selectProduct({ id }));
  }

  clearSelectedProduct(): void {
    this.store.dispatch(ProductActions.clearSelectedProduct());
  }
}
