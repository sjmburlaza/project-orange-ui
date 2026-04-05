import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductFacade } from 'src/app/features/products/store/products.facade';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productFacade = inject(ProductFacade);

  readonly product$ = this.productFacade.selectedProductDetail$;
  readonly loading$ = this.productFacade.loadingProductDetail$;
  readonly error$ = this.productFacade.productDetailError$;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.productFacade.loadProductDetail(id);
    }
  }
}
