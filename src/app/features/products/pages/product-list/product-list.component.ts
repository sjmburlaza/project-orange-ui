import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Product, ProductSort } from 'src/app/core/models/product.model';
import { SiteService } from 'src/app/core/services/site.services';
import { CartFacade } from 'src/app/features/cart/store/cart.facade';
import { ProductCardComponent } from 'src/app/features/products/components/product-card/product-card.component';
import { ProductFacade } from 'src/app/features/products/store/products.facade';
import { ProductListToolbarComponent } from 'src/app/features/products/components/product-list-toolbar/product-list-toolbar.component';
import { RangeValue } from 'src/app/shared/components/range-slider/range-slider.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
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
  private readonly cartFacade = inject(CartFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  readonly siteService = inject(SiteService);

  readonly products$ = this.productFacade.products$;
  readonly loading$ = this.productFacade.loadingProducts$;
  readonly error$ = this.productFacade.productsError$;

  readonly categoryOptions$ = this.productFacade.categoryOptions$;
  readonly selectedCategoryId$ = this.productFacade.selectedCategoryId$;

  readonly sortOptions$ = this.productFacade.sortOptions$;
  readonly selectedSort$ = this.productFacade.selectedSort$;

  readonly priceRange$ = this.productFacade.priceRange$;
  private readonly priceRangeChange$ = new Subject<RangeValue>();

  ngOnInit(): void {
    this.productFacade.loadCategories();
    this.productFacade.loadProducts();

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

    this.cartFacade.addToCartSuccess$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '520px',
          maxWidth: '90vw',
          data: {
            title: 'products.cart.addedTitle',
            message: 'products.cart.addedMessage',
            cancel: 'products.cart.continueShopping',
            proceed: 'products.cart.goToCart',
          },
        });

        dialogRef.afterClosed().subscribe((res) => {
          if (res === 'proceed') {
            const site = this.siteService.currentSite();
            this.router.navigate([`/${site}/cart`]);
          }
        });
      });
  }

  onCategoryChange(categoryId: number | null): void {
    this.productFacade.selectCategory(categoryId);
  }

  onSortChange(sortBy: ProductSort | null): void {
    this.productFacade.selectSort(sortBy);
  }

  onApplyPriceFilter(value: RangeValue): void {
    this.priceRangeChange$.next(value);
  }

  onClearFilters(): void {
    this.productFacade.clearProductFilters();
  }

  addToCart(product: Product): void {
    this.cartFacade.addToCart({
      productId: product.id,
      quantity: 1,
      addons: [],
    });
  }
}
