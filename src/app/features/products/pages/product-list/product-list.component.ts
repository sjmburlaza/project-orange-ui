import { AsyncPipe, getCurrencySymbol } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { Category } from 'src/app/core/models/category.model';
import { Product, ProductSort } from 'src/app/core/models/product.model';
import { SiteService } from 'src/app/core/services/site.services';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ProductCardComponent } from 'src/app/features/products/components/product-card/product-card.component';
import { ProductFacade } from 'src/app/features/products/store/products.facade';
import { ProductListToolbarComponent } from 'src/app/features/products/components/product-list-toolbar/product-list-toolbar.component';
import { RangeValue } from 'src/app/shared/components/range-slider/range-slider.component';
import { SelectOption } from 'src/app/shared/components/select-dropdown/select-dropdown.component';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  Subject,
  withLatestFrom,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-product-list',
  imports: [
    AsyncPipe,
    ProductCardComponent,
    ProductListToolbarComponent,
    TranslatePipe,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private readonly productFacade = inject(ProductFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly analytics = inject(AnalyticsService);
  readonly siteService = inject(SiteService);

  readonly products$ = this.productFacade.products$;
  readonly loading$ = this.productFacade.loadingProducts$;
  readonly error$ = this.productFacade.productsError$;

  readonly selectedCategoryId$ = this.productFacade.selectedCategoryId$;

  readonly sortOptions: SelectOption<ProductSort>[] = [
    {
      label: 'Price: Low to High',
      value: 'price-asc',
    },
    {
      label: 'Price: High to Low',
      value: 'price-desc',
    },
    {
      label: 'Name: A to Z',
      value: 'name-asc',
    },
    {
      label: 'Name: Z to A',
      value: 'name-desc',
    },
  ];
  readonly selectedSort$ = this.productFacade.selectedSort$;

  readonly priceMax$ = combineLatest([
    this.productFacade.priceFilterMax$,
    this.productFacade.maxPrice$,
  ]).pipe(
    map(([priceFilterMax, selectedMaxPrice]) =>
      Math.max(priceFilterMax ?? 0, selectedMaxPrice ?? 0),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly priceRange$ = combineLatest([
    this.productFacade.minPrice$,
    this.productFacade.maxPrice$,
    this.priceMax$,
  ]).pipe(
    map(
      ([minPrice, maxPrice, priceMax]): RangeValue => ({
        min: minPrice ?? 0,
        max: maxPrice ?? priceMax,
      }),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly hasActiveProductFilters$ = combineLatest([
    this.selectedCategoryId$,
    this.productFacade.minPrice$,
    this.productFacade.maxPrice$,
  ]).pipe(
    map(
      ([categoryId, minPrice, maxPrice]) =>
        categoryId !== null || minPrice !== null || maxPrice !== null,
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly pricePrefix = computed(() => {
    const currency = this.siteService.currency();

    return currency ? getCurrencySymbol(currency, 'narrow') : '';
  });

  private readonly priceRangeChange$ = new Subject<RangeValue>();

  ngOnInit(): void {
    this.initializeProductList();
    this.watchCategoryRouteParam();
    this.trackProductViews();

    this.priceRangeChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (prev, curr) => prev.min === curr.min && prev.max === curr.max,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((val) => {
        this.productFacade.setPriceFilter(val.min, val.max);
      });
  }

  private initializeProductList(): void {
    this.productFacade.loadCategories();
    this.productFacade.clearProductFilters();
  }

  private watchCategoryRouteParam(): void {
    combineLatest([
      this.route.queryParamMap.pipe(
        map((params) => this.normalizeCategorySlug(params.get('category'))),
        distinctUntilChanged(),
      ),
      this.productFacade.categories$,
    ])
      .pipe(
        filter(([, categories]) => categories.length > 0),
        map(([categorySlug, categories]) =>
          this.findCategoryId(categories, categorySlug),
        ),
        distinctUntilChanged(),
        withLatestFrom(this.selectedCategoryId$),
        filter(
          ([categoryId, selectedCategoryId]) =>
            categoryId !== selectedCategoryId,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([categoryId]) => {
        this.productFacade.selectCategory(categoryId);
      });
  }

  onSortChange(sortBy: ProductSort | null): void {
    this.productFacade.selectSort(sortBy);
  }

  onApplyPriceFilter(value: RangeValue): void {
    this.priceRangeChange$.next(value);
  }

  onClearFilters(): void {
    this.productFacade.clearProductFilters();
    this.clearCategoryQueryParam();
  }

  configureProduct(product: Product): void {
    const site = this.siteService.currentSite();

    this.router.navigate(['/', site, 'products', product.id, 'configure']);
  }

  viewProductDetail(product: Product): void {
    const site = this.siteService.currentSite();

    this.router.navigate(['/', site, 'products', product.id]);
  }

  private trackProductViews(): void {
    this.products$
      .pipe(
        filter((products) => products.length > 0),
        distinctUntilChanged(
          (previous, current) =>
            previous.map((product) => product.id).join(',') ===
            current.map((product) => product.id).join(','),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((products) => {
        this.analytics.trackProductViews(products);
      });
  }

  private findCategoryId(
    categories: Category[],
    categorySlug: string | null,
  ): number | null {
    if (!categorySlug) {
      return null;
    }

    const category = categories.find((item) => {
      const itemSlug = this.normalizeCategorySlug(item.name);

      if (!itemSlug) {
        return false;
      }

      return (
        itemSlug === categorySlug ||
        itemSlug.endsWith(`-${categorySlug}`) ||
        categorySlug.endsWith(`-${itemSlug}`)
      );
    });

    return category?.id ?? null;
  }

  private normalizeCategorySlug(
    category: string | null | undefined,
  ): string | null {
    const slug = category
      ?.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return slug || null;
  }

  private clearCategoryQueryParam(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: null },
      queryParamsHandling: 'merge',
    });
  }
}
