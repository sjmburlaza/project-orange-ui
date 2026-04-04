import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, of } from 'rxjs';
import { ProductApiService } from 'src/app/features/products/services/product-api.service';
import { ProductActions } from 'src/app/features/products/store/products.actions';

@Injectable()
export class ProductEffects {
  private readonly actions$ = inject(Actions);
  private readonly productApiService = inject(ProductApiService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(() =>
        this.productApiService.getProducts().pipe(
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
