import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Category } from 'src/app/core/models/category.model';
import {
  InsurancePlan,
  MobilePlan,
  Product,
  ProductDetail,
  ProductFilters,
  ProductSort,
} from 'src/app/core/models/product.model';

export const ProductActions = createActionGroup({
  source: 'Products',
  events: {
    'Load Products': props<{ filters?: Partial<ProductFilters> }>(),
    'Load Products Success': props<{ products: Product[] }>(),
    'Load Products Failure': props<{ error: string }>(),

    'Load Categories': emptyProps(),
    'Load Categories Success': props<{ categories: Category[] }>(),
    'Load Categories Failure': props<{ error: string }>(),

    'Select Category': props<{ categoryId: number | null }>(),
    'Select Sort': props<{ sortBy: ProductSort | null }>(),
    'Set Price Filter': props<{
      minPrice: number | null;
      maxPrice: number | null;
    }>(),

    'Clear Product Filters': emptyProps(),

    'Load Product Detail': props<{ id: number }>(),
    'Load Product Detail Success': props<{ product: ProductDetail }>(),
    'Load Product Detail Failure': props<{ error: string }>(),

    'Load Product Insurance Plans': props<{ productId: number }>(),
    'Load Product Insurance Plans Success': props<{
      productId: number;
      plans: InsurancePlan[];
    }>(),
    'Load Product Insurance Plans Failure': props<{
      productId: number;
      error: string;
    }>(),

    'Load Product Mobile Plans': props<{ productId: number }>(),
    'Load Product Mobile Plans Success': props<{
      productId: number;
      plans: MobilePlan[];
    }>(),
    'Load Product Mobile Plans Failure': props<{
      productId: number;
      error: string;
    }>(),

    'Select Product': props<{ id: number }>(),
    'Clear Selected Product': emptyProps(),
  },
});
