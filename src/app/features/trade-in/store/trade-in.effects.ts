import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TradeInApiService } from '../services/trade-in-api.service';
import { TradeInActions } from './trade-in.actions';

@Injectable()
export class TradeInEffects {
  private readonly actions$ = inject(Actions);
  private readonly tradeInApi = inject(TradeInApiService);

  loadConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TradeInActions.loadConfig),
      switchMap(() =>
        this.tradeInApi.getConfig().pipe(
          map((config) => TradeInActions.loadConfigSuccess({ config })),
          catchError((error) =>
            of(
              TradeInActions.loadConfigFailure({
                error: this.getErrorMessage(error, 'Failed to load trade-in'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TradeInActions.loadCategories),
      switchMap(() =>
        this.tradeInApi.getCategories().pipe(
          map((categories) =>
            TradeInActions.loadCategoriesSuccess({ categories }),
          ),
          catchError((error) =>
            of(
              TradeInActions.loadCategoriesFailure({
                error: this.getErrorMessage(error, 'Failed to load categories'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadBrands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TradeInActions.loadBrands),
      switchMap(({ categoryCode }) =>
        this.tradeInApi.getBrands(categoryCode).pipe(
          map((brands) => TradeInActions.loadBrandsSuccess({ brands })),
          catchError((error) =>
            of(
              TradeInActions.loadBrandsFailure({
                error: this.getErrorMessage(error, 'Failed to load brands'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadDevices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TradeInActions.loadDevices),
      switchMap(({ categoryCode, brandCode }) =>
        this.tradeInApi.getDevices(categoryCode, brandCode).pipe(
          map((devices) => TradeInActions.loadDevicesSuccess({ devices })),
          catchError((error) =>
            of(
              TradeInActions.loadDevicesFailure({
                error: this.getErrorMessage(error, 'Failed to load devices'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadStorages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TradeInActions.loadStorages),
      switchMap(({ deviceCode }) =>
        this.tradeInApi.getStorages(deviceCode).pipe(
          map((storages) => TradeInActions.loadStoragesSuccess({ storages })),
          catchError((error) =>
            of(
              TradeInActions.loadStoragesFailure({
                error: this.getErrorMessage(error, 'Failed to load storages'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TradeInActions.createSession),
      switchMap(({ request }) =>
        this.tradeInApi.createSession(request).pipe(
          map((session) => TradeInActions.createSessionSuccess({ session })),
          catchError((error) =>
            of(
              TradeInActions.createSessionFailure({
                error: this.getErrorMessage(error, 'Failed to create session'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TradeInActions.loadSession),
      switchMap(({ sessionId }) =>
        this.tradeInApi.getSession(sessionId).pipe(
          map((session) => TradeInActions.loadSessionSuccess({ session })),
          catchError((error) =>
            of(
              TradeInActions.loadSessionFailure({
                error: this.getErrorMessage(error, 'Failed to load session'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateStepOne$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TradeInActions.updateStepOne),
      switchMap(({ sessionId, request }) =>
        this.tradeInApi.updateStepOne(sessionId, request).pipe(
          map((session) => TradeInActions.updateStepOneSuccess({ session })),
          catchError((error) =>
            of(
              TradeInActions.updateStepOneFailure({
                error: this.getErrorMessage(error, 'Failed to update step one'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateStepTwo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TradeInActions.updateStepTwo),
      switchMap(({ sessionId, request }) =>
        this.tradeInApi.updateStepTwo(sessionId, request).pipe(
          map((session) => TradeInActions.updateStepTwoSuccess({ session })),
          catchError((error) =>
            of(
              TradeInActions.updateStepTwoFailure({
                error: this.getErrorMessage(error, 'Failed to update step two'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateStepThree$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TradeInActions.updateStepThree),
      switchMap(({ sessionId, request }) =>
        this.tradeInApi.updateStepThree(sessionId, request).pipe(
          map((session) => TradeInActions.updateStepThreeSuccess({ session })),
          catchError((error) =>
            of(
              TradeInActions.updateStepThreeFailure({
                error: this.getErrorMessage(
                  error,
                  'Failed to update step three',
                ),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  confirmSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TradeInActions.confirmSession),
      switchMap(({ sessionId }) =>
        this.tradeInApi.confirmSession(sessionId).pipe(
          map((session) => TradeInActions.confirmSessionSuccess({ session })),
          catchError((error) =>
            of(
              TradeInActions.confirmSessionFailure({
                error: this.getErrorMessage(error, 'Failed to confirm session'),
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
