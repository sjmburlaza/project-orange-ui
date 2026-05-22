import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, of } from 'rxjs';
import { ProductApiService } from 'src/app/features/products/services/product-api.service';
import { ProductActions } from 'src/app/features/products/store/products.actions';
import { CategoryApiService } from '../services/category-api.service';

@Injectable()
export class ProductEffects {
  private readonly actions$ = inject(Actions);
  private readonly productApiService = inject(ProductApiService);
  private readonly categoryApiService = inject(CategoryApiService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(({ categoryId }) =>
        this.productApiService.getProducts(categoryId).pipe(
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

  selectCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.selectCategory),
      map(({ categoryId }) => ProductActions.loadProducts({ categoryId })),
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
