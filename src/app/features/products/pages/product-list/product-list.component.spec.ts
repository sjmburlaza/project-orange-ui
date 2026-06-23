import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

import { Product } from 'src/app/core/models/product.model';
import { ProductActions } from 'src/app/features/products/store/products.actions';
import { ProductListComponent } from './product-list.component';
import providers from 'src/test-providers';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers,
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('builds sort options for the product toolbar', () => {
    expect(component.sortOptions).toEqual([
      { label: 'Price: Low to High', value: 'price-asc' },
      { label: 'Price: High to Low', value: 'price-desc' },
      { label: 'Name: A to Z', value: 'name-asc' },
      { label: 'Name: Z to A', value: 'name-desc' },
    ]);
  });

  it('builds price slider state from product filter state', async () => {
    store.dispatch(
      ProductActions.loadProductsSuccess({
        products: [createProduct({ price: 39999 })],
        filters: {},
      }),
    );

    expect(await firstValueFrom(component.priceMax$)).toBe(39999);
    expect(await firstValueFrom(component.priceRange$)).toEqual({
      min: 0,
      max: 39999,
    });

    store.dispatch(
      ProductActions.setPriceFilter({
        minPrice: 1000,
        maxPrice: 50000,
      }),
    );

    expect(await firstValueFrom(component.priceMax$)).toBe(50000);
    expect(await firstValueFrom(component.priceRange$)).toEqual({
      min: 1000,
      max: 50000,
    });
  });

  it('detects active filters for the filtered empty state', async () => {
    expect(await firstValueFrom(component.hasActiveProductFilters$)).toBe(false);

    store.dispatch(ProductActions.selectCategory({ categoryId: 3 }));

    expect(await firstValueFrom(component.hasActiveProductFilters$)).toBe(true);
  });
});

function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: 'Orange Phone',
    description: 'A flagship phone',
    price: 39999,
    stockQuantity: 8,
    imageUrl: '/assets/phone.png',
    categoryId: 1,
    ...overrides,
  };
}
