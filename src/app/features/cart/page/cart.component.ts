import { Component, inject, OnInit } from '@angular/core';
import { CartItemComponent } from '../components/cart-item/cart-item.component';
import { CartFacade } from '../store/cart.facade';
import { AsyncPipe } from '@angular/common';
import { AddonComponent } from '../components/addon/addon.component';
import { SiteService } from 'src/app/core/services/site.services';

@Component({
  selector: 'app-cart',
  imports: [AsyncPipe, CartItemComponent, AddonComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private readonly cartFacade = inject(CartFacade);
  readonly siteService = inject(SiteService);
  readonly items$ = this.cartFacade.items$;
  readonly cartLoading$ = this.cartFacade.loading$;

  ngOnInit(): void {
    this.cartFacade.loadCart();
  }

  onQuantityChange(data: { productId: number; quantity: number }): void {
    this.cartFacade.updateQuantity(data.productId, data.quantity);
  }
}
