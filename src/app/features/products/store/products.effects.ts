import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { ProductApiService } from 'src/app/features/products/services/product-api.service';
import { ProductActions } from 'src/app/features/products/store/products.actions';
import { CategoryApiService } from '../services/category-api.service';
import { Store } from '@ngrx/store';
import { selectProductFilters } from './products.selector';

@Injectable()
export class ProductEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  private readonly productApiService = inject(ProductApiService);
  private readonly categoryApiService = inject(CategoryApiService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(({ filters }) =>
        this.productApiService.getProducts(filters).pipe(
          map((products) => ProductActions.loadProductsSuccess({ products })),
          catchError((error) =>
            of(
              ProductActions.loadProductsFailure({
                error: this.getErrorMessage(error, 'Failed to load products'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadCategories),
      switchMap(() =>
        this.categoryApiService.getCategories().pipe(
          map((categories) =>
            ProductActions.loadCategoriesSuccess({ categories }),
          ),
          catchError((error) =>
            of(ProductActions.loadCategoriesFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  filterProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ProductActions.selectCategory,
        ProductActions.selectSort,
        ProductActions.setPriceFilter,
        ProductActions.clearProductFilters,
      ),
      withLatestFrom(this.store.select(selectProductFilters)),
      map(([, filters]) => ProductActions.loadProducts({ filters })),
    ),
  );

  loadProductDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProductDetail),
      switchMap(({ id }) =>
        this.productApiService.getProductById(id).pipe(
          map((product) =>
            ProductActions.loadProductDetailSuccess({ product }),
          ),
          catchError((error) =>
            of(
              ProductActions.loadProductDetailFailure({
                error: this.getErrorMessage(
                  error,
                  'Failed to load product detail',
                ),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadProductInsurancePlans$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProductInsurancePlans),
      switchMap(({ productId }) =>
        this.productApiService.getProductInsurancePlans(productId).pipe(
          map((plans) =>
            ProductActions.loadProductInsurancePlansSuccess({
              productId,
              plans,
            }),
          ),
          catchError((error) =>
            of(
              ProductActions.loadProductInsurancePlansFailure({
                productId,
                error: this.getErrorMessage(
                  error,
                  'Failed to load insurance plans',
                ),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadProductMobilePlans$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProductMobilePlans),
      switchMap(({ productId }) =>
        this.productApiService.getProductMobilePlans(productId).pipe(
          map((plans) =>
            ProductActions.loadProductMobilePlansSuccess({
              productId,
              plans,
            }),
          ),
          catchError((error) =>
            of(
              ProductActions.loadProductMobilePlansFailure({
                productId,
                error: this.getErrorMessage(
                  error,
                  'Failed to load mobile plans',
                ),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  private getErrorMessage(error: unknown, fallback: string): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return error.message;
    }

    return fallback;
  }
}
