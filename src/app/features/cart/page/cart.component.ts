import { Component, inject, OnInit } from '@angular/core';
import { CartItemComponent } from '../components/cart-item/cart-item.component';
import { CartFacade } from '../store/cart.facade';
import { AsyncPipe } from '@angular/common';
import { AddonComponent } from '../components/addon/addon.component';
import { SiteService } from 'src/app/core/services/site.services';
import {
  Addon,
  UpdateCartItemAddonRequest,
} from 'src/app/core/models/cart.model';

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

  removeItem(productId: number): void {
    this.cartFacade.removeItem(productId);
  }

  onQuantityChange(data: { productId: number; quantity: number }): void {
    if (data.quantity === 0) {
      this.cartFacade.removeItem(data.productId);
    } else {
      this.cartFacade.updateQuantity(data.productId, data.quantity);
    }
  }

  onAddonUpsert(data: {
    productId: number;
    addonId: string;
    request: UpdateCartItemAddonRequest;
  }): void {
    this.cartFacade.upsertItemAddon(
      data.productId,
      data.addonId,
      data.request,
    );
  }

  onAddonRemove(data: { productId: number; addonId: string }): void {
    this.cartFacade.removeItemAddon(data.productId, data.addonId);
  }

  enabledAddons(addons: Addon[]): Addon[] {
    return addons.filter((addon) => this.siteService.isAddonEnabled(addon.id));
  }
}
