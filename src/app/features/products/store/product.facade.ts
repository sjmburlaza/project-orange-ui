import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductActions } from 'src/app/features/products/store/products.actions';
import {
  selectProducts,
  selectProductListWithStockStatus,
  selectSelectedProductId,
  selectSelectedProductDetail,
  selectLoadingProducts,
  selectLoadingProductDetail,
  selectProductsError,
  selectProductDetailError,
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

  loadProducts(): void {
    this.store.dispatch(ProductActions.loadProducts());
  }

  loadProductDetail(id: number): void {
    this.store.dispatch(ProductActions.loadProductDetail({ id }));
  }

  selectProduct(id: number): void {
    this.store.dispatch(ProductActions.selectProduct({ id }));
  }

  clearSelectedProduct(): void {
    this.store.dispatch(ProductActions.clearSelectedProduct());
  }
}
