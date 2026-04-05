import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SiteService } from 'src/app/core/services/site.services';
import { ProductCardComponent } from 'src/app/features/products/components/product-card/product-card.component';
import { ProductFacade } from 'src/app/features/products/store/products.facade';

@Component({
  selector: 'app-product-list',
  imports: [AsyncPipe, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private readonly productFacade = inject(ProductFacade);
  readonly siteService = inject(SiteService);

  readonly products$ = this.productFacade.products$;
  readonly loading$ = this.productFacade.loadingProducts$;
  readonly error$ = this.productFacade.productsError$;

  ngOnInit(): void {
    this.productFacade.loadProducts();
  }
}
