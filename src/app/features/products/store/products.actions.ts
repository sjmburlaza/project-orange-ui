import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Category } from 'src/app/core/models/category.model';
import { Product, ProductDetail } from 'src/app/core/models/product.model';

export const ProductActions = createActionGroup({
  source: 'Products',
  events: {
    'Load Products': props<{ categoryId?: number | null }>(),
    'Load Products Success': props<{ products: Product[] }>(),
    'Load Products Failure': props<{ error: string }>(),

    'Load Categories': emptyProps(),
    'Load Categories Success': props<{ categories: Category[] }>(),
    'Load Categories Failure': props<{ error: string }>(),

    'Select Category': props<{ categoryId: number | null }>(),

    'Load Product Detail': props<{ id: number }>(),
    'Load Product Detail Success': props<{ product: ProductDetail }>(),
    'Load Product Detail Failure': props<{ error: string }>(),

    'Select Product': props<{ id: number }>(),
    'Clear Selected Product': emptyProps(),
  },
});
