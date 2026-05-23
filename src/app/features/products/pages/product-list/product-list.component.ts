import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Product, ProductSort } from 'src/app/core/models/product.model';
import { SiteService } from 'src/app/core/services/site.services';
import { CartFacade } from 'src/app/features/cart/store/cart.facade';
import { ProductCardComponent } from 'src/app/features/products/components/product-card/product-card.component';
import { ProductFacade } from 'src/app/features/products/store/products.facade';
import { ProductListToolbarComponent } from 'src/app/features/products/components/product-list-toolbar/product-list-toolbar.component';

@Component({
  selector: 'app-product-list',
  imports: [AsyncPipe, ProductCardComponent, ProductListToolbarComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private readonly productFacade = inject(ProductFacade);
  private readonly cartFacade = inject(CartFacade);
  readonly siteService = inject(SiteService);

  readonly products$ = this.productFacade.products$;
  readonly loading$ = this.productFacade.loadingProducts$;
  readonly error$ = this.productFacade.productsError$;

  readonly categoryOptions$ = this.productFacade.categoryOptions$;
  readonly selectedCategoryId$ = this.productFacade.selectedCategoryId$;

  readonly sortOptions$ = this.productFacade.sortOptions$;
  readonly selectedSort$ = this.productFacade.selectedSort$;

  ngOnInit(): void {
    this.productFacade.loadCategories();
    this.productFacade.loadProducts();
  }

  onCategoryChange(categoryId: number | null): void {
    this.productFacade.selectCategory(categoryId);
  }

  onSortChange(sortBy: ProductSort | null): void {
    this.productFacade.selectSort(sortBy);
  }

  onApplyPriceFilter(minPrice: string, maxPrice: string): void {
    this.productFacade.setPriceFilter(
      minPrice ? Number(minPrice) : null,
      maxPrice ? Number(maxPrice) : null,
    );
  }

  onClearFilters(): void {
    this.productFacade.clearProductFilters();
  }

  addToCart(product: Product): void {
    this.cartFacade.addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      addons: [],
    });
  }
}
